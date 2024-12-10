<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderBoardController extends Controller
{

    public function globalLeaderboard(Request $request)
    {
        
        $bestTimes = DB::table('games')
        ->select(DB::raw('MIN(total_time) as best_time'),'board_id')
        ->where('games.type', "S")
        ->groupBy('board_id')
        ->get();

        
        $minimumTurns = DB::table('games')
        ->select(DB::raw('MIN(total_turns_winner) as least_moves'), 'board_id')
        ->where('games.type', 'S')
        ->groupBy('board_id')
        ->get();
        

        $top5Players = DB::table('multiplayer_games_played')
            ->select(DB::raw('COUNT(*) as total_wins'))
            ->where('player_won', 1)
            ->groupBy('user_id')
            ->orderByDesc('total_wins')
            ->limit(5)
            ->get();


        return response()->json([$bestTimes, $minimumTurns]);
    }
    
}
