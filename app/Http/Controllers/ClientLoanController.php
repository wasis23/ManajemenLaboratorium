<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\Peminjaman;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientLoanController extends Controller
{
    /**
     * Display the student/lecturer dashboard with their summary statistics.
     */
    public function dashboard(Request $request)
    {
        $userId = $request->user()->id;

        // Redirect admin to admin dashboard
        if ($request->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        $activeLoans = Peminjaman::with('aset.laboratorium')
            ->where('user_id', $userId)
            ->whereIn('status_peminjaman', ['menunggu_persetujuan', 'disetujui', 'dipinjam'])
            ->orderBy('created_at', 'desc')
            ->get();

        $tickets = Ticket::with('aset.laboratorium')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'activeLoans' => $activeLoans,
            'tickets' => $tickets,
        ]);
    }

    /**
     * Show catalog of loanable assets.
     */
    public function katalog(Request $request)
    {
        $search = $request->input('search');

        $query = Aset::with('laboratorium')
            ->whereIn('jenis_aset', ['Monitor', 'Keyboard', 'Mouse'])
            ->where('kondisi', 'baik');

        if ($search) {
            $query->where('nama_aset', 'like', "%{$search}%")
                  ->orWhere('kode_aset', 'like', "%{$search}%");
        }

        $asets = $query->orderBy('nama_aset', 'asc')->get();

        return Inertia::render('Client/Katalog', [
            'asets' => $asets,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Submit a loan request.
     */
    public function store(Request $request)
    {
        $rules = [
            'nama_peminjam' => 'required|string|max:255',
            'nomor_induk' => 'required|string|max:100',
            'prodi_unit' => 'required|string|max:255',
            'kontak_peminjam' => 'required|string|max:100',
            'email_peminjam' => 'required|email|max:255',
            
            // Items validation
            'items' => 'required|array|min:1',
            'items.*.kategori_aset' => 'required|string|in:PC,Monitor,Keyboard,Mouse',
            'items.*.jumlah' => 'required|integer|min:1',
            
            // Time & purpose
            'tanggal_pinjam' => 'required|date|after_or_equal:today',
            'jam_pinjam' => 'required|string',
            'tanggal_kembali_rencana' => 'required|date|after_or_equal:tanggal_pinjam',
            'jam_kembali_rencana' => 'required|string',
            'tujuan_penggunaan' => 'required|string|max:1000',
            'lokasi_penggunaan' => 'required|string|max:255',
            'catatan' => 'nullable|string|max:500',
            'setuju_syarat' => 'required|accepted',
        ];

        $request->validate($rules);

        // Verify each item's stock and loanability
        foreach ($request->items as $item) {
            $totalStock = Aset::where('jenis_aset', $item['kategori_aset'])
                ->where('kondisi', 'baik')
                ->sum('stok');

            if ($item['jumlah'] > $totalStock) {
                return redirect()->back()->with('error', "Stok untuk kategori {$item['kategori_aset']} tidak mencukupi. Tersisa: {$totalStock} unit.");
            }
        }

        // Create a Peminjaman record for each item
        foreach ($request->items as $item) {
            Peminjaman::create([
                'user_id' => auth()->id(),
                'nama_peminjam' => $request->nama_peminjam,
                'nomor_induk' => $request->nomor_induk,
                'prodi_unit' => $request->prodi_unit,
                'kontak_peminjam' => $request->kontak_peminjam,
                'email_peminjam' => $request->email_peminjam,
                'aset_id' => null, // Left null until admin assigns specific asset on approval
                'kategori_aset' => $item['kategori_aset'],
                'jumlah' => $item['jumlah'],
                'tanggal_pinjam' => $request->tanggal_pinjam,
                'jam_pinjam' => $request->jam_pinjam,
                'tanggal_kembali_rencana' => $request->tanggal_kembali_rencana,
                'jam_kembali_rencana' => $request->jam_kembali_rencana,
                'tujuan_penggunaan' => $request->tujuan_penggunaan,
                'lokasi_penggunaan' => $request->lokasi_penggunaan,
                'status_peminjaman' => 'menunggu_persetujuan',
                'catatan' => $request->catatan,
                'setuju_syarat' => true,
            ]);
        }

        if (auth()->check()) {
            return redirect()->route('peminjaman.saya')->with('success', 'Pengajuan peminjaman berhasil dibuat. Silakan tunggu persetujuan admin.');
        } else {
            return redirect()->route('public.catalog')->with('success', 'Pengajuan peminjaman berhasil dibuat! Silakan hubungi admin laboratorium untuk persetujuan.');
        }
    }

    /**
     * Show personal loan history.
     */
    public function saya(Request $request)
    {
        $loans = Peminjaman::with('aset.laboratorium')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Client/PeminjamanSaya', [
            'loans' => $loans,
        ]);
    }
}
