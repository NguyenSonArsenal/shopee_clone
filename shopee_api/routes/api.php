<?php

use Illuminate\Support\Facades\Route;

// Cleared for new project

Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'postLogin']);
Route::post('register', [\App\Http\Controllers\Api\AuthController::class, 'postRegister']);

// Public - không cần đăng nhập
Route::get('category', [\App\Http\Controllers\Api\ProductController::class, 'getCategory']);
Route::get('product',   [\App\Http\Controllers\Api\ProductController::class, 'getProduct']);
