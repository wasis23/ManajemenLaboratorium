<?php

/**
 * SIMLAB Database Auto-Creator and Migrator
 * Run: php setup-db.php
 */

echo "==================================================\n";
echo "       SIMLAB DATABASE AUTO-SETUP SCRIPT\n";
echo "==================================================\n\n";

if (!file_exists('.env')) {
    echo "[ERROR] File .env tidak ditemukan di root directory.\n";
    echo "Silakan buat file .env terlebih dahulu (salin dari .env.example).\n";
    exit(1);
}

// Parse .env file manually
$env = [];
$lines = file('.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    list($key, $value) = explode('=', $line, 2) + [NULL, NULL];
    if ($key !== NULL) {
        $env[trim($key)] = trim(trim($value), '"\'');
    }
}

$connection = $env['DB_CONNECTION'] ?? 'mysql';
$host = $env['DB_HOST'] ?? '127.0.0.1';
$port = $env['DB_PORT'] ?? '3306';
$database = $env['DB_DATABASE'] ?? 'simlab';
$username = $env['DB_USERNAME'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

if ($connection !== 'mysql') {
    echo "[INFO] DB_CONNECTION diatur ke '$connection'. Script ini hanya untuk setup MySQL.\n";
    echo "Menjalankan migrasi standar...\n";
    passthru("php artisan migrate:fresh --seed");
    exit(0);
}

try {
    echo "Menghubungkan ke server MySQL di $host:$port...\n";
    // Connect to MySQL server without specifying a database
    $pdo = new PDO("mysql:host=$host;port=$port", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Membuat database `$database` jika belum ada...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "[SUKSES] Database `$database` berhasil dibuat/diverifikasi.\n\n";

    echo "Menjalankan 'php artisan migrate:fresh --seed' untuk membuat tabel & isi data awal...\n";
    echo "--------------------------------------------------\n";
    passthru("php artisan migrate:fresh --seed");
    echo "--------------------------------------------------\n";
    echo "\n[SELESAI] Proses setup database berhasil sepenuhnya!\n";

} catch (PDOException $e) {
    echo "\n[ERROR] Koneksi database gagal: " . $e->getMessage() . "\n";
    echo "Silakan periksa kembali konfigurasi DB_HOST, DB_USERNAME, dan DB_PASSWORD di file .env Anda.\n";
    exit(1);
}
