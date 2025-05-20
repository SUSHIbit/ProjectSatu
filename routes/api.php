<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GenreController;
use App\Http\Controllers\API\SongController;
use App\Http\Controllers\API\WallpaperController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::get('/songs', [SongController::class, 'index']);
Route::get('/genres', [GenreController::class, 'index']);
Route::get('/songs/{song}', [SongController::class, 'show']);

// Supabase User Auth Sync
Route::post('/auth/sync-user', [AuthController::class, 'syncSupabaseUser']);

// Admin Authentication
Route::post('/admin/login', [AuthController::class, 'login']);

// Protected Admin Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/user', [AuthController::class, 'user']);
    
    // Resources requiring admin authentication
    Route::apiResource('admin/songs', SongController::class)->except(['index', 'show']);
    Route::apiResource('admin/wallpapers', WallpaperController::class);
    Route::apiResource('admin/genres', GenreController::class)->except(['index']);
});

