<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
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
            'type' => 'required|in:B,P,I',
            //'transaction_datetime' => 'required|date',
            //'user_id' => 'required|exists:users,id',
            'game_id' => $this->input('type') === 'I' ? 'required|exists:games,id' : 'nullable|exists:games,id',
            'euros' => $this->input('type') === 'P' ? 'required|numeric|min:0' : 'nullable|numeric|min:0',
            'brain_coins' => $this->input('type') === 'I' ? 'required|integer': 'nullable|integer',
            'payment_type' => $this->input('type') === 'P' ? 'required|in:MBWAY,PAYPAL,IBAN,MB,VISA' : 'nullable|in:MBWAY,PAYPAL,IBAN,MB,VISA',
            'payment_reference' => $this->input('type') === 'P' ? 'required|string|max:255' : 'nullable|string|max:255',
        ];
    }
}
