<?php

namespace App\Service\Mail\Strategy;

use App\Service\Mail\MailSenderInterface;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DbSmtpMailSenderStrategy implements MailSenderInterface
{
    public function send(string $to, Mailable $mailable): bool
    {
        if (empty($to)) {
            Log::warning('[DbSmtpMailSender] Email nhận trống.');
            return false;
        }

        // return // @todo add cconfig

        // Tự động load cấu hình SMTP từ database của anh
//        $smtpReady = SmtpConfigService::apply();
//
//        if (!$smtpReady) {
//            Log::warning("[DbSmtpMailSender STUB] SMTP chưa được cấu hình. Gửi tới: {$to}");
//            return false;
//        }
//
//        try {
//            // Gửi đồng bộ trực tiếp không qua Queue
//            Mail::to($to)->send($mailable);
//
//            Log::info("[DbSmtpMailSender] Gửi mail thành công", [
//                'to' => $to,
//                'mailable' => get_class($mailable)
//            ]);
//            return true;
//        } catch (\Throwable $e) {
//            Log::error("[DbSmtpMailSender ERROR] " . $e->getMessage(), [
//                'to' => $to,
//                'mailable' => get_class($mailable)
//            ]);
//            return false;
//        }
    }
}
