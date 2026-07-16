<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\Laboratorium;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAsetController extends Controller
{
    /**
     * Display a listing of assets with filtering and pagination.
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

        $asets = $asetsQuery->orderBy('kode_aset', 'asc')->paginate(15)->withQueryString();
        $laboratoriums = Laboratorium::all();

        return Inertia::render('Admin/Aset/Index', [
            'asets' => $asets,
            'laboratoriums' => $laboratoriums,
            'filters' => $request->only(['search', 'laboratorium_id', 'jenis_aset', 'kondisi']),
        ]);
    }

    /**
     * Store a newly created asset.
     */
    public function store(Request $request)
    {
        $request->validate([
            'laboratorium_id' => 'required|exists:laboratoriums,id',
            'kode_aset' => 'required|string|unique:asets,kode_aset|max:50',
            'nama_aset' => 'required|string|max:255',
            'jenis_aset' => 'required|in:PC,Monitor,Keyboard,Mouse',
            'kondisi' => 'required|in:baik,rusak_ringan,rusak_berat',
            'stok' => 'required|integer|min:0',
            'posisi_meja' => 'nullable|integer|min:1',
            'spec_cpu' => 'nullable|string',
            'spec_ram' => 'nullable|string',
            'spec_storage' => 'nullable|string',
            'spec_gpu' => 'nullable|string',
            'spec_os' => 'nullable|string',
            'spec_brand' => 'nullable|string',
            'spec_details' => 'nullable|string',
        ]);

        $spesifikasi = [];
        if ($request->jenis_aset === 'PC') {
            $spesifikasi = [
                'cpu' => $request->spec_cpu,
                'ram' => $request->spec_ram,
                'storage' => $request->spec_storage,
                'gpu' => $request->spec_gpu,
                'os' => $request->spec_os,
            ];
        } else {
            $spesifikasi = [
                'brand' => $request->spec_brand,
                'details' => $request->spec_details,
            ];
        }

        Aset::create([
            'laboratorium_id' => $request->laboratorium_id,
            'kode_aset' => strtoupper($request->kode_aset),
            'nama_aset' => $request->nama_aset,
            'jenis_aset' => $request->jenis_aset,
            'spesifikasi' => $spesifikasi,
            'kondisi' => $request->kondisi,
            'stok' => $request->stok,
            'posisi_meja' => $request->posisi_meja,
        ]);

        return redirect()->back()->with('success', 'Aset berhasil ditambahkan.');
    }

    /**
     * Update the specified asset.
     */
    public function update(Request $request, $id)
    {
        $aset = Aset::findOrFail($id);

        $request->validate([
            'laboratorium_id' => 'required|exists:laboratoriums,id',
            'kode_aset' => 'required|string|max:50|unique:asets,kode_aset,' . $aset->id,
            'nama_aset' => 'required|string|max:255',
            'jenis_aset' => 'required|in:PC,Monitor,Keyboard,Mouse',
            'kondisi' => 'required|in:baik,rusak_ringan,rusak_berat',
            'stok' => 'required|integer|min:0',
            'posisi_meja' => 'nullable|integer|min:1',
            'spec_cpu' => 'nullable|string',
            'spec_ram' => 'nullable|string',
            'spec_storage' => 'nullable|string',
            'spec_gpu' => 'nullable|string',
            'spec_os' => 'nullable|string',
            'spec_brand' => 'nullable|string',
            'spec_details' => 'nullable|string',
        ]);

        $spesifikasi = [];
        if ($request->jenis_aset === 'PC') {
            $spesifikasi = [
                'cpu' => $request->spec_cpu,
                'ram' => $request->spec_ram,
                'storage' => $request->spec_storage,
                'gpu' => $request->spec_gpu,
                'os' => $request->spec_os,
            ];
        } else {
            $spesifikasi = [
                'brand' => $request->spec_brand,
                'details' => $request->spec_details,
            ];
        }

        $aset->update([
            'laboratorium_id' => $request->laboratorium_id,
            'kode_aset' => strtoupper($request->kode_aset),
            'nama_aset' => $request->nama_aset,
            'jenis_aset' => $request->jenis_aset,
            'spesifikasi' => $spesifikasi,
            'kondisi' => $request->kondisi,
            'stok' => $request->stok,
            'posisi_meja' => $request->posisi_meja,
        ]);

        return redirect()->back()->with('success', 'Aset berhasil diperbarui.');
    }

    /**
     * Remove the specified asset.
     */
    public function destroy($id)
    {
        $aset = Aset::findOrFail($id);
        $aset->delete();

        return redirect()->back()->with('success', 'Aset berhasil dihapus.');
    }
}
