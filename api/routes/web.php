<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Controller;

Route::get('dk-log', [Controller::class, 'listFileLog']);
Route::get('dk-log/{filename}/{ext}', [Controller::class, 'showFileLog'])->name('dk-log.show');

// Spec JSON gốc từ l5-swagger + thêm x-tagGroups để ReDoc vẽ được cây phân cấp Organization > Company/Region
Route::get('api/redoc-spec', function () {
    $spec = json_decode(file_get_contents(storage_path('api-docs/api-docs.json')), true);

    $spec['x-tagGroups'] = [
        ['name' => 'Auth', 'tags' => ['Auth']],
        ['name' => 'Organization', 'tags' => ['Organization / Company', 'Organization / Region']],
    ];

    return response()->json($spec);
});

Route::get('api/redoc', function () {
    return view('redoc');
});


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
