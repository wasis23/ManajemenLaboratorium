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
        Schema::create('asets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('laboratorium_id')->constrained('laboratoriums')->onDelete('cascade');
            $table->string('kode_aset')->unique(); // LAB-XX-YYYY format
            $table->string('nama_aset');
            $table->enum('jenis_aset', ['statis', 'consumable', 'loanable']);
            $table->json('spesifikasi')->nullable(); // JSON specs
            $table->enum('kondisi', ['baik', 'rusak_ringan', 'rusak_berat'])->default('baik');
            $table->integer('stok')->default(1);
            $table->integer('posisi_meja')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asets');
    }
};
