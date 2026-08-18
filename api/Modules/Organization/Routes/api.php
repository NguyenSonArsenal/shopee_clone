<?php

use Illuminate\Http\Request;
use Modules\Organization\Http\Controllers\Company\CompanyController;
use Modules\Organization\Http\Controllers\Region\RegionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->get('/organization', function (Request $request) {
    return $request->user();
});

Route::prefix('organization')->group(function() {
    Route::get('company', [CompanyController::class, 'index']);
    Route::get('company/{id}', [CompanyController::class, 'show']);
    Route::post('company', [CompanyController::class, 'store']);
    Route::match(['put', 'patch'], 'company/{id}', [CompanyController::class, 'update']);
    Route::delete('company/{id}', [CompanyController::class, 'destroy']);

    Route::get('region', [RegionController::class, 'index']);
    Route::get('region/{id}', [RegionController::class, 'show']);
    Route::post('region', [RegionController::class, 'store']);
    Route::match(['put', 'patch'], 'region/{id}', [RegionController::class, 'update']);
    Route::delete('region/{id}', [RegionController::class, 'destroy']);
});
