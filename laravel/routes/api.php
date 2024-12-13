<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;

Route::get('/users/lol', [AuthController::class , 'lol']);
Route::get('/transactions/lol', [TransactionController::class , 'lol']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', [UserController::class , 'showMe']);
    Route::put('/users/{user}', [UserController::class, 'update']);//->can('update', 'user'); 
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->can('delete', 'user');
    Route::get('/users', [UserController::class, 'index'])->can('view', User::class);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::patch('/users/{user}/block', [UserController::class, 'blockUpdate'])->can('block', 'user');
    Route::patch('/users/{user}/deleted', [UserController::class, 'deleteUser']);

    //transactions
    Route::post('/transactions', [TransactionController::class , 'store']);
    Route::get('/transactions', [TransactionController::class , 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']); 

    //games
    Route::post('/games', [GameController::class, 'store'])->can('access', Game::class);
    Route::put('/games/{gameId}/{boardId}', [GameController::class, 'update'])->can('access', Game::class);

   });

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/users', [UserController::class, 'store']);

