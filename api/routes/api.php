<?php

use Illuminate\Support\Facades\Route;

// Cleared for new project

Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'postLogin']);
Route::post('register', [\App\Http\Controllers\Api\AuthController::class, 'postRegister']);
Route::post('refresh-token', [\App\Http\Controllers\Api\AuthController::class, 'postRefreshToken']);

// Forgot Password API routes
Route::post('forgot-password/send-otp', [\App\Http\Controllers\Api\AuthController::class, 'forgotPasswordSendOtp']);
Route::get('forgot-password/verify', [\App\Http\Controllers\Api\AuthController::class, 'forgotPasswordShowVerify']);
Route::post('forgot-password/verify-otp', [\App\Http\Controllers\Api\AuthController::class, 'forgotPasswordVerifyOtp']);
Route::post('forgot-password/reset', [\App\Http\Controllers\Api\AuthController::class, 'forgotPasswordReset']);

// Public - không cần đăng nhập
Route::get('category', [\App\Http\Controllers\Api\ProductController::class, 'getCategory']);
Route::get('product',   [\App\Http\Controllers\Api\ProductController::class, 'getProduct']);

// Protected - cần đăng nhập (Bearer Token)
Route::middleware('api.jwt')->group(function () {
    Route::get('me', [\App\Http\Controllers\Api\UserController::class, 'getProfile']);
});
