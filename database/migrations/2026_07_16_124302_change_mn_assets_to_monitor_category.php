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
        \Illuminate\Support\Facades\DB::table('asets')
            ->where('nama_aset', 'like', 'MN%')
            ->orWhere('nama_aset', 'like', 'mn%')
            ->update(['jenis_aset' => 'Monitor']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
