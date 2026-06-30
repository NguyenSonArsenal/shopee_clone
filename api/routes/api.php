<?php

use Illuminate\Support\Facades\Route;

// Cleared for new project

Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'postLogin']);
Route::post('register', [\App\Http\Controllers\Api\AuthController::class, 'postRegister']);
Route::post('refresh-token', [\App\Http\Controllers\Api\AuthController::class, 'postRefreshToken']);

// Public - không cần đăng nhập
Route::get('category', [\App\Http\Controllers\Api\ProductController::class, 'getCategory']);
Route::get('product',   [\App\Http\Controllers\Api\ProductController::class, 'getProduct']);

// Protected - cần đăng nhập (Bearer Token)
Route::middleware('api.jwt')->group(function () {
    Route::get('me', [\App\Http\Controllers\Api\UserController::class, 'getProfile']);
});
