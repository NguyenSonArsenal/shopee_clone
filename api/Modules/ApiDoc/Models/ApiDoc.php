<?php

namespace Modules\ApiDoc\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApiDoc extends Model
{
    use SoftDeletes;

    protected $table = 'api_doc';

    protected $fillable = [
        'module', 'method', 'url', 'description', 'curl_example', 'parameters', 'response_sample',
    ];
}
