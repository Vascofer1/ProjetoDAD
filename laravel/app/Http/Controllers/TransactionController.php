<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Models\User;
use App\Http\Requests\TransactionRequest;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Base query
        $query = Transaction::query();

        // Filtrar por usuário, exceto se for administrador
        if ($user->type !== 'A') {
            $query->where('user_id', $user->id);
        }

        // Aplicar filtros
        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('id')) {
            $query->where('id', $request->input('id'));
        }

        if ($request->has('date_after')) {
            $query->whereDate('transaction_datetime', '>=', $request->input('date_after'));
        }

        if ($request->has('date_before')) {
            $query->whereDate('transaction_datetime', '<=', $request->input('date_before'));
        }

        // Paginação
        $transactions = $query->paginate(30);

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

        if($transaction->type == 'P'){
            $transaction->brain_coins = $request->input('euros') * 10;
        }
        
        $transaction->transaction_datetime = now(); // ou date('Y-m-d H:i:s')

        $transaction->save();

        $user->brain_coins_balance = ($user->brain_coins_balance ?? 0) + $transaction->brain_coins;
        $user->save();

        return new TransactionResource($transaction);
    }


    public function storeTypeB(TransactionRequest $request)
    {
        $userId = $request->input('user_id');

        if (!$userId) {
            return response()->json(['error' => 'User ID is required'], 400);
        }

        $transaction = new Transaction();
        $transaction->fill($request->validated());

        $user = User::find($userId);
        if (!$user) {
            return response()->json(['error' => 'User not found for the given transaction'], 404);
        }
        
        $transaction->user_id = $user->id;
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
