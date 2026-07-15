<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aset extends Model
{
    use HasFactory;

    protected $table = 'asets';

    protected $fillable = [
        'laboratorium_id',
        'kode_aset',
        'nama_aset',
        'jenis_aset',
        'spesifikasi',
        'kondisi',
        'stok',
        'posisi_meja'
    ];

    protected $casts = [
        'spesifikasi' => 'array'
    ];

    public function laboratorium()
    {
        return $this->belongsTo(Laboratorium::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function peminjamans()
    {
        return $this->hasMany(Peminjaman::class);
    }
}
