<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('department', function (Blueprint $table) {
            $table->id();
            $table->integer('company_id')->nullable()->comment('Thuộc công ty nào');
            $table->integer('branch_id')->nullable()->comment('Thuộc chi nhánh nào');
            $table->string('name', 255)->comment('Tên phòng ban');
            $table->string('code', 50)->nullable()->comment('Mã phòng ban');
            $table->integer('manager_id')->nullable()->comment('Người quản lý phòng ban');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        $now = now();
        DB::table('department')->insert(collect([
            ['name' => 'Ban Giám Đốc', 'code' => '1000'],
            ['name' => 'Phòng Tài chính Kế toán', 'code' => '1001'],
            ['name' => 'Phòng HCNS', 'code' => '1002'],
            ['name' => 'Khối Kinh doanh', 'code' => '1003'],
            ['name' => 'Phòng Trợ lý - Admin', 'code' => '1004'],
            ['name' => 'Phòng AM', 'code' => '1005'],
            ['name' => 'Phòng Phát triển Dự án', 'code' => '1006'],
            ['name' => 'Phòng Marketing', 'code' => '1007'],
            ['name' => 'Phòng Dịch Vụ', 'code' => '1008'],
            ['name' => 'Phòng SEO', 'code' => '1009'],
            ['name' => 'Phòng Công Nghệ', 'code' => '1010'],
        ])->map(fn ($row) => array_merge($row, [
            'is_active' => true,
            'created_at' => $now,
            'updated_at' => $now,
        ]))->all());
    }

    public function down(): void
    {
        Schema::dropIfExists('department');
    }
};
