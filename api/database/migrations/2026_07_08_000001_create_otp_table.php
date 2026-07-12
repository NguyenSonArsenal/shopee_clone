<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('otp', function (Blueprint $table) {
            $table->id();
            $table->string('identifier', 100);
            $table->enum('purpose', ['register', 'forgot_password'])->comment('Mục đích gửi otp');
            $table->string('otp')->comment('Đã mã hóa');
            $table->dateTime('otp_expires_at')->comment('Thời gian hết hạn mã otp');
            $table->dateTime('otp_used_at')->nullable()->comment('Thời điểm mã được dùng -> đảm bảo dùng 1 lần');
            $table->unsignedTinyInteger('attempts')->default(0)->comment('Số lần nhập sai mã otp -> chống brute-force');
            $table->string('reset_token')->nullable()->comment('Mã cho màn hình form password reset');
            $table->dateTime('reset_token_expires_at')->nullable()->comment('Thời gian hết hạn mã reset token');
            $table->dateTime('reset_token_used_at')->nullable()->comment('Mã reset token được sử dụng khi nào ');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp');
    }
};
