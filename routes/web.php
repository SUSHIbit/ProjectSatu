<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Main Application Route - serves the React SPA
Route::get('/{any?}', [AppController::class, 'index'])
    ->where('any', '^(?!api|admin).*$')
    ->name('app');

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminController::class, 'loginForm'])->name('login');
    Route::post('/login', [AdminController::class, 'login']);
    
    // Protected Admin Routes
    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/{any?}', [AdminController::class, 'index'])
            ->where('any', '.*')
            ->name('admin.dashboard');
    });
});