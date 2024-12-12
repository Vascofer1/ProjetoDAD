<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/users/lol', [AuthController::class , 'lol']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', [UserController::class , 'showMe']);
    Route::put('/users/{user}', [UserController::class, 'update']);//->can('update', 'user'); 
    Route::get('/users', [UserController::class, 'index'])->can('view', User::class);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::patch('/users/{user}/block', [UserController::class, 'blockUpdate'])->can('block', 'user');
    Route::patch('/users/{user}/deleted', [UserController::class, 'deleteUser']);
   });

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/users', [UserController::class, 'store']);

