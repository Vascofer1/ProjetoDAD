<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;

class UserController extends Controller
{
 public function showMe(Request $request)
 {
 return new UserResource($request->user());
 }

 public function show(User $user)
    {
        return new UserResource($user);
    }

    public function index()
    {
        return UserResource::collection(User::get());
    }
 
}
