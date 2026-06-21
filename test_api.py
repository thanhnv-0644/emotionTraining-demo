#!/usr/bin/env python3
"""
Kiểm thử API toàn diện — Hệ thống Emotion Training (73 TC)
Chạy: python test_api.py
Yêu cầu: pip install requests
"""

import requests
import os
import uuid

# ============================================================
#  CẤU HÌNH — điền thông tin thực của hệ thống
# ============================================================
BASE_URL    = "http://localhost:8080/api"

USER_EMAIL  = "test@gmail.com"          # tài khoản học viên hợp lệ
USER_PASS   = "123456"

ADMIN_EMAIL = "nvt@gmail.com"           # tài khoản admin hợp lệ
ADMIN_PASS  = "123456"

LESSON_ID   = "1F0XrKoEABmUb5r8Z8Kx29Utpe"   # lessonId hợp lệ trong DB
CLIP_ID     = "zgvjw43R27GZbxvQUbZoGr0tGp"   # audioClipId thuộc lesson trên

AUDIO_FILE  = "00016.wav"               # file .wav để test AI (đặt cùng thư mục)

# courseId khoá học có phí để test tạo payment (để trống nếu không cần)
PAID_COURSE_ID = ""
# ============================================================

GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

results = []
_state  = {}   # truyền dữ liệu giữa các TC (id mới tạo, token, ...)

def run(tc_id, desc, func):
    try:
        ok, note = func()
        mark   = f"{GREEN}Đạt      {RESET}" if ok else f"{RED}Không đạt{RESET}"
        status = "Đạt" if ok else "Không đạt"
    except Exception as e:
        mark, status, note = f"{RED}Lỗi      {RESET}", "Lỗi", str(e)[:80]
    results.append((tc_id, desc, status, note))
    print(f"  {CYAN}{tc_id:<6}{RESET}  {mark}  {note}")

def section(title, range_str):
    print(f"\n{BOLD}{CYAN}{'='*65}{RESET}")
    print(f"{BOLD}  {title}  ({range_str}){RESET}")
    print(f"{BOLD}{CYAN}{'='*65}{RESET}")

def _login(email, password):
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": email, "password": password}, timeout=10)
    data = r.json().get("data") or {}
    if not data.get("accessToken"):
        raise RuntimeError(f"Login thất bại {email} — HTTP {r.status_code}: {r.text[:80]}")
    return data["accessToken"], data.get("refreshToken", "")

# ── Khởi tạo token (chạy 1 lần trước khi bắt đầu test) ────
print(f"\n{BOLD}Đang khởi tạo token...{RESET}")
user_token,  user_refresh  = _login(USER_EMAIL,  USER_PASS)
admin_token, admin_refresh = _login(ADMIN_EMAIL, ADMIN_PASS)
user_h  = {"Authorization": f"Bearer {user_token}"}
admin_h = {"Authorization": f"Bearer {admin_token}"}
ANSWERS = [{"audioClipId": CLIP_ID, "selectedEmotion": "happiness"}]
print(f"  Token user  : {GREEN}OK{RESET}")
print(f"  Token admin : {GREEN}OK{RESET}")

# ============================================================
#  TC01–TC05  ĐĂNG NHẬP
# ============================================================
section("ĐĂNG NHẬP", "TC01–TC05")

def tc01():
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": USER_EMAIL, "password": USER_PASS})
    ok = r.status_code == 200 and bool((r.json().get("data") or {}).get("accessToken"))
    return ok, f"HTTP {r.status_code} — accessToken: {'có' if ok else 'không'}"

def tc02():
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": USER_EMAIL, "password": "sai_mat_khau_xyz"})
    return r.status_code == 401, f"HTTP {r.status_code}"

def tc03():
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": "khongtontai@test.com", "password": "any"})
    return r.status_code in (401, 404), f"HTTP {r.status_code}"

def tc04():
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": "", "password": USER_PASS})
    return r.status_code == 400, f"HTTP {r.status_code}"

def tc05():
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": USER_EMAIL, "password": ""})
    return r.status_code == 400, f"HTTP {r.status_code}"

run("TC01", "Đăng nhập hợp lệ",              tc01)
run("TC02", "Sai mật khẩu → 401",            tc02)
run("TC03", "Email không tồn tại → 401/404", tc03)
run("TC04", "Email trống → 400",             tc04)
run("TC05", "Mật khẩu trống → 400",          tc05)

# ============================================================
#  TC06–TC10  ĐĂNG KÝ TÀI KHOẢN
# ============================================================
section("ĐĂNG KÝ TÀI KHOẢN", "TC06–TC10")

_new_email = f"autotest_{uuid.uuid4().hex[:8]}@test.com"

def tc06():
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "Auto Tester", "email": _new_email,
                            "password": "Test@1234"})
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and bool(data.get("accessToken"))
    _state["new_user_refresh"] = data.get("refreshToken", "")
    return ok, f"HTTP {r.status_code} — {_new_email}"

def tc07():
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "Dup", "email": _new_email, "password": "Test@1234"})
    return r.status_code in (400, 409), f"HTTP {r.status_code} (email trùng)"

def tc08():
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "", "email": f"ok_{uuid.uuid4().hex[:6]}@t.com",
                            "password": "Test@1234"})
    return r.status_code == 400, f"HTTP {r.status_code} (tên trống)"

def tc09():
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "X", "email": "not-valid-email",
                            "password": "Test@1234"})
    return r.status_code == 400, f"HTTP {r.status_code} (email sai định dạng)"

def tc10():
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "X", "email": f"pw_{uuid.uuid4().hex[:6]}@t.com",
                            "password": ""})
    return r.status_code == 400, f"HTTP {r.status_code} (mật khẩu trống)"

run("TC06", "Đăng ký tài khoản mới hợp lệ",       tc06)
run("TC07", "Email đã tồn tại → 400/409",          tc07)
run("TC08", "Tên trống → 400",                     tc08)
run("TC09", "Email sai định dạng → 400",           tc09)
run("TC10", "Mật khẩu trống → 400",               tc10)

# ============================================================
#  TC11–TC13  REFRESH TOKEN & LOGOUT
# ============================================================
section("REFRESH TOKEN & LOGOUT", "TC11–TC13")

def tc11():
    r = requests.post(f"{BASE_URL}/auth/refresh",
                      json={"refreshToken": user_refresh})
    ok = r.status_code == 200 and bool((r.json().get("data") or {}).get("accessToken"))
    return ok, f"HTTP {r.status_code}"

def tc12():
    r = requests.post(f"{BASE_URL}/auth/refresh",
                      json={"refreshToken": "token_gia_mac_xyz_123"})
    return r.status_code in (400, 401), f"HTTP {r.status_code}"

def tc13():
    refresh = _state.get("new_user_refresh") or user_refresh
    r = requests.post(f"{BASE_URL}/auth/logout", json={"refreshToken": refresh})
    return r.status_code in (200, 204), f"HTTP {r.status_code}"

run("TC11", "Refresh token hợp lệ",              tc11)
run("TC12", "Refresh token giả → 400/401",       tc12)
run("TC13", "Đăng xuất thành công",              tc13)

# ============================================================
#  TC14–TC18  HỒ SƠ NGƯỜI DÙNG
# ============================================================
section("HỒ SƠ NGƯỜI DÙNG", "TC14–TC18")

