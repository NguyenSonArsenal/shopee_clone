<?php

use Illuminate\Support\Facades\Route;
use Modules\ApiDoc\Http\Controllers\ApiDocController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('api-doc', [ApiDocController::class, 'index']);
Route::get('api-doc/{id}', [ApiDocController::class, 'show']);
Route::post('api-doc', [ApiDocController::class, 'store']);
Route::put('api-doc/{id}', [ApiDocController::class, 'update']);
Route::delete('api-doc/{id}', [ApiDocController::class, 'destroy']);
