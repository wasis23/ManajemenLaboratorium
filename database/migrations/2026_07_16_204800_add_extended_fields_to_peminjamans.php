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
        Schema::table('peminjamans', function (Blueprint $table) {
            $table->string('nomor_induk')->nullable()->after('kontak_peminjam');
            $table->string('prodi_unit')->nullable()->after('nomor_induk');
            $table->string('email_peminjam')->nullable()->after('prodi_unit');
            $table->time('jam_pinjam')->nullable()->after('tanggal_pinjam');
            $table->time('jam_kembali_rencana')->nullable()->after('tanggal_kembali_rencana');
            $table->text('tujuan_penggunaan')->nullable()->after('jam_kembali_rencana');
            $table->string('lokasi_penggunaan')->nullable()->after('tujuan_penggunaan');
            $table->boolean('setuju_syarat')->default(false)->after('catatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peminjamans', function (Blueprint $table) {
            $table->dropColumn([
                'nomor_induk',
                'prodi_unit',
                'email_peminjam',
                'jam_pinjam',
                'jam_kembali_rencana',
                'tujuan_penggunaan',
                'lokasi_penggunaan',
                'setuju_syarat'
            ]);
        });
    }
};
