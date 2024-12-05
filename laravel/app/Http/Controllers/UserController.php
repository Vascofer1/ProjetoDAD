<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
   public function showMe(Request $request)
   {
      return new UserResource($request->user());
   }


   public function update(StoreUpdateUserRequest $request, User $user)
   {
      $user->fill($request->validated());
      $user->save();

      return new UserResource($user);
   }
}
