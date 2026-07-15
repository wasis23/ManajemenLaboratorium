# SISTEM MANAJEMEN LABORATORIUM KOMPUTER & JARINGAN (SIMLAB)
## Panduan Implementasi Spesifikasi Sistem untuk AI Code Generator
---

Dokumen ini berisi spesifikasi teknis dan fungsional yang sangat detail untuk membangun website **Sistem Manajemen Laboratorium Komputer & Jaringan (SIMLAB)** menggunakan stack **Laravel 11 + Inertia.js (React/Vue) + Tailwind CSS**. 

Gunakan instruksi, skema database, dan alur halaman di bawah ini untuk menggenerasikan struktur folder, file backend (Models, Controllers, Migrations, Routes), serta komponen frontend (Inertia Pages).

---

## 1. STRUKTUR DATA & SKEMA DATABASE (DATABASE SCHEMA)

Sistem ini memiliki 4 laboratorium (3 Lab Komputer, 1 Lab Jaringan). Relasi antar-tabel dirancang untuk melacak inventaris spesifik, riwayat peminjaman, dan penanganan kerusakan (ticketing).

### 1.1 Tabel: `laboratoriums`
Menyimpan data fisik ruangan laboratorium.
*   `id` (BigIncrements, PK)
*   `nama_lab` (String: "Lab Komputer 1", "Lab Komputer 2", "Lab Komputer 3", "Lab Jaringan")
*   `lokasi` (String)
*   `kapasitas_meja` (Integer)
*   `timestamps`

### 1.2 Tabel: `asets`
Menyimpan data item inventaris umum atau komponen PC.
*   `id` (BigIncrements, PK)
*   `laboratorium_id` (ForeignKey -> `laboratoriums.id`, Cascade)
*   `kode_aset` (String, Unique) - Format: `LAB-XX-YYYY` (misal: `LAB01-PC05`, `LAB04-RT01`)
*   `nama_aset` (String)
*   `jenis_aset` (Enum: `'statis'`, `'consumable'`, `'loanable'`) 
    *   *statis*: PC Client, Monitor, AC, Proyektor.
    *   *consumable*: Kabel LAN, Konektor RJ45 (stok berkurang jika dipakai).
    *   *loanable*: Routerboard, Switch, Crimping Tool, LAN Tester.
*   `spesifikasi` (JSON) - Menyimpan detail dinamis (contoh: `{"cpu": "Core i5", "ram": "16GB", "storage": "SSD 512GB", "gpu": "GTX 1650"}`)
*   `kondisi` (Enum: `'baik'`, `'rusak_ringan'`, `'rusak_berat'`)
*   `stok` (Integer, Default: 1) - Untuk item consumable/loanable.
*   `posisi_meja` (Integer, Nullable) - Nomor meja/rak lokasi aset diletakkan.
*   `timestamps`

### 1.3 Tabel: `tickets`
Menyimpan laporan kerusakan alat dari pengguna.
*   `id` (BigIncrements, PK)
*   `aset_id` (ForeignKey -> `asets.id`, Cascade)
*   `user_id` (ForeignKey -> `users.id`, Nullable jika pelapor anonim/guest via scan QR)
*   `nama_pelapor` (String) - Diisi manual jika guest, otomatis dari session jika login.
*   `deskripsi_kerusakan` (Text)
*   `status` (Enum: `'dilaporkan'`, `'sedang_diperiksa'`, `'sedang_diperbaiki'`, `'selesai'`, `'tidak_bisa_diperbaiki'`)
*   `solusi` (Text, Nullable) - Diisi oleh teknisi/admin saat tiket selesai.
*   `timestamps`

### 1.4 Tabel: `peminjamans`
Menyimpan transaksi peminjaman alat (`loanable`).
*   `id` (BigIncrements, PK)
*   `user_id` (ForeignKey -> `users.id`, Cascade)
*   `aset_id` (ForeignKey -> `asets.id`, Cascade)
*   `jumlah` (Integer, Default: 1)
*   `tanggal_pinjam` (Date)
*   `tanggal_kembali_rencana` (Date)
*   `tanggal_kembali_aktual` (Date, Nullable)
*   `status_peminjaman` (Enum: `'menunggu_persetujuan'`, `'disetujui'`, `'ditolak'`, `'dipinjam'`, `'dikembalikan'`)
*   `catatan` (Text, Nullable)
*   `timestamps`

---

## 2. ARSITEKTUR APLIKASI & ROUTING (ROUTES)

Gunakan struktur Routing Laravel berbasis Web Routes (`routes/web.php`) yang merender halaman via Inertia:

### 2.1 Guest & Public Access (Tanpa Login)
*   `GET /` - Landing page sederhana & pencarian katalog inventaris publik.
*   `GET /scan/{kode_aset}` - Menampilkan detail alat/PC secara instan dan formulir pelaporan kerusakan cepat (`POST /scan/{kode_aset}/report`).

