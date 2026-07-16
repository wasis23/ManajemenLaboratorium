<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\Laboratorium;
use App\Models\Peminjaman;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 1. Asset conditions summary
        $assetStats = [
            'baik' => Aset::where('kondisi', 'baik')->count(),
            'rusak_ringan' => Aset::where('kondisi', 'rusak_ringan')->count(),
            'rusak_berat' => Aset::where('kondisi', 'rusak_berat')->count(),
        ];

        // 2. Active tickets summary
        $ticketStats = [
            'dilaporkan' => Ticket::where('status', 'dilaporkan')->count(),
            'sedang_diperiksa' => Ticket::where('status', 'sedang_diperiksa')->count(),
            'sedang_diperbaiki' => Ticket::where('status', 'sedang_diperbaiki')->count(),
            'selesai' => Ticket::where('status', 'selesai')->count(),
        ];

        // 3. Lab summaries (asset count & status)
        $labs = Laboratorium::withCount('asets')->get()->map(function($lab) {
            return [
                'id' => $lab->id,
                'nama_lab' => $lab->nama_lab,
                'lokasi' => $lab->lokasi,
                'kapasitas_meja' => $lab->kapasitas_meja,
                'asets_count' => $lab->asets_count,
                'baik_count' => Aset::where('laboratorium_id', $lab->id)->where('kondisi', 'baik')->count(),
                'rusak_ringan_count' => Aset::where('laboratorium_id', $lab->id)->where('kondisi', 'rusak_ringan')->count(),
                'rusak_berat_count' => Aset::where('laboratorium_id', $lab->id)->where('kondisi', 'rusak_berat')->count(),
                'rusak_count' => Aset::where('laboratorium_id', $lab->id)->whereIn('kondisi', ['rusak_ringan', 'rusak_berat'])->count(),
            ];
        });

        // 4. Pending loan approvals grouped by transaction
        $rawPendingLoans = Peminjaman::with(['user', 'aset.laboratorium'])
            ->where('status_peminjaman', 'menunggu_persetujuan')
            ->orderBy('created_at', 'asc')
            ->get();

        $groupedPending = [];
        foreach ($rawPendingLoans as $loan) {
            $key = $loan->kode_peminjaman ?: 'SINGLE-' . $loan->id;
            if (!isset($groupedPending[$key])) {
                $groupedPending[$key] = collect();
            }
            $groupedPending[$key]->push($loan);
        }

        $pendingLoans = collect();
        foreach ($groupedPending as $kode => $items) {
            $first = $items->first();
            $pendingLoans->push([
                'id' => $first->id,
                'kode_peminjaman' => $first->kode_peminjaman,
                'user' => $first->user,
                'nama_peminjam' => $first->nama_peminjam,
                'nomor_induk' => $first->nomor_induk,
                'prodi_unit' => $first->prodi_unit,
                'kontak_peminjam' => $first->kontak_peminjam,
                'email_peminjam' => $first->email_peminjam,
                'tanggal_pinjam' => $first->tanggal_pinjam ? $first->tanggal_pinjam->format('Y-m-d') : null,
                'tanggal_kembali_rencana' => $first->tanggal_kembali_rencana ? $first->tanggal_kembali_rencana->format('Y-m-d') : null,
                'status_peminjaman' => $first->status_peminjaman,
                'catatan' => $first->catatan,
                'items' => $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'kategori_aset' => $item->kategori_aset,
                        'jumlah' => $item->jumlah,
                        'aset' => $item->aset,
                    ];
                }),
                'aset' => $first->aset,
                'kategori_aset' => $first->kategori_aset,
                'jumlah' => $first->jumlah,
            ]);
        }

        // 5. Active/unresolved tickets
        $activeTickets = Ticket::with(['aset.laboratorium', 'user'])
            ->whereIn('status', ['dilaporkan', 'sedang_diperiksa', 'sedang_diperbaiki'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'assetStats' => $assetStats,
            'ticketStats' => $ticketStats,
            'labs' => $labs,
            'pendingLoans' => $pendingLoans,
            'activeTickets' => $activeTickets,
        ]);
    }
}
