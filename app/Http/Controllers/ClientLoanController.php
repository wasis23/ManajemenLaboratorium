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
        $request->validate([
            'aset_id' => 'required|exists:asets,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal_pinjam' => 'required|date|after_or_equal:today',
            'tanggal_kembali_rencana' => 'required|date|after_or_equal:tanggal_pinjam',
            'catatan' => 'nullable|string|max:500',
        ]);

        $aset = Aset::findOrFail($request->aset_id);

        if (!in_array($aset->jenis_aset, ['Monitor', 'Keyboard', 'Mouse'])) {
            return redirect()->back()->with('error', 'Aset ini tidak dapat dipinjam.');
        }

        if ($request->jumlah > $aset->stok) {
            return redirect()->back()->with('error', "Stok tidak mencukupi. Tersisa: {$aset->stok} unit.");
        }

        Peminjaman::create([
            'user_id' => $request->user()->id,
            'aset_id' => $request->aset_id,
            'jumlah' => $request->jumlah,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'tanggal_kembali_rencana' => $request->tanggal_kembali_rencana,
            'status_peminjaman' => 'menunggu_persetujuan',
            'catatan' => $request->catatan,
        ]);

        return redirect()->route('peminjaman.saya')->with('success', 'Pengajuan peminjaman berhasil dibuat. Silakan tunggu persetujuan admin.');
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
