<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Game;

class HistoryController extends Controller
{
    //

        public function singlePlayerHistory(Request $request){

            $user = auth()->user();
            $userId = $user->id;
            
            $games = DB::table('games')
                            ->where('type', "S")
                            ->where('created_user_id', $userId)
                            ->paginate(20);


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
                    ->paginate(20);

            if ($games->isEmpty()) {                    
                return response()->json(['message' => 'No games found'], 404);               
            }
            return response()->json($games);

        }


        public function allGames(Request $request)
        {

            $user = auth()->user();
            $games = Game::join('boards', 'games.board_id', '=', 'boards.id')
            ->select(
                'games.id',
                'games.winner_user_id',
                'games.created_user_id',
                'boards.board_cols',
                'boards.board_rows',
                'games.began_at',
                'games.total_time',
                'games.total_turns_winner',
                'games.type'
            )
            ->orderBy('games.id')
            ->paginate(100);


            return response()->json($games);

        }

}
