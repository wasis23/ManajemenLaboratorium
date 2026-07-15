import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminDashboard({ assetStats, ticketStats, labs, pendingLoans, activeTickets }) {
    
    const handleLoanAction = (id, action) => {
        if (confirm(`Apakah Anda yakin ingin melakukan aksi "${action}" pada peminjaman ini?`)) {
            router.patch(route('admin.peminjaman.approve', { peminjaman: id }), { action });
        }
    };

    // Calculate totals
    const totalAssets = assetStats.baik + assetStats.rusak_ringan + assetStats.rusak_berat;
    const totalActiveTickets = ticketStats.dilaporkan + ticketStats.sedang_diperiksa + ticketStats.sedang_diperbaiki;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                        Admin Control Panel & Dashboard
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Sistem Manajemen Laboratorium Komputer & Jaringan (SIMLAB) Politeknik Indonusa Surakarta.
                    </p>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                {/* Stats row */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Assets */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Aset</span>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalAssets}</h3>
                            <p className="text-[10px] text-slate-400 mt-1">PC client & alat jaringan</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>

                    {/* Active Tickets */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tiket Aktif</span>
                            <h3 className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{totalActiveTickets}</h3>
                            <p className="text-[10px] text-slate-400 mt-1">Butuh pemeriksaan teknisi</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-655 dark:bg-rose-950/40 dark:text-rose-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Antrean Pinjam</span>
                            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{pendingLoans.length}</h3>
                            <p className="text-[10px] text-slate-400 mt-1">Menunggu persetujuan</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Good Condition Ratio */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kondisi Baik</span>
                            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-450 mt-1">
                                {totalAssets > 0 ? Math.round((assetStats.baik / totalAssets) * 100) : 100}%
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1">Rasio kelayakan alat</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-450">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Condition Breakdown Visual */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Grafik Kelayakan Aset</h3>
                    <div className="flex h-5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <div
                            className="bg-emerald-500 transition-all duration-300"
                            style={{ width: `${totalAssets > 0 ? (assetStats.baik / totalAssets) * 100 : 100}%` }}
                            title={`Baik: ${assetStats.baik}`}
                        ></div>
                        <div
                            className="bg-amber-500 transition-all duration-300"
                            style={{ width: `${totalAssets > 0 ? (assetStats.rusak_ringan / totalAssets) * 100 : 0}%` }}
                            title={`Rusak Ringan: ${assetStats.rusak_ringan}`}
                        ></div>
                        <div
                            className="bg-rose-500 transition-all duration-300"
                            style={{ width: `${totalAssets > 0 ? (assetStats.rusak_berat / totalAssets) * 100 : 0}%` }}
                            title={`Rusak Berat: ${assetStats.rusak_berat}`}
                        ></div>
                    </div>
                    <div className="mt-4 flex gap-6 text-xs font-semibold">
                        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-emerald-500"></span> Baik: {assetStats.baik} unit</span>
                        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-amber-500"></span> Rusak Ringan: {assetStats.rusak_ringan} unit</span>
                        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-rose-500"></span> Rusak Berat: {assetStats.rusak_berat} unit</span>
                    </div>
                </div>

                {/* Lab Summaries Grid */}
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Kondisi 4 Ruang Laboratorium</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {labs.map((lab) => (
                            <div key={lab.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between shadow-sm">
                                <div>
                                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{lab.nama_lab}</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">📍 {lab.lokasi} &bull; Kapasitas {lab.kapasitas_meja} Meja</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-xs font-semibold">
                                    <span className="text-slate-550 dark:text-slate-450">Total Aset: <span className="font-bold text-slate-900 dark:text-white">{lab.asets_count}</span></span>
                                    <span className="text-rose-600 dark:text-rose-400">Masalah: <span className="font-bold">{lab.rusak_count}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Approvals and Active Tickets Panel */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left: Pending Approvals */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Antrean Persetujuan Peminjaman ({pendingLoans.length})
                            </h3>
                            <Link href={route('admin.peminjaman.index')} className="text-xs text-blue-600 font-semibold hover:underline">
                                Lihat Semua
                            </Link>
                        </div>

                        {pendingLoans.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">Antrean approval kosong</h4>
                                <p className="mt-1 text-[10px] text-slate-500">Tidak ada pengajuan peminjaman barang praktikum yang tertunda saat ini.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingLoans.map((loan) => (
                                    <div key={loan.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                                                {loan.aset.kode_aset}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                Oleh: <span className="font-bold">{loan.user.name}</span>
                                            </span>
                                        </div>

                                        <h4 className="mt-2 font-bold text-slate-850 dark:text-slate-200">{loan.aset.nama_aset}</h4>
                                        <p className="text-slate-500 mt-0.5">Jumlah: <span className="font-bold text-slate-800 dark:text-slate-200">{loan.jumlah} Pcs</span> | Keperluan: "{loan.catatan || '-'}"</p>

                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleLoanAction(loan.id, 'reject')}
                                                className="rounded bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 px-3 py-1 font-bold transition hover:bg-rose-100"
                                            >
                                                Tolak
                                            </button>
                                            <button
                                                onClick={() => handleLoanAction(loan.id, 'approve')}
                                                className="rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 px-3 py-1 font-bold transition hover:bg-emerald-100"
                                            >
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Active Unresolved Tickets */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Laporan Kerusakan Terkini ({activeTickets.length})
                            </h3>
                            <Link href={route('admin.tickets.index')} className="text-xs text-blue-600 font-semibold hover:underline">
                                Lihat Semua
                            </Link>
                        </div>

                        {activeTickets.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">Semua sistem normal</h4>
                                <p className="mt-1 text-[10px] text-slate-500">Tidak ada tiket laporan kerusakan yang belum ditindaklanjuti.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeTickets.map((t) => (
                                    <div key={t.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                {t.aset.kode_aset}
                                            </span>
                                            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                                t.status === 'dilaporkan' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                                t.status === 'sedang_diperiksa' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                                            }`}>
                                                {t.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-slate-800 dark:text-slate-200 font-semibold">
                                            Aset: <span className="font-bold">{t.aset.nama_aset}</span>
                                        </p>
                                        <p className="text-slate-500 mt-1 leading-snug">
                                            Laporan dari <span className="font-bold text-slate-700 dark:text-slate-300">{t.nama_pelapor}</span>: "{t.deskripsi_kerusakan}"
                                        </p>
                                        <div className="mt-3 flex justify-end">
                                            <Link
                                                href={route('admin.tickets.index', { status: t.status })}
                                                className="rounded bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-3 py-1 font-semibold hover:bg-blue-100"
                                            >
                                                Tindak Lanjuti
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
