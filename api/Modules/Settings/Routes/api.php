<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\Settings\Http\Controllers\ConfigController;

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

Route::middleware('auth:api')->get('/settings', function (Request $request) {
    return $request->user();
});

Route::prefix('settings')->group(function () {
    Route::get('config', [ConfigController::class, 'index']);
    Route::put('config', [ConfigController::class, 'update']);
});