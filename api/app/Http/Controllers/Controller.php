<?php

namespace App\Http\Controllers;

use App\Service\ApiResponseService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

/**
 * @OA\Info(title="Shopee Clone API", version="1.0.0")
 * @OA\Tag(name="Auth", description="Đăng nhập, đăng ký, quên mật khẩu")
 * @OA\Tag(name="Organization / Company", description="Quản lý công ty")
 * @OA\Tag(name="Organization / Branch", description="Quản lý chi nhánh")
 * @OA\Tag(name="Settings / Config", description="Cấu hình hệ thống")
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
    use ApiResponseService;

    public function showFileLog($file, $ext)
    {
        $fullName = "{$file}.{$ext}";
        return showLogOnWeb($fullName);
    }

    public function listFileLog()
    {
        $logPath = storage_path('logs');
        $files = File::files($logPath);

        $logFiles = collect($files)->filter(function ($file) {
            return Str::endsWith($file->getFilename(), ['.log', '.txt']);
        })->map(function ($file) {
            return $file->getFilename();
        });

        return view('frontend.log.log', compact('logFiles'));
    }
}
