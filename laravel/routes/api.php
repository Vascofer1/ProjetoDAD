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
use App\Http\Controllers\MultiPlayerGameController;
use App\Models\Game;

Route::get('/users/lol', [AuthController::class , 'lol']);
Route::get('/transactions/lol', [TransactionController::class , 'lol']);
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    Route::get('/users/me', [UserController::class , 'showMe']);
    Route::put('/users/{user}', [UserController::class, 'update'])->can('update', 'user'); 
    //Route::delete('/users/{user}', [UserController::class, 'destroy'])->can('delete', 'user');
    Route::get('/users', [UserController::class, 'index'])->can('view', User::class);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::patch('/users/{user}/block', [UserController::class, 'blockUpdate'])->can('block', 'user');
    Route::delete('/users/{user}/deleted', [UserController::class, 'deleteUser'])->can('delete', 'user');

    //transactions
    Route::post('/transactions', [TransactionController::class , 'store']);
    Route::get('/transactions', [TransactionController::class , 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']); 

    //games
    Route::post('/games', [GameController::class, 'store']);
    Route::put('/games/{gameId}/{boardId}', [GameController::class, 'update']);
    Route::put('/games/{gameId}/{boardId}/{rows}/{columns}', [GameController::class, 'update']);
    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/games-per-month', [GameController::class, 'gamesPerMonth']);
    Route::get('/games/last-week', [GameController::class, 'gamesLastWeek']);
    Route::get('/games/last-month', [GameController::class, 'gamesLastMonth']);
    Route::get('/games/per-type', [GameController::class, 'gamesPerType']);


    Route::get('/historico/singleplayer', [HistoryController::class, 'singlePlayerHistory'])->can('notAdmin', User::class); 
    Route::get('/historico/multiplayer', [HistoryController::class, 'multiPlayerHistory'])->can('notAdmin', User::class); 
    Route::get('/historico/all', [HistoryController::class, 'allGames'])->can('view', User::class); 

    Route::get('/leaderboard/personal', [LeaderBoardController::class, 'personalLeaderboard'])->can('notAdmin', User::class); 
    //multiplayer games
    /* Route::post('/multiplayergames', [MultiPlayerGameController::class, 'store']);
    Route::put('/multiplayergames/{gameId}/{userId}', [MultiPlayerGameController::class, 'update']);
 */
   });
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/leaderboard/global', [LeaderBoardController::class, 'globalLeaderboard']);

//photo
Route::post('/users/{user}', [UserController::class, 'updateUserPhoto']);

//transactions
Route::post('/transactions/B', [TransactionController::class , 'storeTypeB']);




