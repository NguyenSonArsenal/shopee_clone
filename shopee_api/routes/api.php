<?php

use Illuminate\Support\Facades\Route;

// Cleared for new project

Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'postLogin']);
Route::post('register', [\App\Http\Controllers\Api\AuthController::class, 'postRegister']);
