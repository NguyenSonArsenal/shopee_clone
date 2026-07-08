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
            $table->timestamp('used_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp');
    }
};
