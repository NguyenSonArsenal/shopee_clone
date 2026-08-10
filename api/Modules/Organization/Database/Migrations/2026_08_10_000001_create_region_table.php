<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Modules\Organization\Models\Region;

return new class extends Migration {
    public function up(): void
    {
        $lengths = config('validate.lengths.' . Region::getTableName());

        Schema::create('region', function (Blueprint $table) use ($lengths) {
            $table->id();
            $table->integer('company_id')->nullable()->comment('Thuộc công ty nào');
            $table->integer('manager_id')->nullable()->comment('Người quản lý vùng miền');
            $table->string('name', $lengths['name'])->comment('Tên vùng miền');
            $table->string('code', $lengths['code'])->nullable()->comment('Mã vùng miền');
            $table->string('phone', $lengths['phone'])->nullable();
            $table->string('email', $lengths['email'])->nullable();
            $table->string('address', $lengths['address'])->nullable();
            $table->boolean('is_active')->default(true)->comment('Đang hoạt động: 1 hay đã ngừng hoạt động: 0');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('region');
    }
};
