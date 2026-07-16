<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('peminjamans', function (Blueprint $table) {
            $table->string('kode_peminjaman')->nullable()->after('id');
        });

        // Update existing records with a unique transaction code
        $loans = DB::table('peminjamans')->get();
        foreach ($loans as $loan) {
            DB::table('peminjamans')
                ->where('id', $loan->id)
                ->update([
                    'kode_peminjaman' => 'LP-' . str_pad($loan->id, 6, '0', STR_PAD_LEFT)
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peminjamans', function (Blueprint $table) {
            $table->dropColumn('kode_peminjaman');
        });
    }
};