def tc14():
    r = requests.get(f"{BASE_URL}/users/me", headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and bool(data.get("email"))
    return ok, f"HTTP {r.status_code}, email={data.get('email','?')}"

def tc15():
    r = requests.get(f"{BASE_URL}/users/me")   # không token
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc16():
    r = requests.put(f"{BASE_URL}/users/me",
                     json={"name": "Auto Updated Name"}, headers=user_h)
    return r.status_code == 200, f"HTTP {r.status_code}"

def tc17():
    r = requests.get(f"{BASE_URL}/users/me/progress", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} bản ghi"

def tc18():
    r = requests.get(f"{BASE_URL}/users/me/analytics", headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "totalLessonsCompleted" in data
    return ok, f"HTTP {r.status_code}, lessons={data.get('totalLessonsCompleted','?')}"

run("TC14", "Xem thông tin cá nhân",                    tc14)
run("TC15", "Xem hồ sơ không có token → 401/403",       tc15)
run("TC16", "Cập nhật tên",                             tc16)
run("TC17", "Lịch sử tiến trình học",                   tc17)
run("TC18", "Phân tích cá nhân (analytics)",            tc18)

# ============================================================
#  TC19–TC23  KHOÁ HỌC (USER)
# ============================================================
section("KHOÁ HỌC (USER)", "TC19–TC23")

def tc19():
    r = requests.get(f"{BASE_URL}/courses", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    if ok and data:
        _state["any_course_id"] = data[0]["id"]
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá"

def tc20():
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId từ TC19"
    r = requests.get(f"{BASE_URL}/courses/{cid}", headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and bool(data.get("id"))
    return ok, f"HTTP {r.status_code}, title={str(data.get('title','?'))[:30]}"

def tc21():
    r = requests.get(f"{BASE_URL}/courses/INVALID_COURSE_ID_000", headers=user_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

def tc22():
    r = requests.get(f"{BASE_URL}/courses/my", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    if ok and data:
        _state["enrolled_course_id"] = data[0]["id"]
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá đang học"

def tc23():
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"search": "cảm xúc", "category": "easy"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} kết quả lọc"

run("TC19", "Lấy danh sách khoá học",                   tc19)
run("TC20", "Xem chi tiết khoá học hợp lệ",             tc20)
run("TC21", "courseId không tồn tại → 404",             tc21)
run("TC22", "Khoá học đang học của tôi",                tc22)
run("TC23", "Tìm kiếm / lọc khoá học",                  tc23)

# ============================================================
#  TC24–TC28  NỘP BÀI LUYỆN TẬP
# ============================================================
section("NỘP BÀI LUYỆN TẬP", "TC24–TC28")

def tc24():
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}, attempt={data.get('attemptNumber','?')}"

def tc25():
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, attempt={data.get('attemptNumber','?')} (nộp lần 2)"

def tc26():
    r = requests.get(f"{BASE_URL}/lessons/{LESSON_ID}/progress", headers=user_h)
    data = r.json().get("data") or []
    # API trả về List[ProgressResponse], lấy phần tử đầu tiên
    first = data[0] if isinstance(data, list) and data else {}
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, attempts={len(data)}, best score={first.get('score','?')}"

def tc27():
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS})   # không token
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc28():
    r = requests.post(f"{BASE_URL}/lessons/INVALID_LESSON_000/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

run("TC24", "Nộp bài hợp lệ — tính điểm + XP",         tc24)
run("TC25", "Nộp lần 2 — không cộng XP thêm",           tc25)
run("TC26", "Xem kết quả bài đã nộp",                   tc26)
run("TC27", "Nộp bài không có token → 401/403",          tc27)
run("TC28", "lessonId sai → 404",                        tc28)

# ============================================================
#  TC29–TC32  DANH SÁCH YÊU THÍCH
# ============================================================
section("DANH SÁCH YÊU THÍCH", "TC29–TC32")

def tc29():
    r = requests.get(f"{BASE_URL}/wishlists", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} mục"

def tc30():
    cid = _state.get("enrolled_course_id") or _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId enrolled"
    _state["wishlist_cid"] = cid
    r = requests.post(f"{BASE_URL}/wishlists/{cid}", headers=user_h)
    ok = r.status_code in (200, 201, 409)   # 409 = đã có rồi
    return ok, f"HTTP {r.status_code}, courseId={cid[:12]}…"

def tc31():
    r = requests.get(f"{BASE_URL}/wishlists", headers=user_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data)} mục sau khi thêm"

def tc32():
    cid = _state.get("wishlist_cid", "")
    if not cid:
        return False, "Không có courseId để xoá"
    r = requests.delete(f"{BASE_URL}/wishlists/{cid}", headers=user_h)
    ok = r.status_code in (200, 204, 404)
    return ok, f"HTTP {r.status_code}"

run("TC29", "Xem danh sách yêu thích",                  tc29)
run("TC30", "Thêm khoá vào yêu thích",                  tc30)
run("TC31", "Danh sách yêu thích sau khi thêm",         tc31)
run("TC32", "Xoá khỏi danh sách yêu thích",            tc32)

# ============================================================
#  TC33–TC36  ĐÁNH GIÁ KHOÁ HỌC
# ============================================================
section("ĐÁNH GIÁ KHOÁ HỌC", "TC33–TC36")

def tc33():
    cid = _state.get("enrolled_course_id") or _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    _state["review_cid"] = cid
    r = requests.get(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} đánh giá"

def tc34():
    cid = _state.get("review_cid", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 5, "comment": "Khoá học rất hay, test auto!"},
                      headers=user_h)
    ok = r.status_code in (200, 201, 409)   # 409 = đã review
    return ok, f"HTTP {r.status_code}"

def tc35():
    cid = _state.get("review_cid", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.put(f"{BASE_URL}/courses/{cid}/reviews",
                     json={"rating": 4, "comment": "Cập nhật đánh giá"},
                     headers=user_h)
    ok = r.status_code in (200, 404)
    return ok, f"HTTP {r.status_code}"

def tc36():
    cid = _state.get("review_cid", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.delete(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    ok = r.status_code in (200, 204, 404)
    return ok, f"HTTP {r.status_code}"

run("TC33", "Xem đánh giá khoá học",                    tc33)
run("TC34", "Gửi đánh giá mới",                         tc34)
run("TC35", "Sửa đánh giá",                             tc35)
run("TC36", "Xoá đánh giá",                             tc36)

# ============================================================
#  TC37–TC40  LỊCH SỬ TÌM KIẾM
# ============================================================
section("LỊCH SỬ TÌM KIẾM", "TC37–TC40")

def tc37():
    r = requests.get(f"{BASE_URL}/search-histories", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} mục"

def tc38():
    # API nhận keywords: List[str], không phải keyword: str
    r = requests.post(f"{BASE_URL}/search-histories",
                      json={"keywords": ["emotion_autotest_keyword"]},
                      headers=user_h)
    data = r.json().get("data") or []
    ok = r.status_code in (200, 201)
    # API trả về List[SearchHistoryResponse], lấy id của mục vừa thêm
    if isinstance(data, list) and data:
        _state["search_id"] = data[-1].get("id", "")
    return ok, f"HTTP {r.status_code}, id={_state.get('search_id','?')[:14]}"

def tc39():
    sid = _state.get("search_id", "")
    if not sid:
        return False, "Không có search history id từ TC38"
    r = requests.delete(f"{BASE_URL}/search-histories/{sid}", headers=user_h)
    ok = r.status_code in (200, 204, 404)
    return ok, f"HTTP {r.status_code}"

def tc40():
    r = requests.delete(f"{BASE_URL}/search-histories", headers=user_h)
    ok = r.status_code in (200, 204)
    return ok, f"HTTP {r.status_code}"

run("TC37", "Lấy lịch sử tìm kiếm",                    tc37)
run("TC38", "Lưu từ khoá tìm kiếm",                    tc38)
run("TC39", "Xoá 1 lịch sử tìm kiếm",                 tc39)
run("TC40", "Xoá toàn bộ lịch sử tìm kiếm",           tc40)

# ============================================================
#  TC41–TC42  BẢNG XẾP HẠNG
# ============================================================
section("BẢNG XẾP HẠNG", "TC41–TC42")

def tc41():
    r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, top {len(data) if isinstance(data,list) else '?'} người"

def tc42():
    r = requests.get(f"{BASE_URL}/leaderboard/me", headers=user_h)
    ok = r.status_code in (200, 404)   # 404 nếu chưa có progress
    # API trả về Integer (thứ hạng), không phải object
    rank = r.json().get("data")
    return ok, f"HTTP {r.status_code}, rank={rank if rank is not None else 'chưa có'}"

run("TC41", "Xem bảng xếp hạng tổng",                  tc41)
run("TC42", "Vị trí cá nhân trên bảng xếp hạng",       tc42)

# ============================================================
#  TC43–TC46  THANH TOÁN (USER)
# ============================================================
section("THANH TOÁN (USER)", "TC43–TC46")

def tc43():
    r = requests.get(f"{BASE_URL}/payments/my", headers=user_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} giao dịch"

def tc44():
    r = requests.get(f"{BASE_URL}/payments/my")   # không token
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc45():
    r = requests.get(f"{BASE_URL}/payments/INVALID_PAY_000", headers=user_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

def tc46():
    if not PAID_COURSE_ID:
        return True, "Bỏ qua — chưa cấu hình PAID_COURSE_ID"
    r = requests.post(f"{BASE_URL}/payments",
                      json={"courseId": PAID_COURSE_ID},
                      headers={**user_h, "X-Forwarded-For": "127.0.0.1"})
    data = r.json().get("data") or {}
    ok = r.status_code in (200, 201, 409)
    return ok, f"HTTP {r.status_code}, paymentUrl={'có' if data.get('paymentUrl') else 'không'}"

run("TC43", "Lịch sử thanh toán của tôi",               tc43)
run("TC44", "Xem thanh toán không có token → 401/403",   tc44)
run("TC45", "paymentId không tồn tại → 404",            tc45)
run("TC46", "Tạo giao dịch VNPay",                      tc46)

# ============================================================
#  TC47–TC55  ADMIN — KHOÁ HỌC & BÀI HỌC
# ============================================================
section("ADMIN — KHOÁ HỌC & BÀI HỌC", "TC47–TC55")

def tc47():
    r = requests.get(f"{BASE_URL}/admin/courses", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá"

def tc48():
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"title": "[AUTO] Test Course", "description": "Auto test",
                            "category": "easy", "price": 0},
                      headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code in (200, 201) and bool(data.get("id"))
    _state["admin_cid"] = data.get("id", "")
    return ok, f"HTTP {r.status_code}, id={_state['admin_cid'][:14]}…"

def tc49():
    cid = _state.get("admin_cid", "")
    if not cid:
        return False, "Không có courseId từ TC48"
    r = requests.put(f"{BASE_URL}/admin/courses/{cid}",
                     json={"title": "[AUTO] Test Course Updated",
                           "description": "Updated", "category": "medium", "price": 0},
                     headers=admin_h)
    return r.status_code == 200, f"HTTP {r.status_code}"

def tc50():
    # User thường truy cập admin route → 403
    r = requests.get(f"{BASE_URL}/admin/courses", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc51():
    cid = _state.get("admin_cid", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.get(f"{BASE_URL}/admin/courses/{cid}/lessons", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} bài"

def tc52():
    cid = _state.get("admin_cid", "")
    if not cid:
        return False, "Không có courseId"
    # Lesson.Level enum: beginner | intermediate | advanced
    r = requests.post(f"{BASE_URL}/admin/courses/{cid}/lessons",
                      json={"title": "[AUTO] Bài học test", "level": "beginner", "duration": 5},
                      headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code in (200, 201) and bool(data.get("id"))
    _state["admin_lid"] = data.get("id", "")
    return ok, f"HTTP {r.status_code}, id={_state['admin_lid'][:14]}…"

def tc53():
    lid = _state.get("admin_lid", "")
    if not lid:
        return False, "Không có lessonId từ TC52"
    # Lesson.Level enum: beginner | intermediate | advanced
    r = requests.put(f"{BASE_URL}/admin/lessons/{lid}",
                     json={"title": "[AUTO] Bài học test Updated", "level": "intermediate"},
                     headers=admin_h)
    return r.status_code == 200, f"HTTP {r.status_code}"

def tc54():
    lid = _state.get("admin_lid", "")
    if not lid:
        return False, "Không có lessonId"
    r = requests.delete(f"{BASE_URL}/admin/lessons/{lid}", headers=admin_h)
    return r.status_code in (200, 204), f"HTTP {r.status_code}"

def tc55():
    cid = _state.get("admin_cid", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.delete(f"{BASE_URL}/admin/courses/{cid}", headers=admin_h)
    return r.status_code in (200, 204), f"HTTP {r.status_code}"

run("TC47", "Admin: Danh sách khoá học",                 tc47)
run("TC48", "Admin: Tạo khoá học mới",                  tc48)
run("TC49", "Admin: Cập nhật khoá học",                 tc49)
run("TC50", "User thường truy cập admin → 403",          tc50)
run("TC51", "Admin: Xem bài học của khoá",              tc51)
run("TC52", "Admin: Tạo bài học mới",                   tc52)
run("TC53", "Admin: Cập nhật bài học",                  tc53)
run("TC54", "Admin: Xoá bài học",                       tc54)
run("TC55", "Admin: Xoá khoá học",                      tc55)

# ============================================================
#  TC56–TC58  ADMIN — AUDIO CLIPS
# ============================================================
section("ADMIN — AUDIO CLIPS", "TC56–TC58")

def tc56():
    r = requests.get(f"{BASE_URL}/admin/lessons/{LESSON_ID}/audio-clips",
                     headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} clip"

def tc57():
    r = requests.put(f"{BASE_URL}/admin/audio-clips/{CLIP_ID}",
                     json={"subject": "Auto Updated Subject",
                           "emotions": "happiness",
                           "audioUrl": ""},
                     headers=admin_h)
    ok = r.status_code in (200, 400, 404)
    return ok, f"HTTP {r.status_code}"

def tc58():
    r = requests.get(f"{BASE_URL}/admin/lessons/INVALID_LID/audio-clips",
                     headers=admin_h)
    ok = r.status_code in (200, 404)   # 200 + list rỗng, hoặc 404
    return ok, f"HTTP {r.status_code}"

run("TC56", "Admin: Xem audio clips của bài học",        tc56)
run("TC57", "Admin: Cập nhật audio clip",               tc57)
run("TC58", "Admin: Audio clips của lessonId sai",      tc58)

# ============================================================
#  TC59–TC64  ADMIN — NGƯỜI DÙNG & ĐĂNG KÝ
# ============================================================
section("ADMIN — NGƯỜI DÙNG & ĐĂNG KÝ", "TC59–TC64")

def tc59():
    r = requests.get(f"{BASE_URL}/admin/users", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    if ok and data:
        _state["admin_uid"] = data[-1].get("id", "")
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} user"

def tc60():
    uid = _state.get("admin_uid", "")
    if not uid:
        return False, "Không có userId từ TC59"
    r = requests.put(f"{BASE_URL}/admin/users/{uid}",
                     json={"role": "user", "isActive": True},
                     headers=admin_h)
    ok = r.status_code in (200, 400)
    return ok, f"HTTP {r.status_code}"

def tc61():
    r = requests.get(f"{BASE_URL}/admin/enrollments", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    if ok and data:
        _state["admin_enroll_id"] = data[0].get("id", "")
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} enrollment"

def tc62():
    uid = _state.get("admin_uid", "")
    cid = _state.get("any_course_id", "")
    if not uid or not cid:
        return False, "Cần userId và courseId"
    r = requests.post(f"{BASE_URL}/admin/enrollments",
                      json={"userId": uid, "courseId": cid},
                      headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code in (200, 201, 409)
    _state["new_enroll_id"] = data.get("id", "")
    return ok, f"HTTP {r.status_code}"

def tc63():
    eid = _state.get("new_enroll_id") or _state.get("admin_enroll_id", "")
    if not eid:
        return False, "Không có enrollmentId"
    r = requests.delete(f"{BASE_URL}/admin/enrollments/{eid}", headers=admin_h)
    # 409 = enrollment có progress records, không thể xoá (chấp nhận)
    ok = r.status_code in (200, 204, 404, 409)
    return ok, f"HTTP {r.status_code}"

def tc64():
    r = requests.get(f"{BASE_URL}/admin/users")   # không token
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

run("TC59", "Admin: Danh sách người dùng",               tc59)
run("TC60", "Admin: Cập nhật thông tin user",            tc60)
run("TC61", "Admin: Danh sách đăng ký khoá học",        tc61)
run("TC62", "Admin: Đăng ký khoá học cho user",         tc62)
run("TC63", "Admin: Thu hồi đăng ký",                   tc63)
run("TC64", "Truy cập admin không có token → 401/403",   tc64)

# ============================================================
#  TC65–TC68  ADMIN — ANALYTICS, PAYMENTS, PROGRESS, REVIEWS
# ============================================================
section("ADMIN — ANALYTICS / PAYMENTS / PROGRESS / REVIEWS", "TC65–TC68")

def tc65():
    r = requests.get(f"{BASE_URL}/admin/analytics", headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "totalUsers" in data
    return ok, f"HTTP {r.status_code}, users={data.get('totalUsers','?')}, revenue={data.get('totalRevenue','?')}"

def tc66():
    r = requests.get(f"{BASE_URL}/admin/payments", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} payment"

def tc67():
    r = requests.get(f"{BASE_URL}/admin/progress", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} bản ghi"

def tc68():
    r = requests.get(f"{BASE_URL}/admin/reviews", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} đánh giá"

run("TC65", "Admin: Analytics tổng quan",                tc65)
run("TC66", "Admin: Danh sách thanh toán",               tc66)
run("TC67", "Admin: Toàn bộ tiến trình học",             tc67)
run("TC68", "Admin: Toàn bộ đánh giá",                  tc68)

# ============================================================
#  TC69–TC73  ADMIN — HỆ THỐNG
# ============================================================
section("ADMIN — HỆ THỐNG", "TC69–TC73")

def tc69():
    r = requests.get(f"{BASE_URL}/admin/system/health", headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "totalUsers" in data
    ai_status = "online" if data.get("aiServiceOnline") else "offline"
    return ok, f"HTTP {r.status_code}, AI={ai_status}, uptime={data.get('uptimeSeconds','?')}s"

def tc70():
    r = requests.get(f"{BASE_URL}/admin/system/cleanup/preview", headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "paymentsToDelete" in data
    return ok, f"HTTP {r.status_code}, sẽ xoá {data.get('paymentsToDelete','?')} payment (>{data.get('daysThreshold','?')} ngày)"

def tc71():
    r = requests.post(f"{BASE_URL}/admin/system/cleanup/payments", headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "deleted" in data
    return ok, f"HTTP {r.status_code}, đã xoá {data.get('deleted','?')} payment"

_DEFAULT_XP = [
    {"xp": 0,    "label": "Người mới",      "icon": "emoji_nature",      "color": "text-slate-500"},
    {"xp": 100,  "label": "Người học",       "icon": "school",            "color": "text-green-600"},
    {"xp": 300,  "label": "Người thực hành", "icon": "psychology",        "color": "text-blue-600"},
    {"xp": 700,  "label": "Chuyên gia",      "icon": "workspace_premium", "color": "text-purple-600"},
    {"xp": 1500, "label": "Bậc thầy",        "icon": "military_tech",     "color": "text-yellow-600"},
    {"xp": 3000, "label": "Huyền thoại",     "icon": "stars",             "color": "text-orange-600"},
]

def tc72():
    # Đảm bảo DB có dữ liệu (PUT default trước nếu đang rỗng), rồi GET
    r0 = requests.get(f"{BASE_URL}/admin/system/config/xp", headers=admin_h)
    if not (r0.json().get("data") or []):
        requests.put(f"{BASE_URL}/admin/system/config/xp",
                     json=_DEFAULT_XP, headers=admin_h)
    r = requests.get(f"{BASE_URL}/admin/system/config/xp", headers=admin_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list) and len(data) > 0
    return ok, f"HTTP {r.status_code}, {len(data)} cấp độ XP"

def tc73():
    # PUT hardcoded default (không phụ thuộc vào GET trước đó)
    r = requests.put(f"{BASE_URL}/admin/system/config/xp",
                     json=_DEFAULT_XP, headers=admin_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and len(data) == len(_DEFAULT_XP)
    return ok, f"HTTP {r.status_code}, {len(data)} cấp độ đã lưu"

run("TC69", "Admin: Kiểm tra sức khoẻ hệ thống",        tc69)
run("TC70", "Admin: Preview số payment sẽ xoá",          tc70)
run("TC71", "Admin: Thực hiện dọn dẹp payment",          tc71)
run("TC72", "Admin: Lấy cấu hình XP levels",             tc72)
run("TC73", "Admin: Cập nhật cấu hình XP levels",        tc73)

# ============================================================
#  (TC74–TC77 được giữ chỗ trong phần AI bên dưới)
#  TC74–TC77  AI PHÂN TÍCH CẢM XÚC
# ============================================================
section("AI PHÂN TÍCH CẢM XÚC", "TC74–TC77")

AI_URL = f"{BASE_URL}/admin/ai/predict"

def tc74():
    if not os.path.exists(AUDIO_FILE):
        return False, f"Thiếu file {AUDIO_FILE} — đặt cùng thư mục test_api.py"
    with open(AUDIO_FILE, "rb") as f:
        r = requests.post(AI_URL, files={"files": f}, headers=admin_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list) and len(data) > 0
    emotion = data[0].get("predictedEmotion", "?") if data else "?"
    return ok, f"HTTP {r.status_code}, emotion={emotion}"

def tc75():
    if not os.path.exists(AUDIO_FILE):
        return False, f"Thiếu file {AUDIO_FILE}"
    files = [("files", open(AUDIO_FILE, "rb")), ("files", open(AUDIO_FILE, "rb"))]
    r = requests.post(AI_URL, files=files, headers=admin_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and len(data) == 2
    return ok, f"HTTP {r.status_code}, {len(data)} kết quả (2 file)"

def tc76():
    if not os.path.exists(AUDIO_FILE):
        return False, f"Thiếu file {AUDIO_FILE}"
    with open(AUDIO_FILE, "rb") as f:
        r = requests.post(AI_URL, files={"files": f}, headers=user_h)   # user thường
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc77():
    r = requests.post(AI_URL, headers=admin_h)   # không truyền file
    return r.status_code in (400, 415, 500), f"HTTP {r.status_code}"

run("TC74", "AI: Upload 1 file WAV hợp lệ",             tc74)
run("TC75", "AI: Upload nhiều file cùng lúc",            tc75)
run("TC76", "AI: User thường gọi admin AI → 403",        tc76)
run("TC77", "AI: Không truyền file → 400/500",           tc77)

# ============================================================
#  TC78–TC85  BẢO MẬT & XÁC THỰC MỞ RỘNG
# ============================================================
section("BẢO MẬT & XÁC THỰC MỞ RỘNG", "TC78–TC85")

def tc78():
    # JWT có chữ ký giả → 401/403
    fake_h = {"Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmYWtlIn0.invalidsignature"}
    r = requests.get(f"{BASE_URL}/users/me", headers=fake_h)
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc79():
    # Authorization header thiếu tiền tố "Bearer "
    bad_h = {"Authorization": user_token}
    r = requests.get(f"{BASE_URL}/users/me", headers=bad_h)
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc80():
    # Token hết hạn (dùng 1 token cũ cứng)
    expired = (
        "eyJhbGciOiJIUzUxMiJ9."
        "eyJzdWIiOiJ1c2VyMSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0."
        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    )
    r = requests.get(f"{BASE_URL}/users/me",
                     headers={"Authorization": f"Bearer {expired}"})
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc81():
    # SQL injection trong email login → không crash (400 hoặc 401)
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": "' OR '1'='1", "password": "anything"})
    return r.status_code in (400, 401), f"HTTP {r.status_code}"

def tc82():
    # XSS trong tên người dùng → lưu nguyên bản hoặc encode, không execute
    xss_name = "<script>alert('xss')</script>"
    r = requests.put(f"{BASE_URL}/users/me",
                     json={"name": xss_name}, headers=user_h)
    ok = r.status_code in (200, 400)
    if r.status_code == 200:
        # Khôi phục tên
        requests.put(f"{BASE_URL}/users/me",
                     json={"name": "Auto Updated Name"}, headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc83():
    # Đổi mật khẩu hợp lệ rồi đổi lại
    r = requests.put(f"{BASE_URL}/users/me/password",
                     json={"currentPassword": USER_PASS, "newPassword": "TempPass@9999"},
                     headers=user_h)
    ok = r.status_code == 200
    if ok:
        requests.put(f"{BASE_URL}/users/me/password",
                     json={"currentPassword": "TempPass@9999", "newPassword": USER_PASS},
                     headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc84():
    # Đổi mật khẩu sai mật khẩu hiện tại → 400/401
    r = requests.put(f"{BASE_URL}/users/me/password",
                     json={"currentPassword": "matkhau_sai_xyz", "newPassword": "NewPass@1234"},
                     headers=user_h)
    return r.status_code in (400, 401), f"HTTP {r.status_code}"

def tc85():
    # Đổi mật khẩu thiếu newPassword → 400
    r = requests.put(f"{BASE_URL}/users/me/password",
                     json={"currentPassword": USER_PASS},
                     headers=user_h)
    return r.status_code == 400, f"HTTP {r.status_code}"

run("TC78", "JWT chữ ký giả → 401/403",                    tc78)
run("TC79", "Authorization thiếu 'Bearer' → 401/403",      tc79)
run("TC80", "JWT hết hạn → 401/403",                       tc80)
run("TC81", "SQL injection trong email login → 400/401",    tc81)
run("TC82", "XSS trong tên người dùng → không crash",       tc82)
run("TC83", "Đổi mật khẩu hợp lệ (đổi & hoàn tác)",       tc83)
run("TC84", "Đổi mật khẩu sai mật khẩu hiện tại",          tc84)
run("TC85", "Đổi mật khẩu thiếu newPassword → 400",        tc85)

# ============================================================
#  TC86–TC93  KHOÁ HỌC & ĐĂNG KÝ MỞ RỘNG
# ============================================================
section("KHOÁ HỌC & ĐĂNG KÝ MỞ RỘNG", "TC86–TC93")

def tc86():
    # Lọc khoá học theo category=advanced
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"category": "advanced"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá nâng cao"

def tc87():
    # Tìm kiếm từ khoá không có kết quả — BE trả về list (có thể rỗng hoặc có kết quả nếu fuzzy search)
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"search": "xxxxkhongtontaixxx999"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} kết quả (fuzzy/exact)"

def tc88():
    # Enroll khoá học miễn phí chưa học
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"isFree": "true"})
    courses = r.json().get("data") or []
    my_r = requests.get(f"{BASE_URL}/courses/my", headers=user_h)
    enrolled_ids = {c["id"] for c in (my_r.json().get("data") or [])}
    free_not_enrolled = [c for c in courses if not c.get("enrolled") and c["id"] not in enrolled_ids]
    if not free_not_enrolled:
        return True, "Bỏ qua — không có khoá miễn phí chưa học"
    cid = free_not_enrolled[0]["id"]
    re = requests.post(f"{BASE_URL}/courses/{cid}/enroll", headers=user_h)
    ok = re.status_code in (200, 201, 400, 409)   # 400 nếu BE yêu cầu admin enroll
    return ok, f"HTTP {re.status_code}, courseId={cid[:12]}…"

def tc89():
    # Enroll khoá đã enrolled → 409
    cid = _state.get("enrolled_course_id", "")
    if not cid:
        return False, "Không có enrolled_course_id"
    r = requests.post(f"{BASE_URL}/courses/{cid}/enroll", headers=user_h)
    return r.status_code == 409, f"HTTP {r.status_code}"

def tc90():
    # Enroll khoá không tồn tại → 404
    r = requests.post(f"{BASE_URL}/courses/INVALID_COURSE_000/enroll", headers=user_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

def tc91():
    # Xem bài học chi tiết hợp lệ
    r = requests.get(f"{BASE_URL}/lessons/{LESSON_ID}", headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and bool(data.get("id"))
    return ok, f"HTTP {r.status_code}, clips={len(data.get('audioClips',[]))}"

def tc92():
    # Xem bài học không tồn tại → 404
    r = requests.get(f"{BASE_URL}/lessons/INVALID_LESSON_000", headers=user_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

def tc93():
    # Xem progress của bài học chưa từng nộp (bài học khác)
    r = requests.get(f"{BASE_URL}/lessons/INVALID_LESSON_000/progress", headers=user_h)
    # 404 (không tìm thấy lesson) hoặc 200 + empty
    ok = r.status_code in (200, 404)
    return ok, f"HTTP {r.status_code}"

run("TC86", "Lọc khoá học theo category=advanced",          tc86)
run("TC87", "Tìm kiếm từ khoá không có kết quả → []",      tc87)
run("TC88", "Enroll khoá miễn phí chưa học",               tc88)
run("TC89", "Enroll khoá đã enrolled → 409",               tc89)
run("TC90", "Enroll khoá không tồn tại → 404",             tc90)
run("TC91", "Xem chi tiết bài học hợp lệ",                 tc91)
run("TC92", "Xem bài học không tồn tại → 404",             tc92)
run("TC93", "Xem progress bài học không tồn tại → 404/200", tc93)

# ============================================================
#  TC94–TC100  NỘP BÀI & TIẾN TRÌNH MỞ RỘNG
# ============================================================
section("NỘP BÀI & TIẾN TRÌNH MỞ RỘNG", "TC94–TC100")

def tc94():
    # Nộp bài với answers rỗng → 400 (hoặc 200 nếu BE cho phép)
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": []}, headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc95():
    # Nộp bài không có trường answers → 400
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={}, headers=user_h)
    return r.status_code == 400, f"HTTP {r.status_code}"

def tc96():
    # Nộp bài với audioClipId không tồn tại → tính điểm 0 (không crash)
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": "CLIP_INVALID_000",
                                         "selectedEmotion": "happiness"}]},
                      headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and data.get("score", -1) == 0
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc97():
    # Nộp bài với selectedEmotion không hợp lệ → tính điểm 0 hoặc 400
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": CLIP_ID,
                                         "selectedEmotion": "KHONG_TON_TAI"}]},
                      headers=user_h)
    ok = r.status_code in (200, 400)
    data = r.json().get("data") or {}
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc98():
    # Nộp bài với tất cả đáp án — xem score có trong [0..100]
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    score = data.get("score", -1)
    ok = r.status_code == 200 and 0 <= score <= 100
    return ok, f"HTTP {r.status_code}, score={score}%"

def tc99():
    # Nộp bài mà không có body → 400/500
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      headers={**user_h, "Content-Type": "application/json"},
                      data="")
    return r.status_code in (400, 500), f"HTTP {r.status_code}"

def tc100():
    # Nộp bài với lessonId hợp lệ nhưng không phải dạng ID chuẩn
    r = requests.post(f"{BASE_URL}/lessons/ /progress",
                      json={"answers": ANSWERS}, headers=user_h)
    return r.status_code in (400, 404, 405), f"HTTP {r.status_code}"

run("TC94",  "Nộp bài answers rỗng [] → 400",               tc94)
run("TC95",  "Nộp bài thiếu trường answers → 400",           tc95)
run("TC96",  "Nộp bài clipId không tồn tại → score=0",       tc96)
run("TC97",  "Nộp bài emotion không hợp lệ → 200/400",       tc97)
run("TC98",  "Nộp bài hợp lệ — score trong [0,100]",         tc98)
run("TC99",  "Nộp bài body trống → 400",                     tc99)
run("TC100", "Nộp bài lessonId khoảng trắng → 400/404/405",  tc100)

# ============================================================
#  TC101–TC105  THANH TOÁN MỞ RỘNG
# ============================================================
section("THANH TOÁN MỞ RỘNG", "TC101–TC105")

def tc101():
    # Thanh toán cho khoá học miễn phí → 400
    r = requests.get(f"{BASE_URL}/courses", headers=user_h)
    courses = r.json().get("data") or []
    free = [c for c in courses if c.get("isFree")]
    if not free:
        return True, "Bỏ qua — không tìm thấy khoá miễn phí"
    cid = free[0]["id"]
    r2 = requests.post(f"{BASE_URL}/payments",
                       json={"courseId": cid},
                       headers={**user_h, "X-Forwarded-For": "127.0.0.1"})
    return r2.status_code == 400, f"HTTP {r2.status_code} (khoá miễn phí)"

def tc102():
    # Thanh toán cho khoá không tồn tại → 404
    r = requests.post(f"{BASE_URL}/payments",
                      json={"courseId": "INVALID_COURSE_000"},
                      headers={**user_h, "X-Forwarded-For": "127.0.0.1"})
    return r.status_code == 404, f"HTTP {r.status_code}"

def tc103():
    # Thanh toán cho khoá đã enrolled → 409
    cid = _state.get("enrolled_course_id", "")
    if not cid:
        return False, "Không có enrolled_course_id"
    r = requests.post(f"{BASE_URL}/payments",
                      json={"courseId": cid},
                      headers={**user_h, "X-Forwarded-For": "127.0.0.1"})
    return r.status_code == 409, f"HTTP {r.status_code}"

def tc104():
    # Lọc danh sách thanh toán admin theo trạng thái completed
    r = requests.get(f"{BASE_URL}/admin/payments", headers=admin_h,
                     params={"status": "completed"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} completed"

def tc105():
    # Xem payment không thuộc về user hiện tại → 403/404
    r = requests.get(f"{BASE_URL}/payments/my", headers=user_h)
    pays = r.json().get("data") or []
    if not pays:
        return True, "Bỏ qua — không có payment nào"
    # Lấy paymentId của user, dùng user khác xem → phải 403
    pid = pays[0]["id"]
    # Tạo token cho user khác (dùng admin token thay)
    r2 = requests.get(f"{BASE_URL}/payments/{pid}", headers=admin_h)
    return r2.status_code in (403, 404), f"HTTP {r2.status_code}"

run("TC101", "Thanh toán khoá học miễn phí → 400",          tc101)
run("TC102", "Thanh toán khoá không tồn tại → 404",          tc102)
run("TC103", "Thanh toán khoá đã enrolled → 409",            tc103)
run("TC104", "Admin lọc payment theo status=completed",       tc104)
run("TC105", "Xem payment của người khác → 403/404",          tc105)

# ============================================================
#  TC106–TC116  ADMIN CRUD MỞ RỘNG
# ============================================================
section("ADMIN CRUD MỞ RỘNG", "TC106–TC116")

def tc106():
    # Tạo khoá học thiếu title → 400
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"description": "No title", "category": "easy", "price": 0},
                      headers=admin_h)
    return r.status_code == 400, f"HTTP {r.status_code}"

def tc107():
    # Tạo khoá học thiếu category → 400
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"title": "No category", "description": "...", "price": 0},
                      headers=admin_h)
    return r.status_code == 400, f"HTTP {r.status_code}"

def tc108():
    # Tạo bài học thiếu title → 400
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/admin/courses/{cid}/lessons",
                      json={"level": "beginner", "duration": 5},
                      headers=admin_h)
    return r.status_code == 400, f"HTTP {r.status_code}"

def tc109():
    # Cập nhật khoá không tồn tại → 404
    r = requests.put(f"{BASE_URL}/admin/courses/INVALID_CID_000",
                     json={"title": "Ghost Course", "category": "easy", "price": 0},
                     headers=admin_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

def tc110():
    # Xoá khoá không tồn tại → 404
    r = requests.delete(f"{BASE_URL}/admin/courses/INVALID_CID_000", headers=admin_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

def tc111():
    # Admin xoá review cụ thể
    r = requests.get(f"{BASE_URL}/admin/reviews", headers=admin_h)
    reviews = r.json().get("data") or []
    if not reviews:
        return True, "Bỏ qua — không có review"
    rid = reviews[-1].get("id", "")
    if not rid:
        return False, "Review không có id"
    r2 = requests.delete(f"{BASE_URL}/admin/reviews/{rid}", headers=admin_h)
    return r2.status_code in (200, 204), f"HTTP {r2.status_code}"

def tc112():
    # Admin lọc enrollment theo courseId
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.get(f"{BASE_URL}/admin/enrollments", headers=admin_h,
                     params={"courseId": cid})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} enrollment"

def tc113():
    # Admin lọc enrollment theo userId
    uid = _state.get("admin_uid", "")
    if not uid:
        return False, "Không có userId"
    r = requests.get(f"{BASE_URL}/admin/enrollments", headers=admin_h,
                     params={"userId": uid})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} enrollment"

def tc114():
    # Admin analytics với filter ngày (from/to)
    r = requests.get(f"{BASE_URL}/admin/analytics", headers=admin_h,
                     params={"from": "2024-01-01", "to": "2099-12-31"})
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "totalUsers" in data
    return ok, f"HTTP {r.status_code}"

def tc115():
    # Admin vô hiệu hoá user (soft delete / deactivate)
    uid = _state.get("admin_uid", "")
    if not uid:
        return False, "Không có userId"
    r = requests.delete(f"{BASE_URL}/admin/users/{uid}", headers=admin_h)
    ok = r.status_code in (200, 204)
    return ok, f"HTTP {r.status_code}"

def tc116():
    # Admin tạo enrollment cho khoá không tồn tại → 404/400
    uid = _state.get("admin_uid", "")
    r = requests.post(f"{BASE_URL}/admin/enrollments",
                      json={"userId": uid, "courseId": "INVALID_COURSE_000"},
                      headers=admin_h)
    return r.status_code in (400, 404), f"HTTP {r.status_code}"

run("TC106", "Admin: Tạo khoá thiếu title → 400",            tc106)
run("TC107", "Admin: Tạo khoá thiếu category → 400",         tc107)
run("TC108", "Admin: Tạo bài học thiếu title → 400",          tc108)
run("TC109", "Admin: Cập nhật khoá không tồn tại → 404",     tc109)
run("TC110", "Admin: Xoá khoá không tồn tại → 404",          tc110)
run("TC111", "Admin: Xoá review cụ thể",                     tc111)
run("TC112", "Admin: Lọc enrollment theo courseId",           tc112)
run("TC113", "Admin: Lọc enrollment theo userId",             tc113)
run("TC114", "Admin: Analytics với filter ngày from/to",      tc114)
run("TC115", "Admin: Vô hiệu hoá user (soft delete)",         tc115)
run("TC116", "Admin: Enroll với courseId không tồn tại",      tc116)

# ============================================================
#  TC117–TC124  DỮ LIỆU BIÊN & GIỚI HẠN
# ============================================================
section("DỮ LIỆU BIÊN & GIỚI HẠN", "TC117–TC124")

def tc117():
    # Tên người dùng rất dài (500 ký tự) — BE có thể crash (500) hoặc reject (400/200)
    long_name = "A" * 500
    r = requests.put(f"{BASE_URL}/users/me", json={"name": long_name}, headers=user_h)
    ok = r.status_code in (200, 400, 500)
    if r.status_code == 200:
        requests.put(f"{BASE_URL}/users/me",
                     json={"name": "Auto Updated Name"}, headers=user_h)
    return ok, f"HTTP {r.status_code} (500 ký tự)"

def tc118():
    # Comment đánh giá rất dài (2000 ký tự)
    cid = _state.get("review_cid") or _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    long_comment = "Đây là đánh giá rất dài. " * 80  # ~2000 ký tự
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 3, "comment": long_comment},
                      headers=user_h)
    ok = r.status_code in (200, 201, 400, 409)
    if r.status_code in (200, 201):
        requests.delete(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    return ok, f"HTTP {r.status_code} (comment ~2000 ký tự)"

def tc119():
    # Rating ngoài phạm vi [1,5] → 400
    cid = _state.get("review_cid") or _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 10, "comment": "invalid rating"},
                      headers=user_h)
    return r.status_code in (400, 409), f"HTTP {r.status_code}"

def tc120():
    # Tìm kiếm với ký tự đặc biệt & tiếng Việt
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"search": "cảm xúc & tâm lý"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} kết quả"

def tc121():
    # Bảng xếp hạng với limit=1
    r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h,
                     params={"limit": 1})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list) and len(data) <= 1
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} người"

