<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;


    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'transaction_datetime',
        'user_id',
        'game_id',
        'euros',
        'payment_type',
        'payment_reference',
        'brain_coins',
    ];


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'transaction_datetime' => 'datetime',
        //'custom' => 'array',
    ];

    // Relacionamento com o User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relacionamento com o Game
    /*public function game()
    {
        return $this->belongsTo(Game::class);
    }*/
}
