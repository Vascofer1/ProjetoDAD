<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GameController extends Controller
{
    //
}

function generateCards()
{
    $cards = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    $cards = array_merge($cards, $cards); // Duplicar para pares
    shuffle($cards); // Misturar as cartas

    return response()->json($cards);
}