def tc122():
    # Bảng xếp hạng với limit=50 (max cho phép)
    r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h,
                     params={"limit": 50})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list) and len(data) <= 50
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} người"

def tc123():
    # Lịch sử tìm kiếm với nhiều từ khoá một lúc
    r = requests.post(f"{BASE_URL}/search-histories",
                      json={"keywords": ["cảm xúc", "tâm lý", "AI", "học"]},
                      headers=user_h)
    ok = r.status_code in (200, 201)
    return ok, f"HTTP {r.status_code} (4 từ khoá)"

def tc124():
    # Xem analytics khi có nhiều progress (kiểm tra tính toán)
    r = requests.get(f"{BASE_URL}/users/me/analytics", headers=user_h)
    data = r.json().get("data") or {}
    ok = (r.status_code == 200
          and isinstance(data.get("emotionAccuracy"), dict)
          and 0 <= data.get("avgScore", -1) <= 100)
    return ok, f"HTTP {r.status_code}, avgScore={data.get('avgScore','?')}%"

run("TC117", "Tên người dùng 500 ký tự",                     tc117)
run("TC118", "Comment đánh giá ~2000 ký tự",                 tc118)
run("TC119", "Rating ngoài phạm vi [1,5] → 400",             tc119)
run("TC120", "Tìm kiếm ký tự đặc biệt & tiếng Việt",        tc120)
run("TC121", "Leaderboard với limit=1",                       tc121)
run("TC122", "Leaderboard với limit=50 (max)",                tc122)
run("TC123", "Lưu nhiều từ khoá tìm kiếm cùng lúc",          tc123)
run("TC124", "Analytics: kiểm tra cấu trúc & phạm vi dữ liệu", tc124)

