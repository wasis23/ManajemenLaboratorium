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
        Schema::create('laboratoriums', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lab'); // "Lab Komputer 1", "Lab Komputer 2", "Lab Komputer 3", "Lab Jaringan"
            $table->string('lokasi');
            $table->integer('kapasitas_meja');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratoriums');
    }
};
