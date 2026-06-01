<?php

namespace App\Service;

trait ApiResponseService
{
    protected $data = null;
    protected $message;
    protected $code;
    protected $errors = [];

    public function getData()
    {
        return $this->data;
    }

    public function setData($data)
    {
        $this->data = $data;
    }

    public function getMessage()
    {
        return $this->message;
    }

    public function setMessage($message)
    {
        $this->message = $message;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function setErrors($errors)
    {
        $this->errors = $errors;
    }

    public function getCode()
    {
        return $this->code;
    }

    public function setCode($code)
    {
        $this->code = $code;
    }

    public function success($data = null, $message = '')
    {
        return response()->json([
            'success' => true,
            'code' => 200,
            'message' => "Success",
            'data' => $data ?? $this->getData(),
        ]);
    }

    public function error($code = 500, $data = null, $message = '')
    {
        return response()->json([
            'success' => false,
            'code' => $code,
            'message' => $message ? $message : 'Có loi say ra',
            'data' => $data,
        ]);
    }

    public function systemError()
    {
        return response()->json([
            'success' => false,
            'code' => 500,
            'message' => "System error"
        ]);
    }

    protected function successWithPaging($total, $data, $page, $perPage)
    {
        return response()->json([
            'code' => 200,
            'success' => true,
            'pagination' => [
                'current_page' => (int) $page,
                'last_page' => (int) ceil($total/$perPage),
                'per_page' => (int) $perPage,
                'total' => (int) $total,
            ],
            'data' => $data
        ]);
    }
}
