<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

Route::get('dk-log', [Controller::class, 'listFileLog']);
Route::get('dk-log/{filename}/{ext}', [Controller::class, 'showFileLog'])->name('dk-log.show');


Route::get('/test-send-mail', function () {
    $to = request('to', 'test@example.com');
    try {
        \Illuminate\Support\Facades\Mail::raw('Hi, this is a test email from banghang.net!', function ($message) use ($to) {
            $message->to($to)
                ->subject('Test Email from banghang.net');
        });
        return 'Email sent successfully to ' . $to . '!';
    } catch (\Exception $e) {
        return 'Error sending email: ' . $e->getMessage();
    }
});
