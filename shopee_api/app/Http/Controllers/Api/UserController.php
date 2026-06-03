<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\User\ProfileResource;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function getProfile()
    {
        try {
            $user = request()->user();
            return $this->success(new ProfileResource($user));
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
