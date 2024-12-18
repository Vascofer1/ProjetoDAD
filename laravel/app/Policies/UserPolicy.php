<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Create a new policy instance.
     */
    public function before(User $user, string $ability): bool|null 
    { 
        /*if ($user->type == 'A') { 
            return true; 
        } */
        return null; 
    } 
 
    public function viewAny(?User $user): bool 
    { 
        return true; 
    } 


    public function view(User $user): bool 
    {
         
        if ($user->type == 'A') {
            return true;
        }
        return null;
    } 

    public function notAdmin(User $user): bool 
    { 
        if (!($user->type == 'A')) {
            return true;
        }
        return null; 
    }
    
 
    public function create(User $user): bool 
    { 
        return true; 
    } 
 
    public function update(User $authUser, User $user): bool 
    { 
        return $authUser->id === $user->id || $authUser->isAdmin();
    } 
 
    public function delete(User $user): bool 
    { 
        if ($user->type == 'A') { 
            return false; 
        } 
        return true; 
    }


    public function block(User $authUser, User $user): bool 
    { 
        return $authUser->id !== $user->id && $authUser->type == 'A' && $user->type == 'P';
    }
}