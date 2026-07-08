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
            $table->string('code');
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable()->comment('Thời điểm mã được dùng -> đảm bảo dùng 1 lần');
            $table->unsignedTinyInteger('attempts')->default(0)->comment('Số lần nhập sai -> chống brute-force');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp');
    }
};
