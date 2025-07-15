# 📘 Hướng dẫn cài đặt dự án `k_blog`

## ⚙️ 1. Tạo file `.env.docker`, `.env`

- Tạo file `.env.docker` ở thư mục gốc và thêm các biến môi trường cho PostgreSQL

- Tạo file .env ở thư mục gốc và thêm chuỗi kết nối tới database

##  2. Cài đặt dependencies

```bash
npm install
```

## 🐳 3. Khởi động database bằng Docker

```bash
docker-compose up -d
```

##  🔄 4. Chạy migrate để tạo schema cho database

```
npx prisma migrate deploy
npx prisma generate
```

## 🌱 5. Seed dữ liệu 

```bash
npm run seed
```

## 🚀 8. Khởi chạy ứng dụng

```bash
npm run dev
```