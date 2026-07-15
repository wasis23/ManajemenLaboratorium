<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laboratorium;
use App\Models\Aset;
use App\Models\Ticket;
use App\Models\Peminjaman;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SimlabApiController extends Controller
{
    public function getLaboratoriums()
    {
        $labs = Laboratorium::withCount('asets')->get();
        return response()->json([
            'success' => true,
            'data' => $labs
        ]);
    }

    public function getAsets(Request $request)
    {
        $query = Aset::with('laboratorium');

        if ($request->has('laboratorium_id')) {
            $query->where('laboratorium_id', $request->laboratorium_id);
        }

        if ($request->has('kondisi')) {
            $query->where('kondisi', $request->kondisi);
        }

        $asets = $query->get();

        return response()->json([
            'success' => true,
            'data' => $asets
        ]);
    }

    public function getTickets()
    {
        $tickets = Ticket::with(['aset', 'user'])->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    public function getPeminjamans()
    {
        $peminjamans = Peminjaman::with(['aset', 'user'])->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $peminjamans
        ]);
    }

    public function createTicket(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'aset_id' => 'required|exists:asets,id',
            'nama_pelapor' => 'required|string|max:255',
            'deskripsi_kerusakan' => 'required|string',
            'email_pelapor' => 'nullable|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = null;
        if ($request->filled('email_pelapor')) {
            $user = User::where('email', $request->email_pelapor)->first();
            $userId = $user?->id;
        }

        $ticket = Ticket::create([
            'aset_id' => $request->aset_id,
            'user_id' => $userId,
            'nama_pelapor' => $request->nama_pelapor,
            'deskripsi_kerusakan' => $request->deskripsi_kerusakan,
            'status' => 'dilaporkan'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ticket created successfully.',
            'data' => $ticket
        ], 201);
    }

    public function createPeminjaman(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email_peminjam' => 'required|email|exists:users,email',
            'aset_id' => 'required|exists:asets,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali_rencana' => 'required|date|after_or_equal:tanggal_pinjam',
            'catatan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email_peminjam)->first();
        $aset = Aset::findOrFail($request->aset_id);

        // Check if stock is sufficient
        if ($aset->jenis_aset === 'loanable' && $aset->stok < $request->jumlah) {
            return response()->json([
                'success' => false,
                'message' => 'Stok aset tidak mencukupi untuk dipinjam.'
            ], 400);
        }

        $peminjaman = Peminjaman::create([
            'user_id' => $user->id,
            'aset_id' => $request->aset_id,
            'jumlah' => $request->jumlah,
            'tanggal_pinjam' => $request->tanggal_pinjam,
            'tanggal_kembali_rencana' => $request->tanggal_kembali_rencana,
            'status_peminjaman' => 'menunggu_persetujuan',
            'catatan' => $request->catatan
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Peminjaman request created successfully.',
            'data' => $peminjaman
        ], 201);
    }

    public function createAset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'laboratorium_id' => 'required|exists:laboratoriums,id',
            'kode_aset' => 'required|string|unique:asets,kode_aset',
            'nama_aset' => 'required|string|max:255',
            'jenis_aset' => 'required|in:statis,consumable,loanable',
            'spesifikasi' => 'nullable|array',
            'kondisi' => 'nullable|in:baik,rusak_ringan,rusak_berat',
            'stok' => 'nullable|integer|min:0',
            'posisi_meja' => 'nullable|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $aset = Aset::create([
            'laboratorium_id' => $request->laboratorium_id,
            'kode_aset' => $request->kode_aset,
            'nama_aset' => $request->nama_aset,
            'jenis_aset' => $request->jenis_aset,
            'spesifikasi' => $request->spesifikasi,
            'kondisi' => $request->kondisi ?? 'baik',
            'stok' => $request->stok ?? 1,
            'posisi_meja' => $request->posisi_meja
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Aset created successfully.',
            'data' => $aset
        ], 201);
    }
}

