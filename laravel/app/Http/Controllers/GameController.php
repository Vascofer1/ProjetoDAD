<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameResource;
use Illuminate\Http\Request;
use App\Models\Game;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{

    public function index()
    {
        return GameResource::collection(Game::get());
    }

    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $validated = $request->validate([
            'created_user_id' => 'required|integer',
            'winner_user_id' => 'nullable|integer',
            'type' => 'required|in:S,M',
            'status' => 'required|in:PE,PL,E,I',
            'began_at' => 'nullable|date',
            'ended_at' => 'nullable|date',
            'total_time' => 'nullable|numeric',
            'board_id' => 'required|integer',
            'total_turns_winner' => 'nullable|integer',
        ]);



        $game = Game::create($validated);

        return response()->json([
            'message' => 'Jogo criado com sucesso!',
            'id' => $game->id,
            'game' => $game,
        ], 201);
    }

    public function show($id)
    {
        // Buscar o jogo na base de dados
        $game = Game::find($id);

        if (!$game) {
            return response()->json([
                'message' => 'Jogo não encontrado!',
            ], 404);
        }

        return response()->json([
            'game' => $game,
        ]);
    }

    public function delete($id)
    {
        // Buscar o jogo na base de dados
        $game = Game::find($id);

        if (!$game) {
            return response()->json([
                'message' => 'Jogo não encontrado!',
            ], 404);
        }

        // Deletar o jogo na base de dados
        $game->delete();

        return response()->json([
            'message' => 'Jogo deletado com sucesso!',
        ]);
    }

    public function update(Request $request, $gameId)
    {
        // Buscar o jogo na base de dados
        $game = Game::find($gameId);

        if (!$game) {
            return response()->json([
                'message' => 'Jogo não encontrado!',
            ], 404);
        }

        // Validação dos dados recebidos
        $validated = $request->validate([
            'created_user_id' => 'integer',
            'winner_user_id' => 'integer',
            'type' => 'in:S,M',
            'status' => 'in:PE,PL,E,I',
            'began_at' => 'date',
            'ended_at' => 'date',
            'total_time' => 'numeric',
            'board_id' => 'integer',
            'total_turns_winner' => 'integer',
        ]);

        // Atualizar o jogo na base de dados
        $game->update($validated);


        $game->save();

        return response()->json([
            'message' => 'Jogo atualizado com sucesso!',
            'game' => $game,
        ]);
    }
}
