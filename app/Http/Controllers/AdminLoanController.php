<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use App\Models\Aset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLoanController extends Controller
{
    /**
     * Display a listing of all loans.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        $query = Peminjaman::with(['user', 'aset.laboratorium']);

        if ($status) {
            $query->where('status_peminjaman', $status);
        }

        $loans = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Peminjaman/Index', [
            'loans' => $loans,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Approve, reject, or mark a loan as returned.
     */
    public function approve(Request $request, $id)
    {
        $loan = Peminjaman::findOrFail($id);
        $action = $request->input('action'); // 'approve', 'reject', 'return'
        $aset = Aset::findOrFail($loan->aset_id);

        if ($action === 'approve') {
            if ($loan->status_peminjaman !== 'menunggu_persetujuan') {
                return redirect()->back()->with('error', 'Transaksi tidak sedang menunggu persetujuan.');
            }

            if ($aset->stok < $loan->jumlah) {
                return redirect()->back()->with('error', 'Stok aset di database tidak mencukupi untuk disetujui.');
            }

            // Decrement the physical stock in the database
            $aset->decrement('stok', $loan->jumlah);

            $loan->update([
                'status_peminjaman' => 'dipinjam',
            ]);

            return redirect()->back()->with('success', 'Peminjaman telah disetujui dan stok telah dikurangi.');

        } elseif ($action === 'reject') {
            if ($loan->status_peminjaman !== 'menunggu_persetujuan') {
                return redirect()->back()->with('error', 'Transaksi tidak sedang menunggu persetujuan.');
            }

            $loan->update([
                'status_peminjaman' => 'ditolak',
            ]);

            return redirect()->back()->with('success', 'Peminjaman telah ditolak.');

        } elseif ($action === 'return') {
            if ($loan->status_peminjaman !== 'dipinjam') {
                return redirect()->back()->with('error', 'Transaksi tidak sedang aktif dipinjam.');
            }

            // Increment the physical stock back in the database
            $aset->increment('stok', $loan->jumlah);

            $loan->update([
                'status_peminjaman' => 'dikembalikan',
                'tanggal_kembali_aktual' => now()->format('Y-m-d'),
            ]);

            return redirect()->back()->with('success', 'Aset berhasil dikembalikan dan stok bertambah.');
        }

        return redirect()->back()->with('error', 'Aksi tidak dikenal.');
    }
}
