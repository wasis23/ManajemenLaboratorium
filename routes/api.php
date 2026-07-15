<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SimlabApiController;
use App\Http\Middleware\CheckApiKey;

Route::middleware([CheckApiKey::class])->group(function () {
    // Read/Ambil Data
    Route::get('/laboratoriums', [SimlabApiController::class, 'getLaboratoriums']);
    Route::get('/asets', [SimlabApiController::class, 'getAsets']);
    Route::get('/tickets', [SimlabApiController::class, 'getTickets']);
    Route::get('/peminjamans', [SimlabApiController::class, 'getPeminjamans']);

    // Write/Input Data
    Route::post('/tickets', [SimlabApiController::class, 'createTicket']);
    Route::post('/peminjamans', [SimlabApiController::class, 'createPeminjaman']);
});
