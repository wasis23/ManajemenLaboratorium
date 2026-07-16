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
        Schema::table('asets', function (Blueprint $table) {
            $table->string('jenis_aset')->change();
        });

        // Set all existing assets' type to 'PC'
        \Illuminate\Support\Facades\DB::table('asets')->update(['jenis_aset' => 'PC']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asets', function (Blueprint $table) {
            $table->enum('jenis_aset', ['statis', 'consumable', 'loanable'])->change();
        });
    }
};
