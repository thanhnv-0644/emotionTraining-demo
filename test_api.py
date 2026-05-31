#!/usr/bin/env python3
"""
Kiểm thử API hệ thống Emotion Training
Chạy: python test_api.py
Yêu cầu: pip install requests
"""

import requests
import os

# ============================================================
#  CẤU HÌNH — điền thông tin thực của hệ thống
# ============================================================
BASE_URL    = "http://localhost:8080/api"

USER_EMAIL  = "test@gmail.com"          # tài khoản học viên hợp lệ
USER_PASS   = "123456"

ADMIN_EMAIL = "nvt@gmail.com"             # tài khoản admin hợp lệ
ADMIN_PASS  = "123456"

LESSON_ID   = "1F0XrKoEABmUb5r8Z8Kx29Utpe"           # lessonId hợp lệ trong DB
CLIP_ID     = "zgvjw43R27GZbxvQUbZoGr0tGp"             # audioClipId hợp lệ thuộc lesson trên

AUDIO_FILE  = "00016.wav"                 # file .wav để test AI (đặt cùng thư mục)
# ============================================================

GREEN  = "\033[92m"
RED    = "\033[91m"
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

results    = []
_tokens    = {}   # lưu token từ TC01 để tránh login lại

def run(tc_id, desc, func):
    try:
        ok, note = func()
        mark   = f"{GREEN}Đạt   {RESET}" if ok else f"{RED}Không đạt{RESET}"
        status = "Đạt" if ok else "Không đạt"
    except Exception as e:
        mark, status, note = f"{RED}Lỗi   {RESET}", "Lỗi", str(e)[:55]
    results.append((tc_id, desc, status, note))
    print(f"  {CYAN}{tc_id:<5}{RESET}  {mark}  {note}")

def login(email, password):
    r = requests.post(f"{BASE_URL}/auth/login",
                      json={"email": email, "password": password}, timeout=10)
    data = r.json().get("data")
    if not data or "accessToken" not in data:
        raise RuntimeError(f"Login thất bại cho {email} — HTTP {r.status_code}: {r.text[:80]}")
    return r, data["accessToken"]

# ============================================================
#  TC01–TC05  ĐĂNG NHẬP
# ============================================================
print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
print(f"{BOLD}  KIỂM THỬ CHỨC NĂNG ĐĂNG NHẬP  (TC01–TC05){RESET}")
print(f"{BOLD}{CYAN}{'='*60}{RESET}")

def tc01():
    r, token = login(USER_EMAIL, USER_PASS)
    ok = r.status_code == 200 and bool(token)
    _tokens["user"] = token          # lưu lại, không login lần 2
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

run("TC01", "Đăng nhập hợp lệ",        tc01)
run("TC02", "Sai mật khẩu",             tc02)
run("TC03", "Email không tồn tại",      tc03)
run("TC04", "Bỏ trống email",           tc04)
run("TC05", "Bỏ trống mật khẩu",       tc05)

# Lấy token admin (1 lần duy nhất) — user token đã lưu trong tc01
_, admin_token = login(ADMIN_EMAIL, ADMIN_PASS)
user_h  = {"Authorization": f"Bearer {_tokens['user']}"}
admin_h = {"Authorization": f"Bearer {admin_token}"}
ANSWERS = [{"audioClipId": CLIP_ID, "selectedEmotion": "happiness"}]

# ============================================================
#  TC06–TC10  NỘP BÀI LUYỆN TẬP
# ============================================================
print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
print(f"{BOLD}  KIỂM THỬ CHỨC NĂNG NỘP BÀI  (TC06–TC10){RESET}")
print(f"{BOLD}{CYAN}{'='*60}{RESET}")

def tc06():
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, score={data.get('score','?')}, attemptNumber={data.get('attemptNumber','?')}"

def tc07():
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, attemptNumber={data.get('attemptNumber','?')}"

def tc08():
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    data = r.json().get("data") or {}
    ok = r.status_code == 200 and "score" in data
    return ok, f"HTTP {r.status_code}, attemptNumber={data.get('attemptNumber','?')}"

