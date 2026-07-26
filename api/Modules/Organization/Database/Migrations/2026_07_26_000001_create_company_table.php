<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('representative_id')->nullable()->comment('Người đại diện pháp lý');
            $table->uuid('manager_id')->nullable()->comment('Người quản lý điều hành');
            $table->string('name', 255)->comment('Tên đầy đủ (pháp lý) của công ty');
            $table->string('short_name', 100)->nullable()->comment('Tên viết tắt / tên thường gọi');
            $table->string('tax_code', 20)->nullable()->comment('Mã số thuế');
            $table->date('established_date')->nullable()->comment('Ngày thành lập');
            $table->string('phone', 15)->nullable();
            $table->string('email', 64)->nullable();
            $table->string('website', 32)->nullable();
            $table->string('address', 255)->nullable()->comment('Địa chỉ trụ sở');
            $table->text('description')->nullable()->comment('Giới thiệu / mô tả công ty');
            $table->string('logo_url', 255)->nullable();
            $table->boolean('is_active')->default(true)->comment('Đang hoạt động hay đã ngừng hoạt động');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company');
    }
};
