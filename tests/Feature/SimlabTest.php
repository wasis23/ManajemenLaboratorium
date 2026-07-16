<?php

namespace Tests\Feature;

use App\Models\Aset;
use App\Models\Laboratorium;
use App\Models\Peminjaman;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SimlabTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create standard test data
        $this->lab = Laboratorium::create([
            'nama_lab' => 'Lab Komputer 1',
            'lokasi' => 'Gedung A Lantai 2',
            'kapasitas_meja' => 30,
        ]);

        $this->pcAset = Aset::create([
            'laboratorium_id' => $this->lab->id,
            'kode_aset' => 'LAB01-PC01',
            'nama_aset' => 'PC Lenovo Core i5',
            'jenis_aset' => 'PC',
            'spesifikasi' => ['cpu' => 'Intel i5', 'ram' => '8GB'],
            'kondisi' => 'baik',
            'stok' => 1,
            'posisi_meja' => 1,
        ]);

        $this->routerAset = Aset::create([
            'laboratorium_id' => $this->lab->id,
            'kode_aset' => 'LAB01-RT01',
            'nama_aset' => 'MikroTik RB951',
            'jenis_aset' => 'Monitor',
            'spesifikasi' => ['brand' => 'MikroTik', 'details' => 'RB951Ui-2HnD'],
            'kondisi' => 'baik',
            'stok' => 5,
        ]);

        $this->student = User::create([
            'name' => 'Budi Mahasiswa',
            'email' => 'budi@indonusa.ac.id',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);

        $this->admin = User::create([
            'name' => 'Admin Laboran',
            'email' => 'laboran@indonusa.ac.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);
    }

    public function test_admin_role_is_saved()
    {
        $this->assertEquals('admin', $this->admin->role);
        $this->assertEquals('admin', $this->admin->fresh()->role);
    }

    /**
     * Test public catalog loading.
     */
    public function test_public_catalog_page_loads_successfully()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    /**
     * Test public QR scan page loading.
     */
    public function test_public_scan_page_shows_asset_details()
    {
        $response = $this->get("/scan/{$this->pcAset->kode_aset}");
        $response->assertStatus(200);
        $response->assertSee('LAB01-PC01');
    }

    /**
     * Test guest can submit a damage report ticket.
     */
    public function test_guest_can_report_asset_damage()
    {
        $response = $this->post("/scan/{$this->pcAset->kode_aset}/report", [
            'nama_pelapor' => 'Ahmad Guest',
            'deskripsi_kerusakan' => 'Keyboard tidak merespon tombol spacebar.',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('tickets', [
            'nama_pelapor' => 'Ahmad Guest',
            'aset_id' => $this->pcAset->id,
            'status' => 'dilaporkan',
        ]);
    }

    /**
     * Test client dashboard accessibility.
     */
    public function test_authenticated_user_can_access_dashboard()
    {
        $response = $this->actingAs($this->student)->get('/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test client loan request stock validation.
     */
    public function test_client_cannot_borrow_more_than_available_stock()
    {
        $response = $this->actingAs($this->student)->post('/peminjaman', [
            'aset_id' => $this->routerAset->id,
            'jumlah' => 10, // Stock is 5
            'tanggal_pinjam' => now()->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(3)->format('Y-m-d'),
            'catatan' => 'Praktikum jaringan',
        ]);

        $response->assertSessionHas('error');
        $this->assertDatabaseMissing('peminjamans', [
            'user_id' => $this->student->id,
            'aset_id' => $this->routerAset->id,
        ]);
    }

    /**
     * Test client can submit loan request.
     */
    public function test_client_can_submit_loan_request()
    {
        $response = $this->actingAs($this->student)->post('/peminjaman', [
            'aset_id' => $this->routerAset->id,
            'jumlah' => 2,
            'tanggal_pinjam' => now()->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(3)->format('Y-m-d'),
            'catatan' => 'Praktikum jaringan',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('peminjamans', [
            'user_id' => $this->student->id,
            'aset_id' => $this->routerAset->id,
            'status_peminjaman' => 'menunggu_persetujuan',
        ]);
    }

    /**
     * Test admin middleware restricts normal users.
     */
    public function test_regular_user_cannot_access_admin_dashboard()
    {
        $response = $this->actingAs($this->student)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    /**
     * Test admin dashboard works for admin.
     */
    public function test_admin_user_can_access_admin_dashboard()
    {
        $response = $this->actingAs($this->admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    /**
     * Test admin can access laboratorium detail page.
     */
    public function test_admin_can_access_laboratorium_detail_page()
    {
        $response = $this->actingAs($this->admin)->get("/admin/laboratorium/{$this->lab->id}");
        $response->assertStatus(200);
    }

    /**
     * Test admin can approve loan request, which decrements stock.
     */
    public function test_admin_can_approve_loan_request()
    {
        $loan = Peminjaman::create([
            'user_id' => $this->student->id,
            'aset_id' => $this->routerAset->id,
            'jumlah' => 2,
            'tanggal_pinjam' => now()->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(3)->format('Y-m-d'),
            'status_peminjaman' => 'menunggu_persetujuan',
        ]);

        $response = $this->actingAs($this->admin)->patch("/admin/peminjaman/{$loan->id}/approve", [
            'action' => 'approve',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('peminjamans', [
            'id' => $loan->id,
            'status_peminjaman' => 'dipinjam',
        ]);

        // Verify stock decremented: 5 - 2 = 3
        $this->assertEquals(3, $this->routerAset->fresh()->stok);
    }

    /**
     * Test admin can return loan request, which increments stock.
     */
    public function test_admin_can_mark_loan_as_returned()
    {
        $this->routerAset->update(['stok' => 3]); // Simulated stock after approval

        $loan = Peminjaman::create([
            'user_id' => $this->student->id,
            'aset_id' => $this->routerAset->id,
            'jumlah' => 2,
            'tanggal_pinjam' => now()->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(3)->format('Y-m-d'),
            'status_peminjaman' => 'dipinjam',
        ]);

        $response = $this->actingAs($this->admin)->patch("/admin/peminjaman/{$loan->id}/approve", [
            'action' => 'return',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('peminjamans', [
            'id' => $loan->id,
            'status_peminjaman' => 'dikembalikan',
        ]);

        // Verify stock incremented: 3 + 2 = 5
        $this->assertEquals(5, $this->routerAset->fresh()->stok);
    }

    /**
     * Test admin resolve ticket and auto-update asset condition.
     */
    public function test_admin_resolving_ticket_updates_asset_condition()
    {
        $ticket = Ticket::create([
            'nama_pelapor' => 'Budi',
            'aset_id' => $this->pcAset->id,
            'deskripsi_kerusakan' => 'Bluescreen.',
            'status' => 'dilaporkan',
        ]);

        // Asset condition should start as 'baik'
        $this->assertEquals('baik', $this->pcAset->kondisi);

        // Update to repair -> sets asset to 'rusak_ringan'
        $this->actingAs($this->admin)->patch("/admin/tickets/{$ticket->id}", [
            'status' => 'sedang_diperbaiki',
            'solusi' => 'Memeriksa RAM',
        ]);
        $this->assertEquals('rusak_ringan', $this->pcAset->fresh()->kondisi);

        // Update to selesai -> sets asset back to 'baik'
        $this->actingAs($this->admin)->patch("/admin/tickets/{$ticket->id}", [
            'status' => 'selesai',
            'solusi' => 'RAM dibersihkan',
        ]);
        $this->assertEquals('baik', $this->pcAset->fresh()->kondisi);
    }

    /**
     * Test API: access is blocked without correct key.
     */
    public function test_api_requires_valid_key()
    {
        config(['services.simlab.api_key' => 'my-secret-key']);

        $response = $this->getJson('/api/asets');
        $response->assertStatus(401);

        $response = $this->getJson('/api/asets?api_key=wrong-key');
        $response->assertStatus(401);
    }

    /**
     * Test API: get assets works with valid key.
     */
    public function test_api_can_get_assets()
    {
        config(['services.simlab.api_key' => 'my-secret-key']);

        $response = $this->withHeaders(['X-API-KEY' => 'my-secret-key'])
            ->getJson('/api/asets');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                '*' => [
                    'id',
                    'laboratorium_id',
                    'kode_aset',
                    'nama_aset',
                    'jenis_aset',
                    'spesifikasi',
                    'kondisi',
                    'stok',
                    'posisi_meja',
                ]
            ]
        ]);
    }

    /**
     * Test API: update asset successfully.
     */
    public function test_api_can_update_asset()
    {
        config(['services.simlab.api_key' => 'my-secret-key']);

        $aset = $this->pcAset;

        $response = $this->withHeaders(['X-API-KEY' => 'my-secret-key'])
            ->putJson("/api/asets/{$aset->id}", [
                'nama_aset' => 'Updated PC Name',
                'kondisi' => 'rusak_ringan',
                'stok' => 5,
                'spesifikasi' => ['cpu' => 'Intel i7', 'ram' => '16GB']
            ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Aset updated successfully.'
        ]);

        $this->assertDatabaseHas('asets', [
            'id' => $aset->id,
            'nama_aset' => 'Updated PC Name',
            'kondisi' => 'rusak_ringan',
            'stok' => 5
        ]);

        $this->assertEquals(['cpu' => 'Intel i7', 'ram' => '16GB'], $aset->fresh()->spesifikasi);
    }

    /**
     * Test API: update asset validation errors.
     */
    public function test_api_update_asset_validation()
    {
        config(['services.simlab.api_key' => 'my-secret-key']);

        $aset = $this->pcAset;

        // Try invalid laboratorium_id and invalid kondisi
        $response = $this->withHeaders(['X-API-KEY' => 'my-secret-key'])
            ->putJson("/api/asets/{$aset->id}", [
                'laboratorium_id' => 9999, // Doesn't exist
                'kondisi' => 'invalid-kondisi',
                'kode_aset' => $this->routerAset->kode_aset // Already exists
            ]);

        $response->assertStatus(422);
        $response->assertJsonStructure([
            'success',
            'errors' => [
                'laboratorium_id',
                'kondisi',
                'kode_aset'
            ]
        ]);
    }

    /**
     * Test API: update asset not found.
     */
    public function test_api_update_asset_not_found()
    {
        config(['services.simlab.api_key' => 'my-secret-key']);

        $response = $this->withHeaders(['X-API-KEY' => 'my-secret-key'])
            ->putJson("/api/asets/99999", [
                'nama_aset' => 'Non-existent Asset'
            ]);

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => 'Aset tidak ditemukan.'
        ]);
    }

    /**
     * Test guest can submit a loan request.
     */
    public function test_guest_can_submit_loan_request()
    {
        $response = $this->post('/peminjaman', [
            'aset_id' => $this->routerAset->id,
            'jumlah' => 1,
            'tanggal_pinjam' => now()->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(2)->format('Y-m-d'),
            'nama_peminjam' => 'Guest Borrower',
            'kontak_peminjam' => '0899999999',
            'catatan' => 'Guest loan test',
        ]);

        $response->assertRedirect('/');
        $this->assertDatabaseHas('peminjamans', [
            'user_id' => null,
            'nama_peminjam' => 'Guest Borrower',
            'kontak_peminjam' => '0899999999',
            'aset_id' => $this->routerAset->id,
            'status_peminjaman' => 'menunggu_persetujuan',
        ]);
    }

    /**
     * Test guest cannot submit loan request without name and contact.
     */
    public function test_guest_cannot_submit_loan_without_identity()
    {
        $response = $this->post('/peminjaman', [
            'aset_id' => $this->routerAset->id,
            'jumlah' => 1,
            'tanggal_pinjam' => now()->format('Y-m-d'),
            'tanggal_kembali_rencana' => now()->addDays(2)->format('Y-m-d'),
            'catatan' => 'Missing info test',
        ]);

        $response->assertSessionHasErrors(['nama_peminjam', 'kontak_peminjam']);
    }
}


