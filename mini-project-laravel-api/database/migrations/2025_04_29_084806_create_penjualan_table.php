<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('penjualan', function (Blueprint $table) {
            $table->id();
            $table->string('id_nota')->unique(); 
            $table->string('tgl');
            $table->string('kode_pelanggan');
            $table->integer('subtotal');
            $table->boolean('active')->default(1);
            $table->timestamps();

            $table->foreign('kode_pelanggan')
                ->references('id')
                ->on('pelanggan')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjualan');
    }
};
