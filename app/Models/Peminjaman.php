<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    use HasFactory;

    protected $table = 'peminjamans';

    protected $fillable = [
        'user_id',
        'nama_peminjam',
        'kontak_peminjam',
        'nomor_induk',
        'prodi_unit',
        'email_peminjam',
        'aset_id',
        'jumlah',
        'tanggal_pinjam',
        'jam_pinjam',
        'tanggal_kembali_rencana',
        'jam_kembali_rencana',
        'tanggal_kembali_aktual',
        'status_peminjaman',
        'tujuan_penggunaan',
        'lokasi_penggunaan',
        'catatan',
        'setuju_syarat'
    ];

    protected $casts = [
        'tanggal_pinjam' => 'date',
        'tanggal_kembali_rencana' => 'date',
        'tanggal_kembali_aktual' => 'date',
        'setuju_syarat' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function aset()
    {
        return $this->belongsTo(Aset::class);
    }
}
