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
            $table->dropForeign(['user_id']);
        });

        Schema::table('peminjamans', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->change()->constrained('users')->onDelete('cascade');
            $table->string('nama_peminjam')->nullable()->after('user_id');
            $table->string('kontak_peminjam')->nullable()->after('nama_peminjam');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peminjamans', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['nama_peminjam', 'kontak_peminjam']);
        });

        Schema::table('peminjamans', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change()->constrained('users')->onDelete('cascade');
        });
    }
};
