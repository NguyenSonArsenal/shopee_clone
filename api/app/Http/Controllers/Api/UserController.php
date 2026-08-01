<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\User\ProfileResource;
use App\Models\User;
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

    /**
     * GET /api/user
     * Danh sách rút gọn user, phục vụ dropdown chọn người đại diện/quản lý
     */
    public function getList()
    {
        try {
            $users = User::query()->select('id', 'full_name', 'email')->get();

            return $this->success($users);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
