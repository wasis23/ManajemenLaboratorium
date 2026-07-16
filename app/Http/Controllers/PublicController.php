<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\Laboratorium;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Peminjaman;

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

        // Build workstation assets if scanned asset is a PC
        $workstationAssets = collect([$aset]);
        if (str_contains($aset->kode_aset, 'PC')) {
            $monitorCode = str_replace('PC', 'MN', $aset->kode_aset);
            $keyboardCode = str_replace('PC', 'KB', $aset->kode_aset);
            $mouseCode = str_replace('PC', 'MO', $aset->kode_aset);

            $paired = Aset::with('laboratorium')
                ->whereIn('kode_aset', [$monitorCode, $keyboardCode, $mouseCode])
                ->get();

            $workstationAssets = $workstationAssets->concat($paired);
        }

        // Get active tickets for any of these workstation assets
        $assetIds = $workstationAssets->pluck('id')->toArray();
        $activeTickets = Ticket::whereIn('aset_id', $assetIds)
            ->whereIn('status', ['dilaporkan', 'sedang_diperiksa', 'sedang_diperbaiki'])
            ->get();

        return Inertia::render('Public/Scan', [
            'aset' => $aset,
            'workstationAssets' => $workstationAssets,
            'activeTickets' => $activeTickets,
        ]);
    }

    /**
     * Report damage for a scanned asset.
     */
    public function report(Request $request, $kode_aset)
    {
        $aset = null;
        if ($request->has('aset_id')) {
            $aset = Aset::find($request->aset_id);
        }
        if (!$aset) {
            $aset = Aset::where('kode_aset', $kode_aset)->firstOrFail();
        }

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

    /**
     * Request loan for scanned workstation assets.
     */
    public function borrow(Request $request, $kode_aset)
    {
        $aset = Aset::where('kode_aset', $kode_aset)->firstOrFail();

        $request->validate([
            'nama_peminjam' => 'required|string|max:255',
            'nomor_induk' => 'required|string|max:50',
            'prodi_unit' => 'required|string|max:100',
            'kontak_peminjam' => 'required|string|max:30',
            'email_peminjam' => 'required|email|max:100',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali_rencana' => 'required|date|after_or_equal:tanggal_pinjam',
            'tujuan_penggunaan' => 'required|string|max:500',
            'lokasi_penggunaan' => 'required|string|max:255',
            'setuju_syarat' => 'required|accepted',
        ]);

        // Build workstation assets if scanned asset is a PC
        $workstationAssets = collect([$aset]);
        if (str_contains($aset->kode_aset, 'PC')) {
            $monitorCode = str_replace('PC', 'MN', $aset->kode_aset);
            $keyboardCode = str_replace('PC', 'KB', $aset->kode_aset);
            $mouseCode = str_replace('PC', 'MO', $aset->kode_aset);

            $paired = Aset::whereIn('kode_aset', [$monitorCode, $keyboardCode, $mouseCode])->get();
            $workstationAssets = $workstationAssets->concat($paired);
        }

        // Generate unique LP-BC-XXXXXXXX code
        $transactionCode = 'LP-BC-' . strtoupper(bin2hex(random_bytes(4)));

        foreach ($workstationAssets as $item) {
            Peminjaman::create([
                'kode_peminjaman' => $transactionCode,
                'user_id' => auth()->id(),
                'nama_peminjam' => $request->nama_peminjam,
                'nomor_induk' => $request->nomor_induk,
                'prodi_unit' => $request->prodi_unit,
                'kontak_peminjam' => $request->kontak_peminjam,
                'email_peminjam' => $request->email_peminjam,
                'aset_id' => $item->id,
                'kategori_aset' => $item->jenis_aset,
                'jumlah' => 1,
                'tanggal_pinjam' => $request->tanggal_pinjam,
                'tanggal_kembali_rencana' => $request->tanggal_kembali_rencana,
                'status_peminjaman' => 'menunggu_persetujuan',
                'tujuan_penggunaan' => $request->tujuan_penggunaan,
                'lokasi_penggunaan' => $request->lokasi_penggunaan,
                'is_barcode' => true,
                'setuju_syarat' => true,
            ]);
        }

        return redirect()->back()->with('success', 'Pengajuan peminjaman via barcode berhasil diajukan! Hubungi admin untuk persetujuan.');
    }
}
