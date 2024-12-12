<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
 return [
    'id' => $this->id,
    'name' => $this->name,
    'nickname' => $this->nickname,
    'email' => $this->email,
    'type' => $this->type,
    'photoFileName' => $this->photo_url ? '/storage/photos/' . $this->photo_url : null,
    'blocked' => $this->blocked ? true : false,
    'deleted_at' => $this->deleted_at,
 ];
}
}
