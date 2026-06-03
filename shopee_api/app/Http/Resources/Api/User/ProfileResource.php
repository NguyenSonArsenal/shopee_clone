<?php

namespace App\Http\Resources\Api\User;

use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'username'   => $this->username,
            'full_name'  => $this->full_name,
            'email'      => $this->email,
            'phone'      => $this->phone,
            'gender'     => $this->gender,
            'birthday'   => $this->birthday,
            'avatar'     => $this->avatar,
            'status'     => $this->status,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
