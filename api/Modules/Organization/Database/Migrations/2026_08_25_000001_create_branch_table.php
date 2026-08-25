<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('branch', function (Blueprint $table) {
            $table->id();
            $table->integer('company_id')->nullable()->comment('Thuộc công ty nào');
            $table->string('name', 255)->comment('Tên chi nhánh');
            $table->string('code', 50)->nullable()->comment('Mã chi nhánh');
            $table->string('address', 255)->nullable();
            $table->string('phone', 20)->nullable();
            $table->integer('manager_id')->nullable()->comment('Người quản lý chi nhánh');
            $table->integer('receptionist_id')->nullable()->comment('Lễ tân văn phòng');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('branch');
    }
};