def tc09():
    r = requests.post(f"{BASE_URL}/lessons/{LESSON_ID}/progress",
                      json={"answers": ANSWERS})          # không có token
    return r.status_code in (401, 403), f"HTTP {r.status_code}"

def tc10():
    r = requests.post(f"{BASE_URL}/lessons/INVALID_LESSON_ID_000/progress",
                      json={"answers": ANSWERS}, headers=user_h)
    return r.status_code == 404, f"HTTP {r.status_code}"

run("TC06", "Nộp lần đầu — tính điểm + XP",      tc06)
run("TC07", "Nộp lần 2 — không cộng XP",          tc07)
run("TC08", "Nộp lần 3 — vẫn HTTP 200",           tc08)
run("TC09", "Không có JWT token → 401",            tc09)
run("TC10", "lessonId không tồn tại → 404",        tc10)

# ============================================================
#  TC11–TC14  AI PHÂN TÍCH CẢM XÚC
# ============================================================
print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
print(f"{BOLD}  KIỂM THỬ CHỨC NĂNG AI  (TC11–TC14){RESET}")
print(f"{BOLD}{CYAN}{'='*60}{RESET}")

AI_URL = f"{BASE_URL}/admin/ai/predict"

def tc11():
    if not os.path.exists(AUDIO_FILE):
        return False, f"Thiếu file {AUDIO_FILE}"
    with open(AUDIO_FILE, "rb") as f:
        r = requests.post(AI_URL, files={"files": f}, headers=admin_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and isinstance(data, list) and len(data) > 0
    return ok, f"HTTP {r.status_code}, {len(data)} kết quả"

def tc12():
    if not os.path.exists(AUDIO_FILE):
        return False, f"Thiếu file {AUDIO_FILE}"
    files = [("files", open(AUDIO_FILE, "rb")), ("files", open(AUDIO_FILE, "rb"))]
    r = requests.post(AI_URL, files=files, headers=admin_h)
    data = r.json().get("data") or []
    ok = r.status_code == 200 and len(data) == 2
    return ok, f"HTTP {r.status_code}, {len(data)} kết quả (2 file)"

def tc13():
    if not os.path.exists(AUDIO_FILE):
        return False, f"Thiếu file {AUDIO_FILE}"
    with open(AUDIO_FILE, "rb") as f:
        r = requests.post(AI_URL, files={"files": f}, headers=user_h)   # user_h, không phải admin
    return r.status_code == 403, f"HTTP {r.status_code}"

def tc14():
    r = requests.post(AI_URL, headers=admin_h)   # không truyền file
    return r.status_code in (400, 500), f"HTTP {r.status_code}"

run("TC11", "Upload 1 file WAV hợp lệ",           tc11)
run("TC12", "Upload nhiều file cùng lúc",          tc12)
run("TC13", "User thường gọi API admin → 403",     tc13)
run("TC14", "Không truyền file → 400",             tc14)

# ============================================================
#  BẢNG TỔNG KẾT
# ============================================================
passed = sum(1 for r in results if r[2] == "Đạt")
total  = len(results)
color  = GREEN if passed == total else RED

print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
print(f"{BOLD}  TỔNG KẾT KẾT QUẢ KIỂM THỬ{RESET}")
print(f"{BOLD}{CYAN}{'='*60}{RESET}")
print(f"  {'TC':<6} {'Mô tả':<38} {'Kết quả'}")
print(f"  {'-'*58}")
for tc, desc, status, note in results:
    c = GREEN if status == "Đạt" else RED
    print(f"  {CYAN}{tc:<6}{RESET} {desc:<38} {c}{status}{RESET}")
print(f"  {'-'*58}")
print(f"\n  {BOLD}Kết quả: {color}{passed}/{total}{RESET}{BOLD} trường hợp đạt"
      f" ({color}{passed/total*100:.0f}%{RESET}{BOLD}){RESET}\n")
