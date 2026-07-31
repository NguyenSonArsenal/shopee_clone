<?php

use Illuminate\Http\Request;
use Modules\Organization\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->get('/organization', function (Request $request) {
    return $request->user();
});

Route::prefix('organization')->group(function() {
    Route::get('company', [CompanyController::class, 'getList']);
    Route::get('company/{id}', [CompanyController::class, 'getDetail']);
    Route::post('company', [CompanyController::class, 'create']);
    Route::match(['put', 'patch'], 'company/{id}', [CompanyController::class, 'update']);
});
