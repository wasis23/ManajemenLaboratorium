<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Aset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTicketController extends Controller
{
    /**
     * Display a listing of tickets.
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        $query = Ticket::with(['aset.laboratorium', 'user']);

        if ($status) {
            $query->where('status', $status);
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * Update the status and solution of a ticket.
     */
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $request->validate([
            'status' => 'required|in:dilaporkan,sedang_diperiksa,sedang_diperbaiki,selesai,tidak_bisa_diperbaiki',
            'solusi' => 'nullable|string|max:1000',
        ]);

        $ticket->update([
            'status' => $request->status,
            'solusi' => $request->solusi,
        ]);

        // Auto-update asset condition based on ticket status
        $aset = Aset::findOrFail($ticket->aset_id);
        if ($request->status === 'selesai') {
            $aset->update(['kondisi' => 'baik']);
        } elseif ($request->status === 'tidak_bisa_diperbaiki') {
            $aset->update(['kondisi' => 'rusak_berat']);
        } elseif ($request->status === 'sedang_diperbaiki' || $request->status === 'sedang_diperiksa') {
            // If it's being checked/repaired and was previously 'baik', change it to 'rusak_ringan'
            if ($aset->kondisi === 'baik') {
                $aset->update(['kondisi' => 'rusak_ringan']);
            }
        }

        return redirect()->back()->with('success', 'Status tiket dan kondisi aset berhasil diperbarui.');
    }
}