### 2.2 Authenticated Users (Dosen/Mahasiswa - Portal Client)
*   `GET /dashboard` - Dashboard user (status peminjaman aktif & riwayat laporan).
*   `GET /katalog` - Melihat seluruh daftar alat yang berstatus *loanable*.
*   `POST /peminjaman` - Mengajukan peminjaman alat.
*   `GET /peminjaman/saya` - Riwayat peminjaman milik pengguna bersangkutan.

### 2.3 Admin / Laboran / Kepala Lab (Admin Panel)
*   `GET /admin/dashboard` - Visualisasi ringkas kondisi 4 lab, status tiket, & antrean peminjaman.
*   `RESOURCE /admin/laboratorium` - CRUD laboratorium.
*   `RESOURCE /admin/aset` - CRUD aset inventaris (termasuk cetak barcode/QR generator link).
*   `GET /admin/tickets` - List laporan kerusakan.
*   `PATCH /admin/tickets/{ticket}` - Update status penanganan laporan & solusi.
*   `GET /admin/peminjaman` - Mengelola antrean approval peminjaman.
*   `PATCH /admin/peminjaman/{peminjaman}/approve` - Persetujuan pinjam/kembali.

---

## 3. CORE FEATURES & LOGIKA INTEGRASI

### 3.1 QR Code Quick-Scan Workflow
1. Sistem men-generate URL unik untuk setiap PC/aset: `https://simlab-domain.com/scan/LAB01-PC05`.
2. Jika QR Code di meja di-scan menggunakan kamera HP:
   - Pengguna diarahkan ke halaman publik Inertia yang membaca parameter `LAB01-PC05`.
   - Halaman menampilkan spesifikasi PC saat itu.
   - Tersedia tombol merah **"Laporkan Kerusakan Meja Ini"** yang membuka Form Laporan Instan.

### 3.2 Sistem Alur Approval Peminjaman
1. Mahasiswa memilih alat `Routerboard Mikrotik` dari halaman Katalog.
2. Mahasiswa menginput tanggal pinjam, rencana tanggal kembali, jumlah, dan keperluan.
3. Transaksi masuk ke tabel `peminjamans` dengan status `'menunggu_persetujuan'`. Stok aset `loanable` belum berkurang.
4. Admin melihat notifikasi di Admin Dashboard. Admin mengklik **Approve**:
   - Status berubah menjadi `'dipinjam'`.
   - Stok aset tersebut otomatis dikurangi sejumlah yang dipinjam (`asets.stok - jumlah`).
5. Saat mahasiswa mengembalikan alat, Admin menekan tombol **Selesai/Kembali**:
   - Status berubah menjadi `'dikembalikan'`.
   - Stok aset bertambah kembali (`asets.stok + jumlah`).

---

## 4. DESIGN SYSTEM & UI/UX REQUIREMENT (FRONTEND INERTIA)

*   **Framework CSS:** Tailwind CSS.
*   **Tema Warna:** Muted, profesional, dan bersih. 
    *   Primary: Deep Indigo / Slate Blue (`#1e293b` atau `#3b82f6`).
    *   Accent: Muted Teal (`#0d9488`) untuk status sukses/baik.
    *   Danger/Error: Soft Rose/Crimson (`#e11d48`) untuk status rusak/laporan kendala.
*   **UX Pattern:**
    *   Gunakan **Modals** (Inertia Dialog Modal) untuk form cepat seperti "Ubah Status Tiket" atau "Persetujuan Peminjaman" agar tidak perlu memuat ulang halaman.
    *   Tabel inventaris wajib menggunakan **Client-side/Server-side Filtering & Pagination** yang responsif (pencarian nama, filter per lab, filter kondisi).

---

## 5. LANGKAH-LANGKAH PENGEMBANGAN UNTUK AI (INSTRUCTIONS)

Saat kamu (AI) mulai menulis kode untuk sistem ini, kerjakan dengan urutan logis berikut:
1.  **Langkah 1:** Buat file migrasi database beserta factory dan seeders untuk menguji data awal (4 lab, beberapa spesifikasi PC di tiap lab komputer, dan perangkat jaringan).
2.  **Langkah 2:** Buat Models dengan relasi Eloquent yang tepat (`Laboratorium` HasMany `Aset`, `Aset` HasMany `Ticket`, dll.).
3.  **Langkah 3:** Implementasikan auth bawaan (Laravel Breeze dengan opsi React atau Vue).
4.  **Langkah 4:** Bangun Controller untuk sisi Admin, hubungkan data ke halaman Inertia React/Vue.
5.  **Langkah 5:** Bangun Controller untuk sisi Guest/Client (terutama mekanisme Scan QR dan pelaporan cepat).
6.  **Langkah 6:** Sempurnakan tampilan UI Dashboard menggunakan komponen reaktif agar data visualisasi (pie chart kerusakan atau statistik lab) terupdate dengan mulus.