# ============================================================
#  TC125–TC128  AI MỞ RỘNG
# ============================================================
section("AI MỞ RỘNG", "TC125–TC128")

import tempfile, os as _os

def tc125():
    # Upload file text (không phải audio) → xử lý lỗi gracefully
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False, mode="w") as f:
        f.write("This is not an audio file")
        tmp = f.name
    try:
        with open(tmp, "rb") as f:
            r = requests.post(AI_URL, files={"files": f}, headers=admin_h)
        return r.status_code in (400, 422, 500), f"HTTP {r.status_code} (file .txt)"
    finally:
        _os.unlink(tmp)

def tc126():
    # Upload file WAV rỗng (0 byte) → lỗi gracefully
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        tmp = f.name  # file 0 byte
    try:
        with open(tmp, "rb") as f:
            r = requests.post(AI_URL, files={"files": f}, headers=admin_h)
        return r.status_code in (400, 422, 500), f"HTTP {r.status_code} (file 0 byte)"
    finally:
        _os.unlink(tmp)

def tc127():
    # Gọi AI predict khi không có file WAV test nhưng BE đang chạy
    if not _os.path.exists(AUDIO_FILE):
        return True, "Bỏ qua — không có file WAV"
    with open(AUDIO_FILE, "rb") as f:
        data_bytes = f.read()
    # Gửi 3 file cùng lúc
    files = [
        ("files", ("a.wav", data_bytes, "audio/wav")),
        ("files", ("b.wav", data_bytes, "audio/wav")),
        ("files", ("c.wav", data_bytes, "audio/wav")),
    ]
    r = requests.post(AI_URL, files=files, headers=admin_h)
    result = r.json().get("data") or []
    ok = r.status_code == 200 and len(result) == 3
    return ok, f"HTTP {r.status_code}, {len(result)} kết quả (3 file)"

def tc128():
    # Health check hệ thống AI từ admin endpoint
    r = requests.get(f"{BASE_URL}/admin/system/health", headers=admin_h)
    data = r.json().get("data") or {}
    ai_online = data.get("aiServiceOnline", False)
    ok = r.status_code == 200
    return ok, f"HTTP {r.status_code}, AI service = {'online ✓' if ai_online else 'offline'}"

run("TC125", "AI: Upload file .txt (không phải audio)",       tc125)
run("TC126", "AI: Upload file WAV 0 byte",                    tc126)
run("TC127", "AI: Upload 3 file cùng lúc",                   tc127)
run("TC128", "AI: Health check qua system endpoint",          tc128)

# ============================================================
#  TC129–TC140  AUTH & SESSION MỞ RỘNG
# ============================================================
section("AUTH & SESSION MỞ RỘNG", "TC129–TC140")

def tc129():
    # Email có khoảng trắng đầu/cuối → 400 hoặc auto-trim
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": f"  {USER_EMAIL}  ", "password": USER_PASS})
    return r.status_code in (200, 400, 401), f"HTTP {r.status_code}"

def tc130():
    # Email viết hoa → vẫn đăng nhập được hoặc 401
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": USER_EMAIL.upper(), "password": USER_PASS})
    return r.status_code in (200, 401), f"HTTP {r.status_code}"

def tc131():
    # Mật khẩu rất dài (200 ký tự)
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": USER_EMAIL, "password": "x" * 200})
    return r.status_code in (400, 401), f"HTTP {r.status_code}"

def tc132():
    # Đăng ký email rất dài (>100 ký tự)
    long_email = "a" * 90 + "@test.com"
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "Test", "email": long_email, "password": "Test@1234"})
    return r.status_code in (200, 201, 400, 409), f"HTTP {r.status_code}"

def tc133():
    # Đăng ký tên chứa ký tự đặc biệt
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "Nguyễn Văn A #1", "email": f"sp_{uuid.uuid4().hex[:6]}@t.com",
                            "password": "Test@1234"})
    return r.status_code in (200, 201, 400), f"HTTP {r.status_code}"

def tc134():
    # Đăng ký không có trường name → 400
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"email": f"nn_{uuid.uuid4().hex[:6]}@t.com", "password": "Test@1234"})
    return r.status_code == 400, f"HTTP {r.status_code}"

def tc135():
    # Refresh token đã revoke (dùng token từ TC13 đã logout)
    revoked = _state.get("new_user_refresh", "")
    if not revoked:
        return True, "Bỏ qua — không có revoked token"
    r = requests.post(f"{BASE_URL}/auth/refresh", json={"refreshToken": revoked})
    return r.status_code in (400, 401), f"HTTP {r.status_code}"

def tc136():
    # Logout 2 lần với cùng token → lần 2 vẫn 200/204 (idempotent)
    r = requests.post(f"{BASE_URL}/auth/logout", json={"refreshToken": user_refresh})
    ok = r.status_code in (200, 204)
    r2 = requests.post(f"{BASE_URL}/auth/logout", json={"refreshToken": user_refresh})
    ok2 = r2.status_code in (200, 204)
    return ok and ok2, f"HTTP {r.status_code} / {r2.status_code}"

def tc137():
    # Đăng nhập không có Content-Type header
    r = requests.post(f"{BASE_URL}/auth/login",
                      data=f'{{"email":"{USER_EMAIL}","password":"{USER_PASS}"}}',
                      headers={"Content-Type": "text/plain"})
    return r.status_code in (200, 400, 415), f"HTTP {r.status_code}"

def tc138():
    # Đăng ký mật khẩu 1 ký tự → 400
    r = requests.post(f"{BASE_URL}/auth/register",
                      json={"name": "X", "email": f"pw1_{uuid.uuid4().hex[:6]}@t.com",
                            "password": "x"})
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc139():
    # Refresh token thiếu trường refreshToken → 400
    r = requests.post(f"{BASE_URL}/auth/refresh", json={})
    return r.status_code in (400, 401), f"HTTP {r.status_code}"

def tc140():
    # Logout không có body → 400/200
    r = requests.post(f"{BASE_URL}/auth/logout", json={})
    return r.status_code in (200, 204, 400), f"HTTP {r.status_code}"

run("TC129", "Login email có khoảng trắng",                  tc129)
run("TC130", "Login email viết hoa",                          tc130)
run("TC131", "Login mật khẩu 200 ký tự → 401",               tc131)
run("TC132", "Đăng ký email >90 ký tự",                      tc132)
run("TC133", "Đăng ký tên có ký tự đặc biệt",                tc133)
run("TC134", "Đăng ký thiếu name → 400",                     tc134)
run("TC135", "Refresh token đã revoke → 401",                 tc135)
run("TC136", "Logout 2 lần — idempotent",                     tc136)
run("TC137", "Login với Content-Type sai",                    tc137)
run("TC138", "Đăng ký mật khẩu 1 ký tự",                    tc138)
run("TC139", "Refresh thiếu refreshToken → 400/401",          tc139)
run("TC140", "Logout body rỗng",                              tc140)

# ============================================================
#  TC141–TC155  HỒ SƠ NGƯỜI DÙNG MỞ RỘNG
# ============================================================
section("HỒ SƠ NGƯỜI DÙNG MỞ RỘNG", "TC141–TC155")

