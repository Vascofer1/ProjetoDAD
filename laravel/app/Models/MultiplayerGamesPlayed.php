<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MultiplayerGamesPlayed extends Model
{
    //
    use HasFactory;

    protected $table = 'multiplayer_games_played';

    protected $fillable = [
        'id',
        'user_id',
        'player_won',
        'pairs_discovered'
    ];

    public function game()
    {
        return $this->belongsTo(Game::class, 'game_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}
