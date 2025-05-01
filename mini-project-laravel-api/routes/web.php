<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\HomeController;

// Rute utama untuk aplikasi web
Route::get('/', function () {
    return view('welcome');
});

// Contoh route dengan controller
// Route::get('/', [HomeController::class, 'index']);
