<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->integer('category_id');
            $table->string('name', 255);
            $table->string('slug', 280)->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 15, 2);
            $table->decimal('price_sale', 15, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('thumbnail')->nullable();
            $table->integer('sold')->default(0);
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->tinyInteger('status')->unsigned()->default(1)->comment('1 active, 2 inactive');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