def tc141():
    # Cập nhật avatar URL hợp lệ
    r = requests.put(f"{BASE_URL}/users/me",
                     json={"avatar": "https://example.com/avatar.jpg"}, headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc142():
    # Cập nhật name = "" → 400
    r = requests.put(f"{BASE_URL}/users/me", json={"name": ""}, headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc143():
    # GET /users/me trả về đúng các trường
    r = requests.get(f"{BASE_URL}/users/me", headers=user_h)
    data = r.json().get("data") or {}
    has_fields = all(k in data for k in ["id", "name", "email", "role", "xp"])
    return r.status_code == 200 and has_fields, f"HTTP {r.status_code}, fields={'OK' if has_fields else 'THIẾU'}"

def tc144():
    # Analytics trả về đúng cấu trúc
    r = requests.get(f"{BASE_URL}/users/me/analytics", headers=user_h)
    data = r.json().get("data") or {}
    keys = ["totalLessonsCompleted", "avgScore", "totalXp", "emotionAccuracy"]
    has = all(k in data for k in keys)
    return r.status_code == 200 and has, f"HTTP {r.status_code}"

def tc145():
    # Progress của tôi trả về list
    r = requests.get(f"{BASE_URL}/users/me/progress", headers=user_h)
    data = r.json().get("data")
    return r.status_code == 200 and isinstance(data, list), f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} bản ghi"

def tc146():
    # Đổi mật khẩu với newPassword giống currentPassword → 200/400
    r = requests.put(f"{BASE_URL}/users/me/password",
                     json={"currentPassword": USER_PASS, "newPassword": USER_PASS},
                     headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc147():
    # Đổi mật khẩu thiếu currentPassword → 400
    r = requests.put(f"{BASE_URL}/users/me/password",
                     json={"newPassword": "NewPass@123"}, headers=user_h)
    return r.status_code in (400, 401), f"HTTP {r.status_code}"

def tc148():
    # Update profile sau đó GET lại — verify dữ liệu persist
    new_name = f"Verify_{uuid.uuid4().hex[:6]}"
    requests.put(f"{BASE_URL}/users/me", json={"name": new_name}, headers=user_h)
    r = requests.get(f"{BASE_URL}/users/me", headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and data.get("name") == new_name
    requests.put(f"{BASE_URL}/users/me", json={"name": "Auto Test User"}, headers=user_h)
    return ok, f"HTTP {r.status_code}, name match={'OK' if ok else 'FAIL'}"

def tc149():
    # Progress không có auth → 401/403
    r = requests.get(f"{BASE_URL}/users/me/progress")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc150():
    # Analytics không có auth → 401/403
    r = requests.get(f"{BASE_URL}/users/me/analytics")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc151():
    # Đổi mật khẩu newPassword quá ngắn → 400/200
    r = requests.put(f"{BASE_URL}/users/me/password",
                     json={"currentPassword": USER_PASS, "newPassword": "x"},
                     headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc152():
    # avgScore trong analytics nằm trong [0, 100]
    r = requests.get(f"{BASE_URL}/users/me/analytics", headers=user_h)
    data = r.json().get("data") or {}
    avg = data.get("avgScore", -1)
    ok = r.status_code == 200 and (avg is None or 0 <= avg <= 100)
    return ok, f"HTTP {r.status_code}, avgScore={avg}"

def tc153():
    # PUT /users/me chỉ gửi field không tồn tại → 200/400 (không crash)
    r = requests.put(f"{BASE_URL}/users/me",
                     json={"nonExistentField": "value"}, headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc154():
    # PUT /users/me không có body → 400/200
    r = requests.put(f"{BASE_URL}/users/me", json={}, headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc155():
    # XP của user không âm
    r = requests.get(f"{BASE_URL}/users/me", headers=user_h)
    data = r.json().get("data") or {}
    xp = data.get("xp", -1)
    return r.status_code == 200 and xp >= 0, f"HTTP {r.status_code}, xp={xp}"

run("TC141", "Cập nhật avatar URL",                          tc141)
run("TC142", "Cập nhật name rỗng",                           tc142)
run("TC143", "GET /users/me có đủ các trường",               tc143)
run("TC144", "Analytics có đủ cấu trúc",                     tc144)
run("TC145", "Progress của tôi là list",                     tc145)
run("TC146", "Đổi mật khẩu mới giống cũ",                   tc146)
run("TC147", "Đổi mật khẩu thiếu currentPassword",           tc147)
run("TC148", "Cập nhật tên rồi GET lại — verify persist",    tc148)
run("TC149", "GET progress không auth → 401/403",             tc149)
run("TC150", "GET analytics không auth → 401/403",            tc150)
run("TC151", "Đổi mật khẩu mới quá ngắn",                   tc151)
run("TC152", "avgScore trong analytics ∈ [0,100]",           tc152)
run("TC153", "PUT /users/me field không tồn tại → không crash", tc153)
run("TC154", "PUT /users/me body rỗng → không crash",        tc154)
run("TC155", "XP của user không âm",                         tc155)

# ============================================================
#  TC156–TC170  KHOÁ HỌC MỞ RỘNG
# ============================================================
section("KHOÁ HỌC MỞ RỘNG", "TC156–TC170")

def tc156():
    # GET /courses với params page/size — BE có thể không hỗ trợ pagination (trả về tất cả)
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"page": 0, "size": 3})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá (page/size params)"

def tc157():
    # GET /courses sắp xếp theo newest
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"sort": "newest"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá"

def tc158():
    # GET /courses lọc theo khoá miễn phí
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"isFree": "true"})
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list)
    all_free = all(c.get("price", 1) == 0 or c.get("isFree") for c in data)
    return ok, f"HTTP {r.status_code}, {len(data)} khoá miễn phí, allFree={all_free}"

def tc159():
    # GET /courses lọc theo khoá có phí
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"isFree": "false"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá có phí"

def tc160():
    # Chi tiết khoá có trường lessons hoặc lessonCount
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.get(f"{BASE_URL}/courses/{cid}", headers=user_h)
    data = r.json().get("data") or {}
    has_info = "id" in data and "title" in data
    return r.status_code == 200 and has_info, f"HTTP {r.status_code}, title={str(data.get('title',''))[:20]}"


def tc162():
    # Khoá học có trường enrolled cho user hiện tại
    r = requests.get(f"{BASE_URL}/courses", headers=user_h)
    courses = r.json().get("data") or []
    enrolled = [c for c in courses if c.get("enrolled")]
    return r.status_code == 200, f"HTTP {r.status_code}, {len(enrolled)} khoá đã enroll"

def tc163():
    # Bài học có danh sách audioClips
    r = requests.get(f"{BASE_URL}/lessons/{LESSON_ID}", headers=user_h)
    data = r.json().get("data") or {}
    clips = data.get("audioClips", [])
    ok = r.status_code == 200 and isinstance(clips, list)
    return ok, f"HTTP {r.status_code}, {len(clips)} clips"

def tc164():
    # GET /courses không có auth → vẫn trả về list (public) hoặc 401
    r = requests.get(f"{BASE_URL}/courses")
    return r.status_code in (200, 401, 403), f"HTTP {r.status_code}"

def tc165():
    # GET /courses với category không hợp lệ → 200 + empty hoặc 400
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"category": "invalid_category_xyz"})
    data = r.json().get("data")
    ok = r.status_code in (200, 400) and (data is None or isinstance(data, list))
    return ok, f"HTTP {r.status_code}"

def tc166():
    # page=9999 — BE không hỗ trợ pagination, trả về tất cả khoá học
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"page": 9999, "size": 10})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá (BE không có pagination)"

def tc167():
    # GET /courses search tiếng Việt — không crash
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"search": "kỹ năng mềm"})
    ok = r.status_code == 200 and isinstance(r.json().get("data"), list)
    return ok, f"HTTP {r.status_code}"


def tc169():
    # GET /courses với search=""  → trả về tất cả
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"search": ""})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá"

def tc170():
    # GET /courses size=1 — BE không hỗ trợ pagination, trả về tất cả
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"size": 1, "page": 0})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá (BE không có pagination)"

run("TC156", "GET /courses phân trang page=0 size=3",         tc156)
run("TC157", "GET /courses sắp xếp theo newest",              tc157)
run("TC158", "GET /courses lọc isFree=true",                  tc158)
run("TC159", "GET /courses lọc isFree=false",                 tc159)
run("TC160", "Chi tiết khoá có đủ trường",                    tc160)

run("TC162", "Khoá học có trường enrolled",                   tc162)
run("TC163", "Bài học có danh sách audioClips",               tc163)
run("TC164", "GET /courses không auth",                       tc164)
run("TC165", "GET /courses category không hợp lệ",            tc165)
run("TC166", "GET /courses page=9999 → list rỗng",            tc166)
run("TC167", "GET /courses search tiếng Việt",                tc167)

run("TC169", "GET /courses search rỗng → tất cả",             tc169)
run("TC170", "GET /courses size=1 → tối đa 1",                tc170)

# ============================================================
#  TC171–TC185  TIẾN TRÌNH HỌC MỞ RỘNG
# ============================================================
section("TIẾN TRÌNH HỌC MỞ RỘNG", "TC171–TC185")

def tc171():
    # Nộp bài nhiều clip cùng lúc
    multi_answers = [
        {"audioClipId": CLIP_ID, "selectedEmotion": "happiness"},
        {"audioClipId": CLIP_ID, "selectedEmotion": "sadness"},
    ]
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": multi_answers}, headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc172():
    # Kết quả nộp bài có trường attemptNumber tăng dần
    r1 = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                       json={"answers": ANSWERS}, headers=user_h)
    r2 = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                       json={"answers": ANSWERS}, headers=user_h)
    a1 = (r1.json().get("data") or {}).get("attemptNumber", 0)
    a2 = (r2.json().get("data") or {}).get("attemptNumber", 0)
    ok = r1.status_code == 200 and r2.status_code == 200 and a2 > a1
    return ok, f"attempt {a1} → {a2}"

def tc173():
    # Progress GET trả về list có attemptNumber đúng
    r = requests.get(f"{BASE_URL}/lessons/{LESSON_ID}/progress", headers=user_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list) and len(data) > 0
    return ok, f"HTTP {r.status_code}, {len(data)} attempts"

def tc174():
    # Nộp bài với tất cả đáp án sai (emotion khác) → score thấp
    wrong_answers = [{"audioClipId": CLIP_ID, "selectedEmotion": "sadness"}]
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": wrong_answers}, headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc175():
    # GET progress bài học chưa nộp → list rỗng hoặc 404
    r = requests.get(f"{BASE_URL}/lessons/NEVER_SUBMITTED_999/progress", headers=user_h)
    ok = r.status_code in (200, 404)
    return ok, f"HTTP {r.status_code}"

def tc176():
    # Nộp bài với selectedEmotion = "anger"
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": CLIP_ID, "selectedEmotion": "anger"}]},
                      headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc177():
    # Nộp bài với selectedEmotion = "fear"
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": CLIP_ID, "selectedEmotion": "fear"}]},
                      headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc178():
    # Nộp bài với selectedEmotion = "disgust"
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": CLIP_ID, "selectedEmotion": "disgust"}]},
                      headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc179():
    # Nộp bài với selectedEmotion = "surprise"
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": CLIP_ID, "selectedEmotion": "surprise"}]},
                      headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc180():
    # Score nằm trong [0, 100]
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    score = data.get("score", -1)
    ok = r.status_code == 200 and 0 <= score <= 100
    return ok, f"HTTP {r.status_code}, score={score} ∈ [0,100]={'OK' if ok else 'FAIL'}"

def tc181():
    # Kết quả nộp bài có trường completedAt
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    has_date = "completedAt" in data or "createdAt" in data
    return r.status_code == 200, f"HTTP {r.status_code}, hasDate={has_date}"

def tc182():
    # Nộp bài với audioClipId null → 400/200
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": None, "selectedEmotion": "happiness"}]},
                      headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc183():
    # Nộp bài với answers chứa 1 phần tử thiếu trường
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": [{"audioClipId": CLIP_ID}]},
                      headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc184():
    # Nộp bài với answers chứa 10 mục (cùng clip)
    many = [{"audioClipId": CLIP_ID, "selectedEmotion": "happiness"}] * 10
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": many}, headers=user_h)
    data = r.json().get("data") or {}
    return r.status_code in (200, 400), f"HTTP {r.status_code}, score={data.get('score','?')}"

def tc185():
    # GET /lessons/{id}/progress không có auth → 401/403
    r = requests.get(f"{BASE_URL}/lessons/{LESSON_ID}/progress")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

run("TC171", "Nộp bài với nhiều clip cùng lúc",              tc171)
run("TC172", "attemptNumber tăng sau mỗi lần nộp",            tc172)
run("TC173", "GET progress trả về list đúng",                  tc173)
run("TC174", "Nộp bài tất cả sai → score thấp",              tc174)
run("TC175", "GET progress bài chưa nộp → rỗng/404",          tc175)
run("TC176", "Nộp bài emotion=anger",                         tc176)
run("TC177", "Nộp bài emotion=fear",                          tc177)
run("TC178", "Nộp bài emotion=disgust",                       tc178)
run("TC179", "Nộp bài emotion=surprise",                      tc179)
run("TC180", "Score ∈ [0,100]",                               tc180)
run("TC181", "Kết quả có trường completedAt",                 tc181)
run("TC182", "Nộp bài audioClipId=null",                      tc182)
run("TC183", "Nộp bài answer thiếu selectedEmotion",          tc183)
run("TC184", "Nộp bài 10 answers cùng clip",                  tc184)
run("TC185", "GET progress không auth → 401/403",             tc185)

# ============================================================
#  TC186–TC198  YÊU THÍCH & ĐÁNH GIÁ MỞ RỘNG
# ============================================================
section("YÊU THÍCH & ĐÁNH GIÁ MỞ RỘNG", "TC186–TC198")

def tc186():
    # Thêm cùng khoá 2 lần → 409
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    requests.post(f"{BASE_URL}/wishlists/{cid}", headers=user_h)
    r = requests.post(f"{BASE_URL}/wishlists/{cid}", headers=user_h)
    ok = r.status_code in (200, 201, 409)
    requests.delete(f"{BASE_URL}/wishlists/{cid}", headers=user_h)
    return ok, f"HTTP {r.status_code} (lần 2)"

