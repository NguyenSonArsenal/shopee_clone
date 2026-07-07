<?php

namespace App\Providers;

use App\Service\Mail\MailSenderInterface;
use App\Service\Mail\Strategy\MailtrapMailSenderStrategy;
use App\View\Composers\HeaderComposer;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Khi muốn dùng Mailtrap để TEST:
        $this->app->singleton(MailSenderInterface::class, MailtrapMailSenderStrategy::class);
        // Khi muốn dùng SMTP thực tế cấu hình trong DB (khi chạy production):
//        $this->app->singleton(MailSenderInterface::class, DbSmtpMailSenderStrategy::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::composer('frontend.layout.header', HeaderComposer::class);
    }
}
