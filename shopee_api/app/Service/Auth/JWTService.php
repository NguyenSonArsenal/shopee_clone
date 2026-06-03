<?php

namespace App\Service\Auth;

class JWTService
{
//    const EXP = 1800;
    private function base64UrlEncode(string $data)
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private function base64UrlDecode(string $data)
    {
        $base64 = str_replace(['-', '_'], ['+', '/'], $data);
        $padding = strlen($base64) % 4;
        if ($padding) {
            $base64 .= str_repeat('=', 4 - $padding);
        }
        return base64_decode($base64);
    }

    /**
     * Tạo JWT Token từ Payload
     */
    public function generateToken($payload, $expireSeconds = 1800)
    {
        $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);

        $payload['exp'] = time() + $expireSeconds;
        $payload = json_encode($payload);

        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode($payload);

        $secret = config('app.key');
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Giải mã và kiểm tra Token
     * $token: string
     */
    public function decodeToken($token)
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;

        $secret = config('app.key');
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);

        if (!hash_equals($this->base64UrlEncode($signature), $base64UrlSignature)) {
            return null; // Token bị sửa đổi trái phép!
        }

        $payload = json_decode($this->base64UrlDecode($base64UrlPayload), true);

        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Token đã hết hạn!
        }

        return $payload;
    }
}
