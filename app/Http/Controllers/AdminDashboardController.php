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
                'rusak_count' => Aset::where('laboratorium_id', $lab->id)->whereIn('kondisi', ['rusak_ringan', 'rusak_berat'])->count(),
            ];
        });

        // 4. Pending loan approvals
        $pendingLoans = Peminjaman::with(['user', 'aset.laboratorium'])
            ->where('status_peminjaman', 'menunggu_persetujuan')
            ->orderBy('created_at', 'asc')
            ->get();

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
