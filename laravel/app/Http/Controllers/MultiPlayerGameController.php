<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MultiPlayerGame;

class MultiPlayerGameController extends Controller
{
    
    public function store(Request $request)
    {
        // Validação dos dados recebidos
        $validated = $request->validate([
            'game_id' => 'required|integer',
            'user_id' => 'required|integer',
            'player_won' => 'nullable|boolean',
            'pairs_discovered' => 'nullable|integer',
        ]);
        
        
        
        $multiPlayerGame = MultiPlayerGame::create($validated);

        return response()->json([
            'message' => 'Jogo multiplayer criado com sucesso!',
            'id' => $multiPlayerGame->id,
            'multiPlayerGame' => $multiPlayerGame,
        ], 201);
    }

    public function show($id)
    {
        // Buscar o jogo multiplayer na base de dados
        $multiPlayerGame = MultiPlayerGame::find($id);

        if (!$multiPlayerGame) {
            return response()->json([
                'message' => 'Jogo multiplayer não encontrado!',
            ], 404);
        }

        return response()->json([
            'multiPlayerGame' => $multiPlayerGame,
        ]);
    }

    public function delete($id)
    {
        // Buscar o jogo multiplayer na base de dados
        $multiPlayerGame = MultiPlayerGame::find($id);

        if (!$multiPlayerGame) {
            return response()->json([
                'message' => 'Jogo multiplayer não encontrado!',
            ], 404);
        }

        $multiPlayerGame->delete();

        return response()->json([
            'message' => 'Jogo multiplayer deletado com sucesso!',
        ]);
    }

    public function update(Request $request, $gameId, $userId)
    {
        // Buscar o jogo multiplayer na base de dados
        $multiPlayerGame = MultiPlayerGame::where('game_id', $gameId)->where('user_id', $userId)->first();

        if (!$multiPlayerGame) {
            return response()->json([
                'message' => 'Jogo multiplayer não encontrado!',
            ], 404);
        }

        // Validação dos dados recebidos
        $validated = $request->validate([
            'player_won' => 'nullable|boolean',
            'pairs_discovered' => 'nullable|integer',
        ]);

        $multiPlayerGame->update($validated);

        return response()->json([
            'message' => 'Jogo multiplayer atualizado com sucesso!',
            'multiPlayerGame' => $multiPlayerGame,
        ]);
    }
}
