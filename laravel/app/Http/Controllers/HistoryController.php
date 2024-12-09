<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class HistoryController extends Controller
{
    //

        public function singlePlayerHistory(Request $request){

            $user = auth()->user();
            $userId = $user->id;
            
            $games = DB::table('games')
                            ->where('type', "S")
                            ->where('created_user_id', $userId)
                            ->get();


            if ($games->isEmpty()) {
                return response()->json(['message' => 'No games found'], 404);               
            }
            return response()->json($games);

        }


        public function multiPlayerHistory(Request $request)
        {
            $user = auth()->user();
            $userId = $user->id;

            $games = DB::table('games')
                    ->join('multiplayer_games_played', 'games.id', "=", "multiplayer_games_played.game_id")
                    ->where('type', "M")
                    ->where('user_id', $userId)
                    ->whereNotNull('winner_user_id')
                    ->select('winner_user_id', 'created_user_id', 'board_id', 'began_at', 'total_time', 'total_turns_winner')
                    ->get();

            if ($games->isEmpty()) {                    
                return response()->json(['message' => 'No games found'], 404);               
            }
            return response()->json($games);

        }
}
