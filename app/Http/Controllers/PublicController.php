<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\Laboratorium;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicController extends Controller
{
    /**
     * Display public landing page with asset catalog.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $labId = $request->input('laboratorium_id');
        $jenis = $request->input('jenis_aset');
        $kondisi = $request->input('kondisi');

        $asetsQuery = Aset::with('laboratorium');

        if ($search) {
            $asetsQuery->where(function($query) use ($search) {
                $query->where('nama_aset', 'like', "%{$search}%")
                      ->orWhere('kode_aset', 'like', "%{$search}%");
            });
        }

        if ($labId) {
            $asetsQuery->where('laboratorium_id', $labId);
        }

        if ($jenis) {
            $asetsQuery->where('jenis_aset', $jenis);
        }

        if ($kondisi) {
            $asetsQuery->where('kondisi', $kondisi);
        }

        $asets = $asetsQuery->orderBy('kode_aset', 'asc')->paginate(12)->withQueryString();
        $laboratoriums = Laboratorium::all();

        $borrowableAssets = Aset::with('laboratorium')
            ->whereIn('jenis_aset', ['Monitor', 'Keyboard', 'Mouse'])
            ->where('kondisi', 'baik')
            ->where('stok', '>', 0)
            ->orderBy('nama_aset', 'asc')
            ->get();

        return Inertia::render('Welcome', [
            'asets' => $asets,
            'laboratoriums' => $laboratoriums,
            'borrowableAssets' => $borrowableAssets,
            'filters' => $request->only(['search', 'laboratorium_id', 'jenis_aset', 'kondisi']),
            'canLogin' => true,
            'canRegister' => true,
        ]);
    }

    /**
     * Show details of a specific asset scanned via QR.
     */
    public function scan($kode_aset)
    {
        $aset = Aset::with('laboratorium')->where('kode_aset', $kode_aset)->firstOrFail();

        // Get tickets for this asset that are still active
        $activeTickets = Ticket::where('aset_id', $aset->id)
            ->whereIn('status', ['dilaporkan', 'sedang_diperiksa', 'sedang_diperbaiki'])
            ->get();

        return Inertia::render('Public/Scan', [
            'aset' => $aset,
            'activeTickets' => $activeTickets,
        ]);
    }

    /**
     * Report damage for a scanned asset.
     */
    public function report(Request $request, $kode_aset)
    {
        $aset = Aset::where('kode_aset', $kode_aset)->firstOrFail();

        $request->validate([
            'nama_pelapor' => 'required|string|max:255',
            'deskripsi_kerusakan' => 'required|string|min:5',
        ]);

        Ticket::create([
            'aset_id' => $aset->id,
            'user_id' => auth()->id(), // null if guest
            'nama_pelapor' => $request->nama_pelapor,
            'deskripsi_kerusakan' => $request->deskripsi_kerusakan,
            'status' => 'dilaporkan',
        ]);

        return redirect()->back()->with('success', 'Laporan kerusakan berhasil dikirim! Teknisi kami akan segera memeriksa.');
    }
}
