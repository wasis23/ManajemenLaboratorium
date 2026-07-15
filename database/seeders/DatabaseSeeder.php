<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Laboratorium;
use App\Models\Aset;
use App\Models\Ticket;
use App\Models\Peminjaman;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users
        $admin = User::create([
            'name' => 'Admin Laboran Indonusa',
            'email' => 'admin@indonusa.ac.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        $user = User::create([
            'name' => 'Budi Santoso (Mahasiswa)',
            'email' => 'mahasiswa@indonusa.ac.id',
            'password' => Hash::make('user123'),
            'role' => 'user',
        ]);

        $dosen = User::create([
            'name' => 'Dwi Hartanto (Dosen)',
            'email' => 'dosen@indonusa.ac.id',
            'password' => Hash::make('dosen123'),
            'role' => 'user',
        ]);

        // 2. Seed Laboratoriums
        $lab1 = Laboratorium::create([
            'nama_lab' => 'Lab Komputer 1',
            'lokasi' => 'Gedung A, Lantai 2',
            'kapasitas_meja' => 30,
        ]);

        $lab2 = Laboratorium::create([
            'nama_lab' => 'Lab Komputer 2',
            'lokasi' => 'Gedung A, Lantai 3',
            'kapasitas_meja' => 30,
        ]);

        $lab3 = Laboratorium::create([
            'nama_lab' => 'Lab Komputer 3',
            'lokasi' => 'Gedung B, Lantai 2',
            'kapasitas_meja' => 25,
        ]);

        $lab4 = Laboratorium::create([
            'nama_lab' => 'Lab Jaringan & Hardware',
            'lokasi' => 'Gedung B, Lantai 3',
            'kapasitas_meja' => 20,
        ]);

        // 3. Seed Asets

        // Lab 1 Assets (PCs, AC, Proyektor)
        for ($i = 1; $i <= 5; $i++) {
            Aset::create([
                'laboratorium_id' => $lab1->id,
                'kode_aset' => sprintf('LAB01-PC%02d', $i),
                'nama_aset' => 'PC Client - HP ProDesk',
                'jenis_aset' => 'statis',
                'spesifikasi' => [
                    'cpu' => 'Intel Core i5-10400',
                    'ram' => '16GB DDR4',
                    'storage' => 'SSD 512GB NVMe',
                    'gpu' => 'Intel UHD Graphics 630',
                    'os' => 'Windows 11 Pro'
                ],
                'kondisi' => $i == 3 ? 'rusak_ringan' : 'baik',
                'stok' => 1,
                'posisi_meja' => $i,
            ]);
        }
        Aset::create([
            'laboratorium_id' => $lab1->id,
            'kode_aset' => 'LAB01-AC01',
            'nama_aset' => 'AC Daikin 2 PK',
            'jenis_aset' => 'statis',
            'spesifikasi' => ['brand' => 'Daikin', 'power' => '2 PK', 'refrigerant' => 'R32'],
            'kondisi' => 'baik',
            'stok' => 1,
        ]);
        Aset::create([
            'laboratorium_id' => $lab1->id,
            'kode_aset' => 'LAB01-PR01',
            'nama_aset' => 'Proyektor Epson EB-X06',
            'jenis_aset' => 'statis',
            'spesifikasi' => ['brand' => 'Epson', 'resolution' => 'XGA', 'brightness' => '3600 lumens'],
            'kondisi' => 'baik',
            'stok' => 1,
        ]);

        // Lab 2 Assets (PCs)
        for ($i = 1; $i <= 5; $i++) {
            Aset::create([
                'laboratorium_id' => $lab2->id,
                'kode_aset' => sprintf('LAB02-PC%02d', $i),
                'nama_aset' => 'PC Client - Lenovo ThinkCentre',
                'jenis_aset' => 'statis',
                'spesifikasi' => [
                    'cpu' => 'AMD Ryzen 5 4600G',
                    'ram' => '8GB DDR4',
                    'storage' => 'SSD 256GB',
                    'gpu' => 'Radeon Graphics',
                    'os' => 'Ubuntu 22.04 LTS'
                ],
                'kondisi' => $i == 5 ? 'rusak_berat' : 'baik',
                'stok' => 1,
                'posisi_meja' => $i,
            ]);
        }

        // Lab 3 Assets (PCs)
        for ($i = 1; $i <= 5; $i++) {
            Aset::create([
                'laboratorium_id' => $lab3->id,
                'kode_aset' => sprintf('LAB03-PC%02d', $i),
                'nama_aset' => 'PC Client - ASUS ExpertCenter',
                'jenis_aset' => 'statis',
                'spesifikasi' => [
                    'cpu' => 'Intel Core i3-12100',
                    'ram' => '8GB DDR4',
                    'storage' => 'SSD 512GB',
                    'gpu' => 'Intel UHD Graphics 730',
                    'os' => 'Windows 10 Pro'
                ],
                'kondisi' => 'baik',
                'stok' => 1,
                'posisi_meja' => $i,
            ]);
        }

        // Lab 4 Assets (Jaringan - Loanable & Consumable)
        $rt1 = Aset::create([
            'laboratorium_id' => $lab4->id,
            'kode_aset' => 'LAB04-RT01',
            'nama_aset' => 'MikroTik RouterBOARD RB951Ui-2HnD',
            'jenis_aset' => 'loanable',
            'spesifikasi' => ['brand' => 'MikroTik', 'wifi' => '2.4GHz', 'ports' => '5x Ethernet'],
            'kondisi' => 'baik',
            'stok' => 10,
        ]);
        $sw1 = Aset::create([
            'laboratorium_id' => $lab4->id,
            'kode_aset' => 'LAB04-SW01',
            'nama_aset' => 'Cisco Switch 24-Port SF95-24',
            'jenis_aset' => 'loanable',
            'spesifikasi' => ['brand' => 'Cisco', 'ports' => '24-ports 10/100', 'type' => 'Unmanaged'],
            'kondisi' => 'baik',
            'stok' => 4,
        ]);
        Aset::create([
            'laboratorium_id' => $lab4->id,
            'kode_aset' => 'LAB04-TL01',
            'nama_aset' => 'Tang Crimping RJ45/RJ11',
            'jenis_aset' => 'loanable',
            'spesifikasi' => ['brand' => 'Taffware', 'material' => 'Carbon Steel'],
            'kondisi' => 'baik',
            'stok' => 15,
        ]);
        Aset::create([
            'laboratorium_id' => $lab4->id,
            'kode_aset' => 'LAB04-CB01',
            'nama_aset' => 'Kabel LAN UTP Belden Cat6 (Meter)',
            'jenis_aset' => 'consumable',
            'spesifikasi' => ['brand' => 'Belden', 'category' => 'Cat6', 'type' => 'UTP'],
            'kondisi' => 'baik',
            'stok' => 305, // 1 box
        ]);
        Aset::create([
            'laboratorium_id' => $lab4->id,
            'kode_aset' => 'LAB04-CN01',
            'nama_aset' => 'Konektor RJ45 AMP Cat6 (Pcs)',
            'jenis_aset' => 'consumable',
            'spesifikasi' => ['brand' => 'AMP/CommScope', 'category' => 'Cat6'],
            'kondisi' => 'baik',
            'stok' => 100,
        ]);

        // 4. Seed Tickets (Laporan Kerusakan)
        $pc_rusak_1 = Aset::where('kode_aset', 'LAB01-PC03')->first();
        Ticket::create([
            'aset_id' => $pc_rusak_1->id,
            'user_id' => $user->id,
            'nama_pelapor' => $user->name,
            'deskripsi_kerusakan' => 'Monitor sering mati-nyala sendiri, kemungkinan kabel HDMI kendor atau port bermasalah.',
            'status' => 'sedang_diperiksa',
        ]);

        $pc_rusak_2 = Aset::where('kode_aset', 'LAB02-PC05')->first();
        Ticket::create([
            'aset_id' => $pc_rusak_2->id,
            'user_id' => null, // Guest scan
            'nama_pelapor' => 'Mahasiswa Tamu (Scan QR)',
            'deskripsi_kerusakan' => 'Komputer mati total, tidak bisa dinyalakan sama sekali ketika ditekan tombol power.',
            'status' => 'dilaporkan',
        ]);

        // A resolved ticket
        $pc_ok = Aset::where('kode_aset', 'LAB01-PC01')->first();
        Ticket::create([
            'aset_id' => $pc_ok->id,
            'user_id' => $dosen->id,
            'nama_pelapor' => $dosen->name,
            'deskripsi_kerusakan' => 'Mouse tidak terdeteksi oleh sistem.',
            'status' => 'selesai',
            'solusi' => 'Mouse diganti dengan yang baru dari stok logistik.',
        ]);

        // 5. Seed Peminjaman
        Peminjaman::create([
            'user_id' => $user->id,
            'aset_id' => $rt1->id,
            'jumlah' => 2,
            'tanggal_pinjam' => now()->subDays(3)->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(2)->format('Y-m-d'),
            'status_peminjaman' => 'dipinjam',
            'catatan' => 'Untuk praktikum perancangan jaringan VLAN mandiri.',
        ]);

        Peminjaman::create([
            'user_id' => $dosen->id,
            'aset_id' => $sw1->id,
            'jumlah' => 1,
            'tanggal_pinjam' => now()->subDays(5)->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->subDays(2)->format('Y-m-d'),
            'tanggal_kembali_aktual' => now()->subDays(2)->format('Y-m-d'),
            'status_peminjaman' => 'dikembalikan',
            'catatan' => 'Untuk demonstrasi routing dinamis di kelas praktikum.',
        ]);

        Peminjaman::create([
            'user_id' => $user->id,
            'aset_id' => $sw1->id,
            'jumlah' => 1,
            'tanggal_pinjam' => now()->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(4)->format('Y-m-d'),
            'status_peminjaman' => 'menunggu_persetujuan',
            'catatan' => 'Peminjaman switch untuk tugas kelompok.',
        ]);
    }
}
