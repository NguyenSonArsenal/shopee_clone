<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\DailyWorkController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MonthlyController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\SettingsController;

Route::get('/', function () { return redirect('/staff-shift-kpi/login'); });

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
