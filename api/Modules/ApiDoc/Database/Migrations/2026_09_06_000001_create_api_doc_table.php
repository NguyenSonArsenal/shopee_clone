<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('api_doc', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('module', 100)->index();
            $table->string('method', 10);
            $table->string('url', 255);
            $table->string('description', 255)->nullable();
            $table->text('curl_example')->nullable();
            $table->text('parameters')->nullable();
            $table->text('response_sample')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Seed sẵn 2 API mẫu từ AuthController để FE có dữ liệu ngay khi cài mới
        DB::table('api_doc')->insert([
            [
                'module' => 'Auth',
                'method' => 'POST',
                'url' => 'login',
                'description' => 'Đăng nhập, cấp access token + refresh token (JWT)',
                'curl_example' => "curl -X POST {{host}}/api/login \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"email\":\"user@example.com\",\"password\":\"123456\"}'",
                'parameters' => "email (string, required): Email tài khoản\npassword (string, required): Mật khẩu",
                'response_sample' => <<<'JSON'
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
      "email": "user@example.com",
      "username": "user01",
      "full_name": "Nguyen Van A",
      "gender": "Nam"
    }
  }
}
JSON,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module' => 'Auth',
                'method' => 'POST',
                'url' => 'register',
                'description' => 'Đăng ký tài khoản mới',
                'curl_example' => "curl -X POST {{host}}/api/register \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"full_name\":\"Nguyen Van A\",\"phone\":\"0912345678\",\"email\":\"user@example.com\",\"password\":\"Abc@12345\",\"password_confirmation\":\"Abc@12345\",\"type\":\"f1\",\"gender\":1}'",
                'parameters' => "full_name (string, required): Họ và tên\nphone (string, required): Số điện thoại (duy nhất)\nemail (string, required): Email (duy nhất)\npassword (string, required): Mật khẩu\npassword_confirmation (string, required): Xác nhận mật khẩu\ntype (string, required): Vai trò (f1|f2...)\ncompany_name (string, required_if type=f2): Tên công ty\nref_code (string, optional): Mã giới thiệu\ngender (integer, required): Giới tính (1|2)",
                'response_sample' => <<<'JSON'
{
  "success": true,
  "message": "Đăng ký tài khoản thành công!",
  "data": {
    "id": 1,
    "username": "user01"
  }
}
JSON,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('api_doc');
    }
};