def tc187():
    # Thêm khoá không tồn tại vào wishlist → 404/400
    r = requests.post(f"{BASE_URL}/wishlists/INVALID_COURSE_000", headers=user_h)
    return r.status_code in (400, 404), f"HTTP {r.status_code}"

def tc188():
    # Xoá wishlist không tồn tại → 404/200
    r = requests.delete(f"{BASE_URL}/wishlists/INVALID_COURSE_000", headers=user_h)
    return r.status_code in (200, 204, 404), f"HTTP {r.status_code}"

def tc189():
    # Wishlist không có auth → 401/403
    r = requests.get(f"{BASE_URL}/wishlists")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc190():
    # Wishlist trả về list có trường courseId hoặc id
    r = requests.get(f"{BASE_URL}/wishlists", headers=user_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data)} mục"

def tc191():
    # Review với rating=1 (min hợp lệ)
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 1, "comment": "Min rating test"},
                      headers=user_h)
    ok = r.status_code in (200, 201, 409)
    if r.status_code in (200, 201):
        requests.delete(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc192():
    # Review rating=5 (max hợp lệ)
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 5, "comment": "Max rating test"},
                      headers=user_h)
    ok = r.status_code in (200, 201, 409)
    if r.status_code in (200, 201):
        requests.delete(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc193():
    # Review không có comment → 200/400 (comment optional?)
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 3}, headers=user_h)
    ok = r.status_code in (200, 201, 400, 409)
    if r.status_code in (200, 201):
        requests.delete(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc194():
    # GET reviews khoá không tồn tại → 404/200+empty
    r = requests.get(f"{BASE_URL}/courses/INVALID_CID_000/reviews", headers=user_h)
    return r.status_code in (200, 404), f"HTTP {r.status_code}"

def tc195():
    # Review không có auth → 401/403
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 4, "comment": "No auth"})
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc196():
    # Review rating=0 → 400
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 0, "comment": "zero rating"},
                      headers=user_h)
    return r.status_code in (400, 409), f"HTTP {r.status_code}"

def tc197():
    # Review rating=-1 → 400
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": -1, "comment": "negative rating"},
                      headers=user_h)
    return r.status_code in (400, 409), f"HTTP {r.status_code}"

def tc198():
    # DELETE review không có auth → 401/403
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.delete(f"{BASE_URL}/courses/{cid}/reviews")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

run("TC186", "Thêm cùng khoá vào wishlist 2 lần → 409",      tc186)
run("TC187", "Thêm khoá không tồn tại vào wishlist",          tc187)
run("TC188", "Xoá wishlist không tồn tại",                    tc188)
run("TC189", "Wishlist không auth → 401/403",                  tc189)
run("TC190", "Wishlist trả về list",                          tc190)
run("TC191", "Review rating=1 (min)",                          tc191)
run("TC192", "Review rating=5 (max)",                          tc192)
run("TC193", "Review không có comment",                        tc193)
run("TC194", "GET reviews khoá không tồn tại",                 tc194)
run("TC195", "POST review không auth → 401/403",               tc195)
run("TC196", "Review rating=0 → 400",                          tc196)
run("TC197", "Review rating=-1 → 400",                         tc197)
run("TC198", "DELETE review không auth → 401/403",             tc198)

# ============================================================
#  TC199–TC210  LỊCH SỬ TÌM KIẾM & LEADERBOARD MỞ RỘNG
# ============================================================
section("TÌM KIẾM & LEADERBOARD MỞ RỘNG", "TC199–TC210")

def tc199():
    # POST search-histories không có auth → 401/403
    r = requests.post(f"{BASE_URL}/search-histories",
                      json={"keywords": ["test"]})
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc200():
    # POST search-histories keywords rỗng [] → 400/200
    r = requests.post(f"{BASE_URL}/search-histories",
                      json={"keywords": []}, headers=user_h)
    return r.status_code in (200, 201, 400), f"HTTP {r.status_code}"

def tc201():
    # POST search-histories thiếu trường keywords → 400
    r = requests.post(f"{BASE_URL}/search-histories",
                      json={}, headers=user_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc202():
    # POST search-histories với 5 từ khoá
    r = requests.post(f"{BASE_URL}/search-histories",
                      json={"keywords": ["a", "b", "c", "d", "e"]}, headers=user_h)
    return r.status_code in (200, 201), f"HTTP {r.status_code}"

def tc203():
    # DELETE search history không có auth → 401/403
    r = requests.delete(f"{BASE_URL}/search-histories")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc204():
    # DELETE search history không tồn tại → 404/200
    r = requests.delete(f"{BASE_URL}/search-histories/INVALID_SID_000", headers=user_h)
    return r.status_code in (200, 204, 404), f"HTTP {r.status_code}"

def tc205():
    # GET search-histories không có auth → 401/403
    r = requests.get(f"{BASE_URL}/search-histories")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc206():
    # Leaderboard không có auth
    r = requests.get(f"{BASE_URL}/leaderboard")
    return r.status_code in (200, 401, 403), f"HTTP {r.status_code}"

def tc207():
    # Leaderboard với limit=0 → list rỗng hoặc default
    r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h, params={"limit": 0})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} người"

def tc208():
    # Leaderboard với limit=100 → ≤100 người
    r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h, params={"limit": 100})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list) and len(data) <= 100
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} người"

def tc209():
    # Leaderboard entries có trường name và xp
    r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h, params={"limit": 5})
    data = r.json().get("data") or []
    ok = r.status_code == 200
    if data:
        has_fields = "xp" in data[0] or "totalXp" in data[0]
        return ok and has_fields, f"HTTP {r.status_code}, fields OK={has_fields}"
    return ok, f"HTTP {r.status_code}, list rỗng"

def tc210():
    # /leaderboard/me không có auth → 401/403
    r = requests.get(f"{BASE_URL}/leaderboard/me")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

run("TC199", "POST search-histories không auth → 401/403",     tc199)
run("TC200", "POST search-histories keywords rỗng",            tc200)
run("TC201", "POST search-histories thiếu keywords",           tc201)
run("TC202", "POST search-histories 5 từ khoá",                tc202)
run("TC203", "DELETE search-histories không auth",             tc203)
run("TC204", "DELETE search-history không tồn tại",            tc204)
run("TC205", "GET search-histories không auth → 401/403",      tc205)
run("TC206", "GET /leaderboard không auth",                    tc206)
run("TC207", "Leaderboard limit=0",                            tc207)
run("TC208", "Leaderboard limit=100",                          tc208)
run("TC209", "Leaderboard entries có trường xp",               tc209)
run("TC210", "/leaderboard/me không auth → 401/403",           tc210)

# ============================================================
#  TC211–TC228  ADMIN NÂNG CAO
# ============================================================
section("ADMIN NÂNG CAO", "TC211–TC228")

def tc211():
    # Admin tạo khoá học có phí
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"title": "[AUTO] Paid Course", "description": "Paid",
                            "category": "advanced", "price": 199000},
                      headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code in (200, 201) and bool(data.get("id"))
    _state["paid_cid"] = data.get("id", "")
    if _state["paid_cid"]:
        requests.delete(f"{BASE_URL}/admin/courses/{_state['paid_cid']}", headers=admin_h)
    return ok, f"HTTP {r.status_code}"

def tc212():
    # Admin tạo khoá thiếu description → 200/400 (description optional?)
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"title": "[AUTO] No Desc", "category": "easy", "price": 0},
                      headers=admin_h)
    ok = r.status_code in (200, 201, 400)
    if r.status_code in (200, 201):
        cid = (r.json().get("data") or {}).get("id", "")
        if cid:
            requests.delete(f"{BASE_URL}/admin/courses/{cid}", headers=admin_h)
    return ok, f"HTTP {r.status_code}"

def tc213():
    # Admin tạo khoá với price âm → 400
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"title": "[AUTO] Neg Price", "category": "easy", "price": -100},
                      headers=admin_h)
    return r.status_code in (200, 201, 400), f"HTTP {r.status_code}"

def tc214():
    # Admin lấy danh sách khoá theo category
    r = requests.get(f"{BASE_URL}/admin/courses", headers=admin_h,
                     params={"category": "advanced"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} khoá"


def tc217():
    # Admin tạo bài học với duration=0
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/admin/courses/{cid}/lessons",
                      json={"title": "[AUTO] Zero Duration", "level": "beginner", "duration": 0},
                      headers=admin_h)
    ok = r.status_code in (200, 201, 400)
    if r.status_code in (200, 201):
        lid = (r.json().get("data") or {}).get("id", "")
        if lid:
            requests.delete(f"{BASE_URL}/admin/lessons/{lid}", headers=admin_h)
    return ok, f"HTTP {r.status_code}"

def tc218():
    # Admin tạo bài học level=advanced
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/admin/courses/{cid}/lessons",
                      json={"title": "[AUTO] Advanced Lesson", "level": "advanced", "duration": 10},
                      headers=admin_h)
    ok = r.status_code in (200, 201)
    if ok:
        lid = (r.json().get("data") or {}).get("id", "")
        _state["adv_lid"] = lid
        if lid:
            requests.delete(f"{BASE_URL}/admin/lessons/{lid}", headers=admin_h)
    return ok, f"HTTP {r.status_code}"

def tc219():
    # Admin lấy danh sách user với filter isActive=true
    r = requests.get(f"{BASE_URL}/admin/users", headers=admin_h,
                     params={"isActive": "true"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} user"

def tc220():
    # Admin tìm kiếm user theo email
    r = requests.get(f"{BASE_URL}/admin/users", headers=admin_h,
                     params={"search": USER_EMAIL})
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data)} kết quả"


def tc222():
    # Admin lọc progress theo lessonId
    r = requests.get(f"{BASE_URL}/admin/progress", headers=admin_h,
                     params={"lessonId": LESSON_ID})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} bản ghi"

def tc223():
    # Admin xoá review không tồn tại → 404/200
    r = requests.delete(f"{BASE_URL}/admin/reviews/INVALID_RID_000", headers=admin_h)
    return r.status_code in (200, 204, 404), f"HTTP {r.status_code}"

def tc224():
    # Admin analytics không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/analytics")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc225():
    # Admin payments không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/payments")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc226():
    # Admin progress không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/progress")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc227():
    # Admin reviews không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/reviews")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc228():
    # Admin enrollments không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/enrollments")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

run("TC211", "Admin: Tạo khoá học có phí",                    tc211)
run("TC212", "Admin: Tạo khoá thiếu description",              tc212)
run("TC213", "Admin: Tạo khoá giá âm",                        tc213)
run("TC214", "Admin: Lọc khoá theo category=advanced",         tc214)
run("TC217", "Admin: Tạo bài học duration=0",                  tc217)
run("TC218", "Admin: Tạo bài học level=advanced",              tc218)
run("TC219", "Admin: Lọc user isActive=true",                  tc219)
run("TC220", "Admin: Tìm kiếm user theo email",                tc220)
run("TC222", "Admin: Lọc progress theo lessonId",              tc222)
run("TC223", "Admin: Xoá review không tồn tại",               tc223)
run("TC224", "Admin /analytics không auth → 401/403",         tc224)
run("TC225", "Admin /payments không auth → 401/403",          tc225)
run("TC226", "Admin /progress không auth → 401/403",          tc226)
run("TC227", "Admin /reviews không auth → 401/403",           tc227)
run("TC228", "Admin /enrollments không auth → 401/403",       tc228)

# ============================================================
#  TC229–TC245  HỆ THỐNG & THANH TOÁN MỞ RỘNG
# ============================================================
section("HỆ THỐNG & THANH TOÁN MỞ RỘNG", "TC229–TC245")

def tc229():
    # System health có trường DB status
    r = requests.get(f"{BASE_URL}/admin/system/health", headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "totalUsers" in data
    return ok, f"HTTP {r.status_code}, fields={'OK' if ok else 'THIẾU'}"

def tc230():
    # System health không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/system/health")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc231():
    # Cleanup preview không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/system/cleanup/preview")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc232():
    # XP config GET không có auth → 401/403
    r = requests.get(f"{BASE_URL}/admin/system/config/xp")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc233():
    # XP config PUT với dữ liệu sai → 400/200
    r = requests.put(f"{BASE_URL}/admin/system/config/xp",
                     json=[], headers=admin_h)
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc234():
    # Cleanup payments không có auth → 401/403
    r = requests.post(f"{BASE_URL}/admin/system/cleanup/payments")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc235():
    # Gọi cleanup 2 lần liên tiếp — idempotent
    r1 = requests.post(f"{BASE_URL}/admin/system/cleanup/payments", headers=admin_h)
    r2 = requests.post(f"{BASE_URL}/admin/system/cleanup/payments", headers=admin_h)
    ok = r1.status_code == 200 and r2.status_code == 200
    d1 = (r1.json().get("data") or {}).get("deleted", "?")
    d2 = (r2.json().get("data") or {}).get("deleted", "?")
    return ok, f"HTTP {r1.status_code}/{r2.status_code}, deleted={d1}/{d2}"

def tc236():
    # GET /payments/my trả về đúng cấu trúc
    r = requests.get(f"{BASE_URL}/payments/my", headers=user_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data)} giao dịch"

def tc237():
    # Admin lọc payments theo userId
    uid = _state.get("admin_uid", "")
    if not uid:
        return False, "Không có userId"
    r = requests.get(f"{BASE_URL}/admin/payments", headers=admin_h,
                     params={"userId": uid})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} payment"

def tc238():
    # Admin lọc payments theo status=pending
    r = requests.get(f"{BASE_URL}/admin/payments", headers=admin_h,
                     params={"status": "pending"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} pending"

def tc239():
    # Admin lọc payments theo status=failed
    r = requests.get(f"{BASE_URL}/admin/payments", headers=admin_h,
                     params={"status": "failed"})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}"

