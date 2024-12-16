<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
   public function index()
   {
      return UserResource::collection(User::get());
   }

   public function show(User $user)
   {
      return new UserResource($user);
   }
   

   public function showMe(Request $request)
   {
      return new UserResource($request->user());
   }

   /*public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }*/


    public function deleteUser(User $user)
    {
      $user->brain_coins_balance = 0;
      $user->deleted_at = now();
      $user->save();

      return response()->json(null, 204);
    }


   public function store(StoreUpdateUserRequest $request)
   {
      $user = new User();
      $user->fill($request->validated());

      if ($request->filled('password')) {
         $user->password = bcrypt($request->input('password'));
      }

      // $user->created_by_id = $request->user() ? $request->user()->id : null; 
      $user->save();

      return new UserResource($user);
   }


   public function update(StoreUpdateUserRequest $request, User $user)
   {
     $user->fill($request->validated());
      if ($request->hasFile('photo_url')) {
         $path = $request->file('photo_url')->store('public/photos');
         $user->photo_filename = basename($path);
         $user->save();
     }
      
      $user->save();

      return new UserResource($user);
   }


   public function blockUpdate(User $user)
   {
      $user->blocked = !$user->blocked;
      $user->save();

      return new UserResource($user);
   }


   public function updateUserPhoto(Request $request, User $user)
   {
      // Validar se a imagem foi enviada
      $request->validate([
         'photo_url' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
      ]);

      // Salvar a imagem na pasta storage/app/public/photos
      $path = $request->file('photo_url')->store('photos', 'public');

      // Atualizar o nome do arquivo no us
      $user->photo_filename = basename($path);
      $user->save();

      return new UserResource($user);
   }
}
