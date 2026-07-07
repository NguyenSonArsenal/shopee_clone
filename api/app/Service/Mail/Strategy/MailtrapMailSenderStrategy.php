<?php

namespace App\Service\Mail\Strategy;

use App\Service\Mail\MailSenderInterface;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailtrapMailSenderStrategy implements MailSenderInterface
{
    public function send(string $to, Mailable $mailable): bool
    {
        if (empty($to)) {
            Log::warning('[MailtrapMailSender] Email nhận trống.');
            return false;
        }

        try {
            // Áp cấu hình Mailtrap Sandbox trực tiếp vào runtime
            Config::set('mail.mailers.smtp.host', 'sandbox.smtp.mailtrap.io');
            Config::set('mail.mailers.smtp.port', 2525);
            Config::set('mail.mailers.smtp.username', getConfig('mail.mailtrap.username'));
            Config::set('mail.mailers.smtp.password', getConfig('mail.mailtrap.password'));
            Config::set('mail.mailers.smtp.encryption', 'tls');

            // Thông tin người gửi (from) mặc định khi test Mailtrap
            Config::set('mail.from.address', 'no-reply@banghang.net');
            Config::set('mail.from.name', 'Mailtrap Testing');
            Config::set('mail.default', 'smtp');

            // Gửi đồng bộ trực tiếp qua Mailtrap
            Mail::to($to)->send($mailable);

            Log::info("[MailtrapMailSender] Gửi mail qua Mailtrap thành công", [
                'to' => $to,
                'mailable' => get_class($mailable)
            ]);
            return true;
        } catch (\Throwable $e) {
            Log::error("[MailtrapMailSender ERROR] " . $e->getMessage(), [
                'to' => $to,
                'mailable' => get_class($mailable)
            ]);
            return false;
        }
    }
}
