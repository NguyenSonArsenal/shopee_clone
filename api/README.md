# README

---

## 1. Setup & Run Local

### Yêu cầu
- PHP >= 8.0
- MySQL >= 5.7
- Composer

### Cài đặt một lệnh
```bash
git clone <repo-url> && cd quanlycong
composer install
cp .env.example .env
# Cập nhật DB_DATABASE, DB_USERNAME, DB_PASSWORD trong .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Truy cập: **/staff-shift-kpi/login**

---

## 2. DB Migration & Seed

```bash
# Reset và seed toàn bộ (recommended cho reviewer)
php artisan migrate:fresh --seed
```