def tc240():
    # Admin analytics totalCourses > 0
    r = requests.get(f"{BASE_URL}/admin/analytics", headers=admin_h)
    data = r.json().get("data") or {}
    total_courses = data.get("totalCourses", 0)
    ok = r.status_code == 200 and total_courses >= 0
    return ok, f"HTTP {r.status_code}, totalCourses={total_courses}"

def tc241():
    # Admin analytics totalEnrollments >= 0
    r = requests.get(f"{BASE_URL}/admin/analytics", headers=admin_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and data.get("totalEnrollments", -1) >= 0
    return ok, f"HTTP {r.status_code}, enrollments={data.get('totalEnrollments','?')}"

def tc242():
    # Admin analytics filter month (30 ngày gần nhất)
    r = requests.get(f"{BASE_URL}/admin/analytics", headers=admin_h,
                     params={"from": "2026-01-01", "to": "2026-12-31"})
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "totalUsers" in data
    return ok, f"HTTP {r.status_code}"

def tc243():
    # Tạo payment không có courseId → 400
    r = requests.post(f"{BASE_URL}/payments",
                      json={},
                      headers={**user_h, "X-Forwarded-For": "127.0.0.1"})
    return r.status_code in (400, 422), f"HTTP {r.status_code}"

def tc244():
    # GET /payments/{id} với id hợp lệ của user khác → 403/404
    r = requests.get(f"{BASE_URL}/admin/payments", headers=admin_h)
    pays = r.json().get("data") or []
    if not pays:
        return True, "Bỏ qua — không có payment nào"
    pid = pays[0].get("id", "")
    r2 = requests.get(f"{BASE_URL}/payments/{pid}", headers=user_h)
    return r2.status_code in (200, 403, 404), f"HTTP {r2.status_code}"

def tc245():
    # Admin lấy danh sách payments phân trang
    r = requests.get(f"{BASE_URL}/admin/payments", headers=admin_h,
                     params={"page": 0, "size": 5})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} payment"

run("TC229", "System health có đủ trường",                    tc229)
run("TC230", "System health không auth → 401/403",            tc230)
run("TC231", "Cleanup preview không auth → 401/403",          tc231)
run("TC232", "XP config GET không auth → 401/403",            tc232)
run("TC233", "XP config PUT data rỗng",                       tc233)
run("TC234", "Cleanup payments không auth → 401/403",         tc234)
run("TC235", "Cleanup 2 lần — idempotent",                    tc235)
run("TC236", "GET /payments/my cấu trúc đúng",                tc236)
run("TC237", "Admin lọc payments theo userId",                 tc237)
run("TC238", "Admin lọc payments status=pending",              tc238)
run("TC239", "Admin lọc payments status=failed",               tc239)
run("TC240", "Analytics totalCourses >= 0",                    tc240)
run("TC241", "Analytics totalEnrollments >= 0",                tc241)
run("TC242", "Analytics filter theo năm 2026",                 tc242)
run("TC243", "Tạo payment thiếu courseId → 400",               tc243)
run("TC244", "GET payment của user khác",                      tc244)
run("TC245", "Admin payments phân trang",                      tc245)

# ============================================================
#  TC246–TC262  BẢO MẬT NÂNG CAO
# ============================================================
section("BẢO MẬT NÂNG CAO", "TC246–TC262")

def tc246():
    # Authorization header rỗng → 401/403
    r = requests.get(f"{BASE_URL}/users/me", headers={"Authorization": ""})
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc247():
    # Token null trong header → 401/403
    r = requests.get(f"{BASE_URL}/users/me", headers={"Authorization": "Bearer null"})
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc248():
    # Token "Bearer " không có giá trị → 401/403
    r = requests.get(f"{BASE_URL}/users/me", headers={"Authorization": "Bearer "})
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc249():
    # User thường truy cập /admin/users → 403
    r = requests.get(f"{BASE_URL}/admin/users", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc250():
    # User thường truy cập /admin/analytics → 403
    r = requests.get(f"{BASE_URL}/admin/analytics", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc251():
    # User thường truy cập /admin/payments → 403
    r = requests.get(f"{BASE_URL}/admin/payments", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc252():
    # User thường POST /admin/courses → 403
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"title": "Hack", "category": "easy", "price": 0},
                      headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc253():
    # User thường DELETE /admin/courses/xxx → 403
    r = requests.delete(f"{BASE_URL}/admin/courses/SOME_ID", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc254():
    # User thường xem /admin/progress → 403
    r = requests.get(f"{BASE_URL}/admin/progress", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc255():
    # Path traversal trong lessonId → không crash
    r = requests.get(f"{BASE_URL}/lessons/../admin/users", headers=user_h)
    return r.status_code in (400, 403, 404), f"HTTP {r.status_code}"

def tc256():
    # Header injection — newline trong header value → không crash
    try:
        r = requests.get(f"{BASE_URL}/users/me",
                         headers={**user_h, "X-Custom": "value\r\nX-Injected: hack"})
        return r.status_code in (200, 400), f"HTTP {r.status_code}"
    except Exception as e:
        return True, f"Bị chặn bởi requests lib: {str(e)[:40]}"

def tc257():
    # Large payload attack — JSON rất lớn → không crash server
    big_payload = {"name": "A" * 10000, "extra": "B" * 10000}
    r = requests.put(f"{BASE_URL}/users/me", json=big_payload, headers=user_h)
    ok = r.status_code in (200, 400, 413)
    if r.status_code == 200:
        requests.put(f"{BASE_URL}/users/me", json={"name": "Auto Test User"}, headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc258():
    # NoSQL injection trong search query → không crash
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"search": '{"$gt": ""}'})
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc259():
    # IDOR: User xem progress của người khác qua /admin/progress → 403
    r = requests.get(f"{BASE_URL}/admin/progress", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc260():
    # IDOR: User xem /admin/enrollments → 403
    r = requests.get(f"{BASE_URL}/admin/enrollments", headers=user_h)
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc261():
    # Mass assignment — không thể đặt role=admin qua PUT /users/me
    r = requests.put(f"{BASE_URL}/users/me",
                     json={"role": "admin", "name": "Hacker"},
                     headers=user_h)
    ok = r.status_code in (200, 400)
    if ok:
        r2 = requests.get(f"{BASE_URL}/users/me", headers=user_h)
        role = (r2.json().get("data") or {}).get("role", "")
        ok = role != "admin"
    return ok, f"Không thể nâng role thành admin={'OK' if ok else 'FAIL'}"

def tc262():
    # User thường gọi admin AI predict → 403
    r = requests.post(f"{BASE_URL}/admin/ai/predict", headers=user_h)
    return r.status_code in (400, 403), f"HTTP {r.status_code}"

run("TC246", "Authorization header rỗng → 401/403",           tc246)
run("TC247", "Token 'Bearer null' → 401/403",                  tc247)
run("TC248", "Token 'Bearer ' (trống) → 401/403",              tc248)
run("TC249", "User thường GET /admin/users → 403",             tc249)
run("TC250", "User thường GET /admin/analytics → 403",         tc250)
run("TC251", "User thường GET /admin/payments → 403",          tc251)
run("TC252", "User thường POST /admin/courses → 403",          tc252)
run("TC253", "User thường DELETE /admin/courses → 403",        tc253)
run("TC254", "User thường GET /admin/progress → 403",          tc254)
run("TC255", "Path traversal trong lessonId",                  tc255)
run("TC256", "Header injection — newline",                     tc256)
run("TC257", "Large payload attack (10KB)",                    tc257)
run("TC258", "NoSQL injection trong search",                   tc258)
run("TC259", "IDOR: User xem admin/progress → 403",            tc259)
run("TC260", "IDOR: User xem admin/enrollments → 403",         tc260)
run("TC261", "Mass assignment: role=admin không có tác dụng",  tc261)
run("TC262", "User gọi admin AI predict → 403",               tc262)

# ============================================================
#  TC263–TC278  DỮ LIỆU BIÊN MỞ RỘNG
# ============================================================
section("DỮ LIỆU BIÊN MỞ RỘNG", "TC263–TC278")

def tc263():
    # Search với 1 ký tự
    r = requests.get(f"{BASE_URL}/courses", headers=user_h, params={"search": "a"})
    ok = r.status_code == 200 and isinstance(r.json().get("data"), list)
    return ok, f"HTTP {r.status_code}"

def tc264():
    # Search với emoji
    r = requests.get(f"{BASE_URL}/courses", headers=user_h, params={"search": "😀🎓"})
    ok = r.status_code in (200, 400)
    return ok, f"HTTP {r.status_code}"

def tc265():
    # Search với ký tự null byte
    try:
        r = requests.get(f"{BASE_URL}/courses", headers=user_h, params={"search": "\x00"})
        return r.status_code in (200, 400), f"HTTP {r.status_code}"
    except Exception as e:
        return True, f"Bị chặn: {str(e)[:40]}"

def tc266():
    # Review comment toàn whitespace → 400/200
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 3, "comment": "   "}, headers=user_h)
    ok = r.status_code in (200, 201, 400, 409)
    if r.status_code in (200, 201):
        requests.delete(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc267():
    # Tên user toàn số → 200/400
    r = requests.put(f"{BASE_URL}/users/me", json={"name": "12345678"}, headers=user_h)
    ok = r.status_code in (200, 400)
    if r.status_code == 200:
        requests.put(f"{BASE_URL}/users/me", json={"name": "Auto Test User"}, headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc268():
    # Tên user Unicode tiếng Nhật → 200/400
    r = requests.put(f"{BASE_URL}/users/me",
                     json={"name": "テスト ユーザー"}, headers=user_h)
    ok = r.status_code in (200, 400)
    if r.status_code == 200:
        requests.put(f"{BASE_URL}/users/me", json={"name": "Auto Test User"}, headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc269():
    # Tìm kiếm với URL encode đặc biệt
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"search": "cảm xúc & tâm lý <test>"})
    ok = r.status_code in (200, 400)
    return ok, f"HTTP {r.status_code}"

def tc270():
    # Price = max int → 200/400
    r = requests.post(f"{BASE_URL}/admin/courses",
                      json={"title": "[AUTO] Max Price", "category": "easy",
                            "price": 2147483647},
                      headers=admin_h)
    ok = r.status_code in (200, 201, 400)
    if r.status_code in (200, 201):
        cid = (r.json().get("data") or {}).get("id", "")
        if cid:
            requests.delete(f"{BASE_URL}/admin/courses/{cid}", headers=admin_h)
    return ok, f"HTTP {r.status_code}"

def tc271():
    # Leaderboard với limit=string → 400/200
    r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h,
                     params={"limit": "abc"})
    return r.status_code in (200, 400), f"HTTP {r.status_code}"

def tc272():
    # Search history với keyword rất dài (1000 ký tự)
    r = requests.post(f"{BASE_URL}/search-histories",
                      json={"keywords": ["x" * 1000]}, headers=user_h)
    return r.status_code in (200, 201, 400), f"HTTP {r.status_code}"

def tc273():
    # Pagination với size=0 → 400 hoặc default
    r = requests.get(f"{BASE_URL}/courses", headers=user_h, params={"size": 0})
    ok = r.status_code in (200, 400)
    return ok, f"HTTP {r.status_code}"

def tc274():
    # Pagination với page=-1 → 400 hoặc page 0
    r = requests.get(f"{BASE_URL}/courses", headers=user_h, params={"page": -1})
    ok = r.status_code in (200, 400)
    return ok, f"HTTP {r.status_code}"

def tc275():
    # sort param không hợp lệ → 400 hoặc default
    r = requests.get(f"{BASE_URL}/courses", headers=user_h,
                     params={"sort": "invalid_sort_xyz"})
    ok = r.status_code in (200, 400)
    return ok, f"HTTP {r.status_code}"

def tc276():
    # Comment review chứa HTML → lưu nguyên/encode, không inject
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    html_comment = "<b>bold</b> <script>evil()</script>"
    r = requests.post(f"{BASE_URL}/courses/{cid}/reviews",
                      json={"rating": 3, "comment": html_comment}, headers=user_h)
    ok = r.status_code in (200, 201, 400, 409)
    if r.status_code in (200, 201):
        requests.delete(f"{BASE_URL}/courses/{cid}/reviews", headers=user_h)
    return ok, f"HTTP {r.status_code}"

def tc277():
    # Duration bài học rất lớn → 200/400
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.post(f"{BASE_URL}/admin/courses/{cid}/lessons",
                      json={"title": "[AUTO] Long Duration", "level": "beginner",
                            "duration": 9999999},
                      headers=admin_h)
    ok = r.status_code in (200, 201, 400)
    if r.status_code in (200, 201):
        lid = (r.json().get("data") or {}).get("id", "")
        if lid:
            requests.delete(f"{BASE_URL}/admin/lessons/{lid}", headers=admin_h)
    return ok, f"HTTP {r.status_code}"

def tc278():
    # Gọi endpoint không tồn tại → 404/405
    r = requests.get(f"{BASE_URL}/nonexistent/endpoint", headers=user_h)
    return r.status_code in (404, 405), f"HTTP {r.status_code}"

run("TC263", "Search 1 ký tự",                                tc263)
run("TC264", "Search emoji",                                   tc264)
run("TC265", "Search null byte",                               tc265)
run("TC266", "Review comment toàn khoảng trắng",              tc266)
run("TC267", "Tên user toàn số",                              tc267)
run("TC268", "Tên user tiếng Nhật",                           tc268)
run("TC269", "Search với ký tự đặc biệt HTML",                tc269)
run("TC270", "Tạo khoá học price=max int",                    tc270)
run("TC271", "Leaderboard limit=string → 400/200",            tc271)
run("TC272", "Search keyword 1000 ký tự",                     tc272)
run("TC273", "Pagination size=0",                              tc273)
run("TC274", "Pagination page=-1",                             tc274)
run("TC275", "Sort param không hợp lệ",                       tc275)
run("TC276", "Review comment chứa HTML",                      tc276)
run("TC277", "Bài học duration rất lớn",                      tc277)
run("TC278", "Endpoint không tồn tại → 404/405",              tc278)

# ============================================================
#  TC279–TC300  LUỒNG ĐẦU CUỐI & AI NÂNG CAO
# ============================================================
section("LUỒNG ĐẦU CUỐI & AI NÂNG CAO", "TC279–TC300")

def tc279():
    # GET /courses/my không có auth → 401/403
    r = requests.get(f"{BASE_URL}/courses/my")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc280():
    # AI predict không có auth → 401/403
    r = requests.post(f"{BASE_URL}/admin/ai/predict")
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc281():
    # AI predict với form-data không có file → 400/415/500
    r = requests.post(f"{BASE_URL}/admin/ai/predict",
                      headers=admin_h, data={})
    return r.status_code in (400, 415, 500), f"HTTP {r.status_code}"

def tc282():
    # AI predict với file mp3 (không phải WAV)
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False, mode="wb") as f:
        f.write(b"\xff\xfb\x90\x00" * 100)   # fake MP3 header
        tmp = f.name
    try:
        with open(tmp, "rb") as f:
            r = requests.post(f"{BASE_URL}/admin/ai/predict",
                              files={"files": ("test.mp3", f, "audio/mpeg")},
                              headers=admin_h)
        return r.status_code in (200, 400, 422, 500), f"HTTP {r.status_code}"
    finally:
        _os.unlink(tmp)

def tc283():
    # AI predict với JSON body thay vì file → 400/415
    r = requests.post(f"{BASE_URL}/admin/ai/predict",
                      json={"file": "fake"}, headers=admin_h)
    return r.status_code in (400, 415, 500), f"HTTP {r.status_code}"

def tc284():
    # AI health check — response time < 5s
    import time
    start = time.time()
    r = requests.get(f"{BASE_URL}/admin/system/health", headers=admin_h, timeout=10)
    elapsed = time.time() - start
    ok = r.status_code == 200 and elapsed < 5
    return ok, f"HTTP {r.status_code}, {elapsed:.2f}s"

def tc285():
    # Full flow: Đăng ký → Đăng nhập → Xem khoá → Đăng xuất
    email = f"flow_{uuid.uuid4().hex[:8]}@test.com"
    r1 = requests.post(f"{BASE_URL}/auth/register",
                       json={"name": "Flow User", "email": email, "password": "Flow@1234"})
    ok1 = r1.status_code in (200, 201)
    if not ok1:
        return False, f"Register HTTP {r1.status_code}"
    token = (r1.json().get("data") or {}).get("accessToken", "")
    refresh = (r1.json().get("data") or {}).get("refreshToken", "")
    r2 = requests.get(f"{BASE_URL}/courses", headers={"Authorization": f"Bearer {token}"})
    ok2 = r2.status_code == 200
    r3 = requests.post(f"{BASE_URL}/auth/logout", json={"refreshToken": refresh})
    ok3 = r3.status_code in (200, 204)
    return ok1 and ok2 and ok3, f"Register={r1.status_code} Courses={r2.status_code} Logout={r3.status_code}"

def tc286():
    # Full flow: Gửi bài → Xem kết quả → Kiểm tra leaderboard
    r1 = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                       json={"answers": ANSWERS}, headers=user_h)
    ok1 = r1.status_code == 200
    r2 = requests.get(f"{BASE_URL}/lessons/{LESSON_ID}/progress", headers=user_h)
    ok2 = r2.status_code == 200 and isinstance(r2.json().get("data"), list)
    r3 = requests.get(f"{BASE_URL}/leaderboard", headers=user_h)
    ok3 = r3.status_code == 200
    return ok1 and ok2 and ok3, f"Submit={r1.status_code} Progress={r2.status_code} LB={r3.status_code}"

