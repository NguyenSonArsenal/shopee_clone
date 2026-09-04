<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('config', function (Blueprint $table) {
            $table->bigIncrements('id');
            // Định danh duy nhất, đặt theo dạng "nhóm.tên" (vd: pagination.per_page_options)
            $table->string('key', 150)->unique();
            // Luôn lưu string, ép kiểu lại theo data_type khi đọc (xem Config::getValue())
            $table->text('value')->nullable();
            $table->string('data_type', 20)->default('string')->comment('string|integer|decimal|boolean|json');
            $table->string('group', 50)->default('general')->index();
            $table->string('description', 255)->nullable();
            // true = cho phép FE public đọc (vd: cấu hình phân trang); false = chỉ admin/backend đọc
            $table->boolean('is_public')->default(false);
        });

        // Seed giá trị mẫu cấu hình phân trang, dùng ngay khi cài mới không cần chạy seeder riêng
        DB::table('config')->insert([
            [
                'key' => 'pagination.per_page_options',
                'value' => json_encode([10, 20, 50, 100]),
                'data_type' => 'json',
                'group' => 'general',
                'description' => 'Các mức số dòng/trang cho phép chọn ở màn danh sách',
                'is_public' => false,
            ],
            [
                'key' => 'pagination.default_per_page',
                'value' => '50',
                'data_type' => 'integer',
                'group' => 'general',
                'description' => 'Số dòng/trang mặc định khi chưa chọn',
                'is_public' => false,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('config');
    }
};
