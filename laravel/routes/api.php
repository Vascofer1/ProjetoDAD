<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/users/lol', [AuthController::class , 'lol']);
Route::get('/transactions/lol', [TransactionController::class , 'lol']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', [UserController::class , 'showMe']);
    Route::put('/users/{user}', [UserController::class, 'update']);//->can('update', 'user'); 
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->can('delete', 'user');


    //transactions
    Route::post('/transactions', [TransactionController::class , 'store']);
    Route::get('/transactions', [TransactionController::class , 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']); 
   });

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/users', [UserController::class, 'store']);

