<?php

namespace App\Http\Resources\Api\Auth;

use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'access_token'  => $this['access_token'],
            'refresh_token' => $this['refresh_token'],
            'user'          => [
                'email'    => $this['user']->email,
                'username' => $this['user']->username,
                'full_name' => $this['user']->full_name,
                'gender'   => $this['user']->gender?->label(),
            ],
        ];
    }
}
