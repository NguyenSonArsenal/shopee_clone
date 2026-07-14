<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserTable extends Migration
{
    public function up()
    {
        Schema::create('user', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('full_name')->nullable();
            $table->string('email', 64)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->tinyInteger('gender')->nullable()->unsigned()->comment('1: boy, 2: girl');
            $table->date('birthday')->nullable();
            $table->string('avatar')->nullable();
            $table->text('rf_token')->nullable();
            $table->enum('type', ['ctv', 'f2', 'kh'])->comment('CTV, f2, kh');
            $table->string('company_name')->nullable()->comment('Chỉ có khi type = f2');
            $table->string('referral_code')->nullable()->unique()->comment('Mã giới thiệu');
            $table->uuid('sponsor_id')->nullable()->comment("ID user giới thiệu");
            $table->boolean('status')->default(true)->comment("Trạng thái hoạt động true/false");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user');
    }
}
