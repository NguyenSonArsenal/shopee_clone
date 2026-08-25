### Quy tắc code cho backend (api)

- Comment giải thích logic: tối đa 2 dòng, dùng `//` — không dùng block `/** */` cho comment thường.
- Ngoại lệ: annotation bắt buộc theo cú pháp riêng của tool (OpenAPI/Swagger `@OA\...`) vẫn phải viết `/** */` nhiều dòng như chuẩn của tool đó — rule 2 dòng không áp cho phần này.
- Không tự động chạy `php artisan migrate` (hay các lệnh migrate/seed khác) — user tự chạy tay.
