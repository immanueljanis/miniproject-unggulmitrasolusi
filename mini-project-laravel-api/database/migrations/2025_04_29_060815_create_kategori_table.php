<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kategori', function (Blueprint $table) {
            $table->id(); 
            $table->string('nama');
            $table->boolean('active')->default(1);
            $table->timestamps(); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('kategori');
    }
};
