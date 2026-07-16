<?php

namespace App\Http\Controllers;

use App\Models\Laboratorium;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminLaboratoriumController extends Controller
{
    /**
     * Display a listing of laboratories.
     */
    public function index()
    {
        $laboratoriums = Laboratorium::withCount('asets')->get();

        return Inertia::render('Admin/Laboratorium/Index', [
            'laboratoriums' => $laboratoriums,
        ]);
    }

    /**
     * Store a newly created laboratory.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_lab' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'kapasitas_meja' => 'required|integer|min:1',
        ]);

        Laboratorium::create([
            'nama_lab' => $request->nama_lab,
            'lokasi' => $request->lokasi,
            'kapasitas_meja' => $request->kapasitas_meja,
        ]);

        return redirect()->back()->with('success', 'Laboratorium berhasil ditambahkan.');
    }

    /**
     * Update the specified laboratory.
     */
    public function update(Request $request, $id)
    {
        $lab = Laboratorium::findOrFail($id);

        $request->validate([
            'nama_lab' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'kapasitas_meja' => 'required|integer|min:1',
        ]);

        $lab->update([
            'nama_lab' => $request->nama_lab,
            'lokasi' => $request->lokasi,
            'kapasitas_meja' => $request->kapasitas_meja,
        ]);

        return redirect()->back()->with('success', 'Laboratorium berhasil diperbarui.');
    }

    /**
     * Remove the specified laboratory.
     */
    public function destroy($id)
    {
        $lab = Laboratorium::findOrFail($id);
        $lab->delete();

        return redirect()->back()->with('success', 'Laboratorium berhasil dihapus.');
    }

    /**
     * Display the specified laboratory detail.
     */
    public function show($id)
    {
        $laboratorium = Laboratorium::findOrFail($id);

        // Load all assets in this laboratorium
        $asets = \App\Models\Aset::where('laboratorium_id', $id)->get();

        // Load all tickets for assets in this laboratorium
        $tickets = \App\Models\Ticket::whereIn('aset_id', $asets->pluck('id'))
            ->with(['aset'])
            ->latest()
            ->get();

        // Load all loans for assets in this laboratorium
        $peminjamans = \App\Models\Peminjaman::whereIn('aset_id', $asets->pluck('id'))
            ->with(['aset', 'user'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Laboratorium/Show', [
            'laboratorium' => $laboratorium,
            'asets' => $asets,
            'tickets' => $tickets,
            'peminjamans' => $peminjamans,
        ]);
    }
}
