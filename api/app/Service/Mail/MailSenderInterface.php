<?php

namespace App\Service\Mail;

use Illuminate\Mail\Mailable;

interface MailSenderInterface
{
    /**
     * Gửi email đồng bộ.
     *
     * @param string $to Địa chỉ nhận
     * @param Mailable $mailable Đối tượng Mail được soạn sẵn
     * @return bool
     */
    public function send(string $to, Mailable $mailable): bool;
}
