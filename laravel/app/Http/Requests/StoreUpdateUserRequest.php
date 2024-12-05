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
        return [
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $this->user->id,
            'nickname' => 'required|string|max:50|unique:users,nickname,' . $this->user->id,
            'photoUrl' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            /*
            
            
            
            'type' => $this->type === 'A' ? 'Administrator' : 'Player',
            'password' => 'nullable|string|min:3|confirmed',*/
        ];
    }
}
