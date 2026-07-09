# HƯỚNG DẪN CÀI ĐẶT HỆ THỐNG EMOTION TRAINING

---

## Cách 1: Docker (Nhanh nhất — Khuyến nghị)

### Yêu cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Bước 1: Tải model AI

Tải file `emotion2vec_viet_finetuned.pt` (359MB) tại:
**https://drive.google.com/file/d/1FpWPFHA1LnVsWPNAQmA8yY6ocpjcW16j/view**

Đặt vào thư mục `AI/`:
```
AI/emotion2vec_viet_finetuned.pt
```

### Bước 2: Tạo file .env

```bash
cp .env.example .env
```

Mở file `.env` và điền các giá trị (xem hướng dẫn chi tiết trong `.env.example`):

| Biến | Ví dụ | Ghi chú |
|------|-------|---------|
| `MYSQL_ROOT_PASSWORD` | `MyPassword@123` | Mật khẩu MySQL tự đặt |
| `JWT_SECRET` | chuỗi >= 32 ký tự | Dùng `openssl rand -hex 32` để tạo |
| `VNPAY_TMN_CODE` | `I1F0D3SL` | Lấy từ email đăng ký VNPay sandbox |
| `VNPAY_HASH_SECRET` | `89769ZR6...` | Lấy từ email đăng ký VNPay sandbox |
| `VNPAY_RETURN_URL` | `http://localhost:3000/payment/return` | Dùng localhost nếu chạy local |
| `SERVER_IP` | `localhost` | IP máy chủ, dùng localhost nếu chạy local |

### Bước 3: Import dữ liệu và khởi động

```bash
# Khởi động toàn bộ hệ thống
docker compose up -d

# Đợi MySQL khởi động xong (~30 giây), rồi import dữ liệu
docker exec -i emotion_mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" emotion_database < emotionDatabase.sql
docker exec -i emotion_mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" emotion_database < data.sql
docker exec -i emotion_mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" emotion_database < detailsData.sql
docker exec -i emotion_mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" emotion_database < detailsData2.sql
docker exec -i emotion_mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" emotion_database < detailsData3.sql
```

### Kết quả

| Dịch vụ   | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:3000    |
| Backend   | http://localhost:8080    |
| AI Service| http://localhost:8000    |

---

## Cách 2: Cài đặt thủ công

### Yêu cầu hệ thống

- Node.js >= 18
- Java 21 (JDK)
- Python 3.9+
- MySQL 8.0+
- Maven 3.9+

### Cấu trúc dự án

```
emotionTraining-GR/
├── pages/               # Frontend (Next.js)
├── components/          # UI components
├── lib/                 # API client
├── backend/             # Backend (Spring Boot)
│   └── src/
├── AI/                  # AI Service (FastAPI)
│   ├── inference_server.py
│   └── requirements.txt
├── emotionDatabase.sql  # Schema database
├── data.sql             # Dữ liệu mẫu
├── detailsData.sql      # Dữ liệu chi tiết
└── .env.example         # Mẫu biến môi trường
```

### Bước 1: Database (MySQL)

```sql
CREATE DATABASE emotion_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import schema và dữ liệu:
```bash
mysql -u root -p emotion_database < emotionDatabase.sql
mysql -u root -p emotion_database < data.sql
mysql -u root -p emotion_database < detailsData.sql
mysql -u root -p emotion_database < detailsData2.sql
mysql -u root -p emotion_database < detailsData3.sql
```

### Bước 2: Backend (Spring Boot)

Tạo file `backend/src/main/resources/application.properties`:

```properties
spring.application.name=backend

spring.datasource.url=jdbc:mysql://localhost:3306/emotion_database?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
spring.jpa.open-in-view=false

jwt.secret=your-very-long-secret-key-for-jwt-signing-must-be-at-least-256-bits-long
jwt.access-token-expiration=3600000
jwt.refresh-token-expiration=604800000

spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=500MB

app.upload.dir=uploads/audio
ai.service.url=http://localhost:8000/predict

vnpay.tmn-code=YOUR_VNPAY_TMN_CODE
vnpay.hash-secret=YOUR_VNPAY_HASH_SECRET
vnpay.payment-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:3000/payment/return

server.port=8080
```

Chạy backend:
```bash
cd backend
./mvnw spring-boot:run
```

Backend chạy tại: `http://localhost:8080`

### Bước 3: AI Service (FastAPI)

**Tùy chọn A — Tải model sẵn (Khuyến nghị):**

Tải `emotion2vec_viet_finetuned.pt` tại:
**https://drive.google.com/file/d/1FpWPFHA1LnVsWPNAQmA8yY6ocpjcW16j/view**

Đặt vào thư mục `AI/`, sau đó:

```bash
cd AI
pip install -r requirements.txt
uvicorn inference_server:app --host 0.0.0.0 --port 8000
```

**Tùy chọn B — Tự train lại (Google Colab):**

1. Upload dataset lên Google Drive với cấu trúc:
```
MyDrive/dataset_v2/
├── processed/      # File .wav chia theo cảm xúc (angry/fear/happy/neutral/sad/surprise)
└── splits/         # train.csv, val.csv, test.csv
```
2. Mở `AI/colab_finetune.ipynb` trên [Google Colab](https://colab.research.google.com)
3. Chọn **Runtime → Change runtime type → T4 GPU**
4. Chạy lần lượt từng cell (Cell 1 → restart runtime → Cell 2 → ... → Cell 8)
5. Model được lưu tại `MyDrive/dataset_v2/models/emotion2vec_viet_finetuned.pt` — tải về đặt vào `AI/`

AI service chạy tại: `http://localhost:8000`

### Bước 4: Frontend (Next.js)

Tạo file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```bash
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

---

## Tài khoản mặc định

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@gmail.com | Admin@123 |
| Student | user@gmail.com | User@123 |

---

## Deploy (Production)

| Thành phần | Platform             |
|------------|----------------------|
| Frontend   | Vercel               |
| Backend    | Railway              |
| Database   | Railway MySQL        |
| AI Service | Local + ngrok tunnel |

Demo: https://emotion-training-demo.vercel.app
