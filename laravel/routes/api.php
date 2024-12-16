<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use App\Models\User;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\LeaderBoardController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Models\Game;

Route::get('/users/lol', [AuthController::class , 'lol']);
Route::get('/transactions/lol', [TransactionController::class , 'lol']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', [UserController::class , 'showMe']);
    Route::put('/users/{user}', [UserController::class, 'update']);//->can('update', 'user'); 
    //Route::delete('/users/{user}', [UserController::class, 'destroy'])->can('delete', 'user');
    Route::get('/users', [UserController::class, 'index'])->can('view', User::class);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::patch('/users/{user}/block', [UserController::class, 'blockUpdate'])->can('block', 'user');
    Route::delete('/users/{user}/deleted', [UserController::class, 'deleteUser']);

    //transactions
    Route::post('/transactions', [TransactionController::class , 'store']);
    Route::get('/transactions', [TransactionController::class , 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']); 

    //games
    Route::post('/games', [GameController::class, 'store'])->can('access', Game::class);
    Route::put('/games/{gameId}/{boardId}', [GameController::class, 'update'])->can('access', Game::class);


    Route::get('/user/singleplayer', [HistoryController::class, 'singlePlayerHistory']);
    Route::get('/user/multiplayer', [HistoryController::class, 'multiPlayerHistory']);
    Route::get('/historico/all', [HistoryController::class, 'allGames'])->can('view', User::class); 

    Route::get('/leaderboard/personal', [LeaderBoardController::class, 'personalLeaderboard']);
   });

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/leaderboard/global', [LeaderBoardController::class, 'globalLeaderboard']);

//photo
Route::post('/users/{user}', [UserController::class, 'updateUserPhoto']);




