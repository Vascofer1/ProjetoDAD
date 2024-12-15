<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\LeaderBoardController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/users/lol', [AuthController::class , 'lol']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', [UserController::class , 'showMe']);
    Route::put('/users/{user}', [UserController::class, 'update']);//->can('update', 'user'); 
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->can('delete', 'user');

    Route::get('/user/singleplayer', [HistoryController::class, 'singlePlayerHistory']);
    Route::get('/user/multiplayer', [HistoryController::class, 'multiPlayerHistory']);
    Route::get('/user/all', [HistoryController::class, 'allGames']);

    Route::get('/leaderboard/personal', [LeaderBoardController::class, 'personalLeaderboard']);
   });

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/leaderboard/global', [LeaderBoardController::class, 'globalLeaderboard']);




