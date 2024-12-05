<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Http\Requests\StoreUpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
   public function showMe(Request $request)
   {
      return new UserResource($request->user());
   }


   public function store(StoreUpdateUserRequest $request)
   {
       $user = new User();
       $user->fill($request->validated());
      // $user->created_by_id = $request->user() ? $request->user()->id : null; 
       $user->save();

       return new UserResource($user);
   }


   public function update(StoreUpdateUserRequest $request, User $user)
   {
      /*if ($request->hasFile('photo_url')) {
         $path = $request->file('photo_url')->store('public/photos');
         $user->photo_url = basename($path); // Salva o nome do arquivo no banco
     }
 
     // Atualiza os outros campos sem sobrescrever a foto já salva
     $user->fill($request->except('photo_url')); 
     $user->save();*/
      if ($request->hasFile('input_photo_id')) {
         $path = $request->file('input_photo_id')->store('public/photos');
         $user->photo_url = basename($path);
         $user->save();
     }
      $user->fill($request->validated());
      $user->save();

      return new UserResource($user);
   }
}
