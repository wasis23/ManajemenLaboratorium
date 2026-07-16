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

        // Get all items ordered by created_at desc
        $allLoans = $query->orderBy('created_at', 'desc')->get();

        // Group them by transaction code (kode_peminjaman)
        $grouped = [];
        foreach ($allLoans as $loan) {
            $key = $loan->kode_peminjaman ?: 'SINGLE-' . $loan->id;
            if (!isset($grouped[$key])) {
                $grouped[$key] = collect();
            }
            $grouped[$key]->push($loan);
        }

        $transformed = collect();
        foreach ($grouped as $kode => $items) {
            $first = $items->first();
            $transformed->push([
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
                'tanggal_kembali_aktual' => $first->tanggal_kembali_aktual ? $first->tanggal_kembali_aktual->format('Y-m-d') : null,
                'status_peminjaman' => $first->status_peminjaman,
                'tujuan_penggunaan' => $first->tujuan_penggunaan,
                'lokasi_penggunaan' => $first->lokasi_penggunaan,
                'catatan' => $first->catatan,
                'items' => $items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'aset_id' => $item->aset_id,
                        'kategori_aset' => $item->kategori_aset,
                        'jumlah' => $item->jumlah,
                        'aset' => $item->aset,
                    ];
                }),
                'aset_id' => $first->aset_id,
                'kategori_aset' => $first->kategori_aset,
                'jumlah' => $first->jumlah,
                'aset' => $first->aset,
            ]);
        }

        // Manual pagination
        $page = (int) $request->input('page', 1);
        $perPage = 15;
        $sliced = $transformed->slice(($page - 1) * $perPage, $perPage)->values();

        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $sliced,
            $transformed->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        $assets = Aset::with('laboratorium')
            ->where('kondisi', 'baik')
            ->where('stok', '>', 0)
            ->get();

        return Inertia::render('Admin/Peminjaman/Index', [
            'loans' => $paginated,
            'assets' => $assets,
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

        if ($action === 'approve') {
            if ($request->has('allocations')) {
                $request->validate([
                    'allocations' => 'required|array',
                    'allocations.*.id' => 'required|exists:peminjamans,id',
                    'allocations.*.aset_id' => 'required|exists:asets,id',
                ]);

                // Validate all allocations first
                foreach ($request->allocations as $alloc) {
                    $item = Peminjaman::findOrFail($alloc['id']);
                    if ($item->status_peminjaman !== 'menunggu_persetujuan') {
                        return redirect()->back()->with('error', 'Salah satu transaksi tidak sedang menunggu persetujuan.');
                    }

                    $aset = Aset::findOrFail($alloc['aset_id']);
                    if ($aset->jenis_aset !== $item->kategori_aset) {
                        return redirect()->back()->with('error', "Aset {$aset->nama_aset} yang dipilih harus berkategori {$item->kategori_aset}.");
                    }

                    if ($aset->stok < $item->jumlah) {
                        return redirect()->back()->with('error', "Stok aset {$aset->nama_aset} tidak mencukupi untuk disetujui.");
                    }
                }

                // Process all allocations
                foreach ($request->allocations as $alloc) {
                    $item = Peminjaman::findOrFail($alloc['id']);
                    $aset = Aset::findOrFail($alloc['aset_id']);

                    $aset->decrement('stok', $item->jumlah);
                    $item->update([
                        'aset_id' => $aset->id,
                        'status_peminjaman' => 'dipinjam',
                    ]);
                }

                return redirect()->back()->with('success', 'Semua perangkat dalam pengajuan peminjaman ini telah disetujui.');
            }

            // Fallback for single item approval
            if ($loan->status_peminjaman !== 'menunggu_persetujuan') {
                return redirect()->back()->with('error', 'Transaksi tidak sedang menunggu persetujuan.');
            }

            $request->validate([
                'aset_id' => 'required|exists:asets,id',
            ]);

            $aset = Aset::findOrFail($request->aset_id);

            if ($aset->jenis_aset !== $loan->kategori_aset) {
                return redirect()->back()->with('error', "Aset yang dipilih harus berkategori {$loan->kategori_aset}.");
            }

            if ($aset->stok < $loan->jumlah) {
                return redirect()->back()->with('error', 'Stok aset di database tidak mencukupi untuk disetujui.');
            }

            $aset->decrement('stok', $loan->jumlah);
            $loan->update([
                'aset_id' => $aset->id,
                'status_peminjaman' => 'dipinjam',
            ]);

            return redirect()->back()->with('success', 'Peminjaman telah disetujui dengan aset terpilih.');

        } elseif ($action === 'reject') {
            if ($loan->status_peminjaman !== 'menunggu_persetujuan') {
                return redirect()->back()->with('error', 'Transaksi tidak sedang menunggu persetujuan.');
            }

            if ($loan->kode_peminjaman) {
                Peminjaman::where('kode_peminjaman', $loan->kode_peminjaman)
                    ->where('status_peminjaman', 'menunggu_persetujuan')
                    ->update([
                        'status_peminjaman' => 'ditolak',
                    ]);
            } else {
                $loan->update([
                    'status_peminjaman' => 'ditolak',
                ]);
            }

            return redirect()->back()->with('success', 'Peminjaman telah ditolak.');

        } elseif ($action === 'return') {
            if ($loan->status_peminjaman !== 'dipinjam') {
                return redirect()->back()->with('error', 'Transaksi tidak sedang aktif dipinjam.');
            }

            if ($loan->kode_peminjaman) {
                $loansToReturn = Peminjaman::where('kode_peminjaman', $loan->kode_peminjaman)
                    ->where('status_peminjaman', 'dipinjam')
                    ->get();

                foreach ($loansToReturn as $l) {
                    if ($l->aset_id) {
                        $aset = Aset::findOrFail($l->aset_id);
                        $aset->increment('stok', $l->jumlah);
                    }
                    $l->update([
                        'status_peminjaman' => 'dikembalikan',
                        'tanggal_kembali_aktual' => now()->format('Y-m-d'),
                    ]);
                }
            } else {
                $aset = Aset::findOrFail($loan->aset_id);
                $aset->increment('stok', $loan->jumlah);
                $loan->update([
                    'status_peminjaman' => 'dikembalikan',
                    'tanggal_kembali_aktual' => now()->format('Y-m-d'),
                ]);
            }

            return redirect()->back()->with('success', 'Semua aset dalam peminjaman ini berhasil dikembalikan.');
        }

        return redirect()->back()->with('error', 'Aksi tidak dikenal.');
    }
}
