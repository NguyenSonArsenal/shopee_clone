<?php

use Illuminate\Http\Request;
use Modules\Organization\Http\Controllers\Branch\BranchController;
use Modules\Organization\Http\Controllers\Company\CompanyController;
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

    Route::get('branch', [BranchController::class, 'index']);
    Route::get('branch/{id}', [BranchController::class, 'show']);
    Route::post('branch', [BranchController::class, 'store']);
    Route::match(['put', 'patch'], 'branch/{id}', [BranchController::class, 'update']);
    Route::delete('branch/{id}', [BranchController::class, 'destroy']);
});