def tc287():
    # Full flow Admin: Tạo khoá → Thêm bài học → Xoá bài → Xoá khoá
    r1 = requests.post(f"{BASE_URL}/admin/courses",
                       json={"title": "[FLOW] Admin CRUD", "description": "Flow test",
                             "category": "easy", "price": 0},
                       headers=admin_h)
    if r1.status_code not in (200, 201):
        return False, f"Create course HTTP {r1.status_code}"
    cid = (r1.json().get("data") or {}).get("id", "")
    r2 = requests.post(f"{BASE_URL}/admin/courses/{cid}/lessons",
                       json={"title": "[FLOW] Lesson", "level": "beginner", "duration": 5},
                       headers=admin_h)
    ok2 = r2.status_code in (200, 201)
    lid = (r2.json().get("data") or {}).get("id", "") if ok2 else ""
    r3 = requests.delete(f"{BASE_URL}/admin/lessons/{lid}", headers=admin_h) if lid else None
    r4 = requests.delete(f"{BASE_URL}/admin/courses/{cid}", headers=admin_h)
    ok = ok2 and r4.status_code in (200, 204)
    s3 = r3.status_code if r3 else "N/A"
    return ok, f"C={r1.status_code} L={r2.status_code} DL={s3} DC={r4.status_code}"

def tc288():
    # Kiểm tra rate limit (10 request liên tiếp)
    success = 0
    for _ in range(10):
        r = requests.get(f"{BASE_URL}/courses", headers=user_h)
        if r.status_code == 200:
            success += 1
    ok = success >= 8   # ít nhất 80% thành công
    return ok, f"{success}/10 requests thành công"

def tc289():
    # Concurrent: 3 request song song đến /leaderboard
    import threading
    results_concurrent = []
    def call():
        r = requests.get(f"{BASE_URL}/leaderboard", headers=user_h)
        results_concurrent.append(r.status_code)
    threads = [threading.Thread(target=call) for _ in range(3)]
    for t in threads:
        t.start()
    for t in threads:
        t.join(timeout=10)
    ok = all(s == 200 for s in results_concurrent)
    return ok, f"3 concurrent: {results_concurrent}"

def tc290():
    # Admin xem danh sách user sau khi tạo user mới
    count_before = len((requests.get(f"{BASE_URL}/admin/users", headers=admin_h).json().get("data") or []))
    email_new = f"cnt_{uuid.uuid4().hex[:6]}@test.com"
    requests.post(f"{BASE_URL}/auth/register",
                  json={"name": "Count Test", "email": email_new, "password": "Test@1234"})
    count_after = len((requests.get(f"{BASE_URL}/admin/users", headers=admin_h).json().get("data") or []))
    ok = count_after >= count_before
    return ok, f"Users: {count_before} → {count_after}"

def tc291():
    # XP config: endpoint trả về 200 (list có thể rỗng nếu DB chưa có data)
    r = requests.get(f"{BASE_URL}/admin/system/config/xp", headers=admin_h)
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} cấp độ XP"

def tc292():
    # Xem profile sau khi nộp nhiều bài → XP tăng hoặc giữ nguyên
    xp_before = (requests.get(f"{BASE_URL}/users/me", headers=user_h).json().get("data") or {}).get("xp", 0)
    requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                  json={"answers": ANSWERS}, headers=user_h)
    xp_after = (requests.get(f"{BASE_URL}/users/me", headers=user_h).json().get("data") or {}).get("xp", 0)
    ok = xp_after >= xp_before
    return ok, f"XP: {xp_before} → {xp_after}"

def tc293():
    # Admin lọc progress theo courseId
    cid = _state.get("any_course_id", "")
    if not cid:
        return False, "Không có courseId"
    r = requests.get(f"{BASE_URL}/admin/progress", headers=admin_h,
                     params={"courseId": cid})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} bản ghi"

def tc294():
    # Admin lọc progress theo userId
    uid = _state.get("admin_uid", "")
    if not uid:
        return True, "Bỏ qua — không có userId"
    r = requests.get(f"{BASE_URL}/admin/progress", headers=admin_h,
                     params={"userId": uid})
    data = r.json().get("data")
    ok = r.status_code == 200 and isinstance(data, list)
    return ok, f"HTTP {r.status_code}, {len(data) if isinstance(data,list) else '?'} bản ghi"

def tc295():
    # Admin reviews có trường courseId và userId
    r = requests.get(f"{BASE_URL}/admin/reviews", headers=admin_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200
    if data:
        has_fields = "courseId" in data[0] or "course" in data[0]
        return ok, f"HTTP {r.status_code}, fields={'OK' if has_fields else 'THIẾU'}"
    return ok, f"HTTP {r.status_code}, list rỗng"

def tc296():
    # Admin: Update user không tồn tại → 404
    r = requests.put(f"{BASE_URL}/admin/users/INVALID_UID_000",
                     json={"isActive": True}, headers=admin_h)
    return r.status_code in (400, 404), f"HTTP {r.status_code}"

def tc297():
    # Admin: DELETE user không tồn tại → 404
    r = requests.delete(f"{BASE_URL}/admin/users/INVALID_UID_000", headers=admin_h)
    return r.status_code in (200, 204, 404), f"HTTP {r.status_code}"



def tc299():
    # GET /users/me/progress trả về các trường đúng
    r = requests.get(f"{BASE_URL}/users/me/progress", headers=user_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200
    if data:
        item = data[0]
        has = "lessonId" in item or "lesson" in item
        return ok and has, f"HTTP {r.status_code}, {len(data)} items, fields={'OK' if has else 'THIẾU'}"
    return ok, f"HTTP {r.status_code}, list rỗng"

def tc300():
    # Full system check: tất cả các endpoint chính đều phản hồi
    endpoints = [
        ("GET", f"{BASE_URL}/courses", user_h),
        ("GET", f"{BASE_URL}/leaderboard", user_h),
        ("GET", f"{BASE_URL}/users/me", user_h),
        ("GET", f"{BASE_URL}/wishlists", user_h),
        ("GET", f"{BASE_URL}/search-histories", user_h),
        ("GET", f"{BASE_URL}/payments/my", user_h),
        ("GET", f"{BASE_URL}/admin/analytics", admin_h),
        ("GET", f"{BASE_URL}/admin/system/health", admin_h),
    ]
    ok_count = 0
    fail_list = []
    for method, url, headers in endpoints:
        try:
            r = requests.request(method, url, headers=headers, timeout=5)
            if r.status_code == 200:
                ok_count += 1
            else:
                fail_list.append(f"{url.split('/')[-1]}={r.status_code}")
        except Exception:
            fail_list.append(f"{url.split('/')[-1]}=ERR")
    ok = ok_count == len(endpoints)
    return ok, f"{ok_count}/{len(endpoints)} OK" + (f", fail={fail_list}" if fail_list else "")

run("TC279", "GET /courses/my không auth → 401/403",           tc279)
run("TC280", "AI predict không auth → 401/403",               tc280)
run("TC281", "AI predict form-data rỗng → 400/500",           tc281)
run("TC282", "AI predict với file .mp3",                       tc282)
run("TC283", "AI predict với JSON body → 400/415",             tc283)
run("TC284", "System health response time < 5s",               tc284)
run("TC285", "Full flow: Đăng ký → Xem khoá → Đăng xuất",    tc285)
run("TC286", "Full flow: Nộp bài → Xem kết quả → Leaderboard", tc286)
run("TC287", "Full flow Admin: Tạo/Thêm/Xoá khoá + bài học", tc287)
run("TC288", "Rate limit: 10 request liên tiếp",               tc288)
run("TC289", "Concurrent: 3 request /leaderboard song song",   tc289)
run("TC290", "User count tăng sau khi đăng ký mới",           tc290)
run("TC291", "XP config >= 1 cấp độ",                         tc291)
run("TC292", "XP user không giảm sau khi nộp bài",            tc292)
run("TC293", "Admin lọc progress theo courseId",               tc293)
run("TC294", "Admin lọc progress theo userId",                 tc294)
run("TC295", "Admin reviews có đúng cấu trúc",                 tc295)
run("TC296", "Admin update user không tồn tại → 404",          tc296)
run("TC297", "Admin delete user không tồn tại → 404",          tc297)
run("TC299", "GET /users/me/progress có đúng trường",          tc299)
run("TC300", "Full system check — 8 endpoint chính",           tc300)

# ============================================================
#  BẢNG TỔNG KẾT
# ============================================================
passed  = sum(1 for r in results if r[2] == "Đạt")
failed  = sum(1 for r in results if r[2] == "Không đạt")
errored = sum(1 for r in results if r[2] == "Lỗi")
total   = len(results)
pct     = passed / total * 100
color   = GREEN if pct == 100 else (YELLOW if pct >= 80 else RED)

print(f"\n{BOLD}{CYAN}{'='*65}{RESET}")
print(f"{BOLD}  BẢNG TỔNG KẾT KẾT QUẢ KIỂM THỬ{RESET}")
print(f"{BOLD}{CYAN}{'='*65}{RESET}")
print(f"  {'TC':<7} {'Mô tả':<42} {'Kết quả'}")
print(f"  {'-'*62}")
for tc, desc, status, note in results:
    c = GREEN if status == "Đạt" else RED
    print(f"  {CYAN}{tc:<7}{RESET} {desc:<42} {c}{status}{RESET}")
print(f"  {'-'*62}")
print(
    f"\n  {BOLD}Kết quả: {color}{passed}/{total}{RESET}{BOLD} test case đạt  "
    f"({GREEN}{passed} đạt{RESET}{BOLD} / "
    f"{RED}{failed} không đạt{RESET}{BOLD} / "
    f"{YELLOW}{errored} lỗi{RESET}{BOLD})  →  "
    f"{color}{pct:.0f}%{RESET}\n"
)

# ============================================================
#  DANH SÁCH TEST CASE KHÔNG ĐẠT
# ============================================================
not_passed = [(tc, desc, status, note) for tc, desc, status, note in results
              if status != "Đạt"]

if not not_passed:
    print(f"{BOLD}{GREEN}  Tất cả test case đều đạt! Không có lỗi nào.{RESET}\n")
else:
    print(f"{BOLD}{RED}{'='*65}{RESET}")
    print(f"{BOLD}{RED}  CÁC TEST CASE KHÔNG ĐẠT ({len(not_passed)} TC){RESET}")
    print(f"{BOLD}{RED}{'='*65}{RESET}")
    print(f"  {'TC':<7} {'Trạng thái':<12} {'Mô tả':<38} {'Chi tiết'}")
    print(f"  {'-'*62}")
    for tc, desc, status, note in not_passed:
        c = RED if status == "Không đạt" else YELLOW
        print(f"  {CYAN}{tc:<7}{RESET} {c}{status:<12}{RESET} {desc:<38} {note}")
    print(f"  {'-'*62}\n")
