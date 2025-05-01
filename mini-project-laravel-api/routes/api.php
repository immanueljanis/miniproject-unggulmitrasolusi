
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\PenjualanController;

Route::apiResource('pelanggan', PelangganController::class);
Route::apiResource('barang', BarangController::class);
Route::apiResource('kategori', KategoriController::class);
Route::apiResource('penjualan', PenjualanController::class);