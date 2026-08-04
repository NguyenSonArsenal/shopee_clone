<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Modules\Organization\Models\Company;

return new class extends Migration {
    public function up(): void
    {
        $lengths = config('validate.lengths.' . Company::getTableName());

        Schema::create('company', function (Blueprint $table) use ($lengths) {
            $table->id();
            $table->integer('representative_id')->nullable()->comment('Người đại diện pháp lý');
            $table->integer('manager_id')->nullable()->comment('Người quản lý điều hành');
            $table->string('name', $lengths['name'])->comment('Tên đầy đủ (pháp lý) của công ty');
            $table->string('short_name', $lengths['short_name'])->nullable()->comment('Tên viết tắt / tên thường gọi');
            $table->string('tax_code', $lengths['tax_code'])->nullable()->comment('Mã số thuế');
            $table->date('established_date')->nullable()->comment('Ngày thành lập');
            $table->string('phone', $lengths['phone'])->nullable();
            $table->string('email', $lengths['email'])->nullable();
            $table->string('website', $lengths['website'])->nullable();
            $table->string('address', $lengths['address'])->nullable()->comment('Địa chỉ trụ sở');
            $table->text('description')->nullable()->comment('Giới thiệu / mô tả công ty');
            $table->string('logo_url', $lengths['logo_url'])->nullable();
            $table->boolean('is_active')->default(true)->comment('Đang hoạt động: 1 hay đã ngừng hoạt động: 0');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company');
    }
};
