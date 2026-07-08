<?php

namespace App\Service;

trait ApiResponseService
{
    public function success($data = null, string $message = 'Thành công', int $code = 200)
    {
        return response()->json([
            'success' => true,
            'code'    => $code,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    public function error(string $message = 'Lỗi', int $code = 500, $errors = null)
    {
        $payload = [
            'success' => false,
            'code'    => $code,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $code);
    }

    public function systemError(string $message = 'Lỗi hệ thống')
    {
        return $this->error($message, 500);
    }

    protected function successWithPaging($total, $data, $page, $perPage, string $message = 'Thành công', int $code = 200)
    {
        return response()->json([
            'success' => true,
            'code'    => $code,
            'message' => $message,
            'pagination' => [
                'current_page' => (int) $page,
                'last_page' => (int) ceil($total / $perPage),
                'per_page' => (int) $perPage,
                'total' => (int) $total,
            ],
            'data' => $data,
        ], $code);
    }
}
