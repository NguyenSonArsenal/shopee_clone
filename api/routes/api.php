<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Api\AuthController;

// Cleared for new project
Route::post('login', [AuthController::class, 'postLogin']);
Route::post('register', [AuthController::class, 'postRegister']);
Route::post('refresh-token', [AuthController::class, 'postRefreshToken']);

Route::controller(AuthController::class)->prefix('forgot-password')->group(function () {
    Route::post('send-otp', 'forgotPasswordSendOtp');
    Route::get('verify', 'forgotPasswordShowVerify');
    Route::post('verify-otp', 'forgotPasswordVerifyOtp');
    Route::post('reset', 'forgotPasswordReset');
});

// Public - không cần đăng nhập
Route::get('category', [ProductController::class, 'getCategory']);
Route::get('product',   [ProductController::class, 'getProduct']);

// Protected - cần đăng nhập (Bearer Token)
Route::middleware('api.jwt')->group(function () {
    Route::get('me', [UserController::class, 'getProfile']);
});
