<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Game extends Model
{
    use HasFactory;

    protected $table = 'games';
    
    protected $fillable = [
        'id',
        'created_user_id',
        'winner_user_id',
        'type',
        'status',
        'began_at',
        'ended_at',
        'total_time',
        'board_id',
        'total_turns_winner',
    ];

    public function boards()
    {
        return $this->hasMany(Board::class);
    }
        
    public function multiplayerGamesPlayed()
{
    return $this->hasMany(MultiplayerGamesPlayed::class, 'game_id', 'id');
}
        

}
