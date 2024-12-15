<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'board_cols',
        'board_rows'
    ];


    public function games()
    {
        return $this->belongsTo(Game::class);
    }

}
