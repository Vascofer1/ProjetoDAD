<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Http\Requests\TransactionRequest;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
   public function index(Request $request)
    {
        // Obtém o usuário autenticado
        $user = $request->user();

        if($user->type == 'A')
        {
            return TransactionResource::collection(Transaction::get());
        }

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Retorna todas as transações do usuário autenticado
        $transactions = Transaction::where('user_id', $user->id)->get();

        return TransactionResource::collection($transactions);
    }

    public function store(TransactionRequest $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $transaction = new Transaction();
        $transaction->fill($request->validated());
        $transaction->user_id = $user->id;

        $transaction->brain_coins = $request->input('euros') * 10;

        $transaction->transaction_datetime = now(); // ou date('Y-m-d H:i:s')

        $transaction->save();

        $user->brain_coins_balance = ($user->brain_coins_balance ?? 0) + $transaction->brain_coins;
        $user->save();

        return new TransactionResource($transaction);
    }

    public function show(Transaction $transaction, Request $request)
    {
        // Obtém o usuário autenticado
        $user = $request->user();

        if($user->type == 'A')
        {
            return new TransactionResource($transaction);
        }

        if (!$user || $transaction->user_id != $user->id) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        return new TransactionResource($transaction);
    }

    public function lol()
    {
        
        return DB::select('select * from transactions');
    }
}
