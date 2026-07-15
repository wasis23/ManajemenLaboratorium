<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ClientLoanController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminLaboratoriumController;
use App\Http\Controllers\AdminAsetController;
use App\Http\Controllers\AdminTicketController;
use App\Http\Controllers\AdminLoanController;
use Illuminate\Support\Facades\Route;

// Public Guest Routes
Route::get('/', [PublicController::class, 'index'])->name('public.catalog');
Route::get('/scan/{kode_aset}', [PublicController::class, 'scan'])->name('public.scan');
Route::post('/scan/{kode_aset}/report', [PublicController::class, 'report'])->name('public.report');

// Authenticated User Routes (Dosen / Mahasiswa)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [ClientLoanController::class, 'dashboard'])->name('dashboard');
    Route::get('/katalog', [ClientLoanController::class, 'katalog'])->name('katalog');
    Route::post('/peminjaman', [ClientLoanController::class, 'store'])->name('peminjaman.store');
    Route::get('/peminjaman/saya', [ClientLoanController::class, 'saya'])->name('peminjaman.saya');
});

// Profile Management Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Panel Routes (Protected by Auth and Admin middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // CRUD Laboratoriums & Asets
    Route::resource('laboratorium', AdminLaboratoriumController::class)->except(['create', 'edit', 'show']);
    Route::resource('aset', AdminAsetController::class)->except(['create', 'edit', 'show']);
    
    // Ticket Management
    Route::get('/tickets', [AdminTicketController::class, 'index'])->name('tickets.index');
    Route::patch('/tickets/{ticket}', [AdminTicketController::class, 'update'])->name('tickets.update');
    
    // Loan Approval Management
    Route::get('/peminjaman', [AdminLoanController::class, 'index'])->name('peminjaman.index');
    Route::patch('/peminjaman/{peminjaman}/approve', [AdminLoanController::class, 'approve'])->name('peminjaman.approve');
});

require __DIR__.'/auth.php';
