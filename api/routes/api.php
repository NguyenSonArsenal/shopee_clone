<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Api\AuthController;

// Cleared for new project
Route::post('login', [AuthController::class, 'postLogin']);
Route::post('register', [AuthController::class, 'postRegister']);
Route::post('refresh-token', [AuthController::class, 'postRefreshToken']);

// Forgot Password API routes
Route::post('forgot-password/send-otp', [AuthController::class, 'forgotPasswordSendOtp']);
Route::get('forgot-password/verify', [AuthController::class, 'forgotPasswordShowVerify']);
Route::post('forgot-password/verify-otp', [AuthController::class, 'forgotPasswordVerifyOtp']);
Route::post('forgot-password/reset', [AuthController::class, 'forgotPasswordReset']);

// Public - không cần đăng nhập
Route::get('category', [ProductController::class, 'getCategory']);
Route::get('product',   [ProductController::class, 'getProduct']);

// Protected - cần đăng nhập (Bearer Token)
Route::middleware('api.jwt')->group(function () {
    Route::get('me', [UserController::class, 'getProfile']);
});
