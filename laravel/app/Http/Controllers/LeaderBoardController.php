<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Game;
use App\Models\MultiplayerGamesPlayed;

class LeaderBoardController extends Controller
{

    public function globalLeaderboard(Request $request)
    {

        //Melhor jogo por tempo e moves
        $singleplayerLeaderboard = Game::where('games.type', 'S') 
        ->join('boards', 'games.board_id', '=', 'boards.id')
        ->join('users', 'games.created_user_id', '=', 'users.id')
        ->selectRaw('
            boards.board_cols,
            boards.board_rows,
            MIN(games.total_time) as best_time,
            MIN(games.total_turns_winner) as minimum_turns,
            SUBSTRING_INDEX(GROUP_CONCAT(users.nickname ORDER BY games.total_time ASC), ",", 1) as best_time_player,
            SUBSTRING_INDEX(GROUP_CONCAT(users.nickname ORDER BY games.total_turns_winner ASC), ",", 1) as min_turns_player
        ')
        ->groupBy('boards.board_cols', 'boards.board_rows') 
        ->get();

        
        $multiplayerLeaderboard = MultiplayerGamesPlayed::selectRaw('
            user_id,
            COUNT(CASE WHEN player_won = 1 THEN 1 END) as total_victories,
            COUNT(CASE WHEN player_won = 0 THEN 1 END) as total_losses
        ')
        ->groupBy('user_id')
        ->orderByDesc('total_victories') // Sort by total victories descending
        ->take(5) // Top 5 players
        ->with('user') // Eager load user information if needed
        ->get();

        return response()->json([
            'single_player' => $singleplayerLeaderboard->map(function ($board) {
                return [
                    'board_cols' => $board->board_cols,
                    'board_rows' => $board->board_rows,
                    'best_time' => $board->best_time,
                    'minimum_turns' => $board->minimum_turns,
                    'best_time_player' => $board->best_time_player,
                    'minimum_turns_player' => $board->min_turns_player
                ];
            }),
            'multiplayer' => $multiplayerLeaderboard->map(function ($player) {
                return [
                    'user_id' => $player->user->nickname,
                    'total_victories' => $player->total_victories,
                ];
            }),
        ]);
    }
    

    public function personalLeaderboard(Request $request)
    {

        $user = auth()->user();
        $userId = $user->id;

        // Single-player games: Best time and minimum turns for each board size
        $singlePlayerStats = DB::table('games')
            ->join('boards', 'games.board_id', '=', 'boards.id')
            ->select(
                'boards.board_cols',
                'boards.board_rows',
                DB::raw('MIN(games.total_time) as best_time'),
                DB::raw('MIN(games.total_turns_winner) as min_turns'),
            )
            ->where('games.type', 'S') // Single-player games
            ->where('games.created_user_id', $userId)
            ->groupBy('boards.board_cols', 'boards.board_rows')
            ->get();



        // Multiplayer games: Total victories and losses
        $multiPlayerStats = DB::table('multiplayer_games_played')
        ->select(
            DB::raw('SUM(CASE WHEN player_won = 1 THEN 1 ELSE 0 END) as total_victories'),
            DB::raw('SUM(CASE WHEN player_won = 0 THEN 1 ELSE 0 END) as total_losses')
        )   
        ->where('user_id', $userId)
        ->first();



        return response()->json([
            'single_player' => $singlePlayerStats,
            'multiplayer' => $multiPlayerStats
        ]);
    }


}
