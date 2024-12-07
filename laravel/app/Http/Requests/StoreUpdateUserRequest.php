<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Obter o ID do usuário da rota, se disponível (apenas para updates)
        $userId = $this->route('user') ? $this->route('user')->id : null;

        return [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $userId,
            'nickname' => 'required|string|max:50|unique:users,nickname,' . $userId,
            'photo_url' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => $userId ? 'nullable|string|min:3|confirmed' : 'required|string|min:3|confirmed',
            /*
            
            
            
            'type' => $this->type === 'A' ? 'Administrator' : 'Player',
            ,*/
        ];
    }
}
