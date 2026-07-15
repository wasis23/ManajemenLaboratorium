import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ activeLoans, tickets }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                            Dashboard Portal Dosen & Mahasiswa
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Kelola pengajuan peminjaman alat praktik dan pantau status laporan kerusakan secara realtime.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('katalog')}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 transition"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Katalog Peminjaman
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Saya" />

            <div className="space-y-8">
                {/* Metrics Summary Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Peminjaman Aktif</span>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                {activeLoans.filter(l => l.status_peminjaman === 'dipinjam').length}
                            </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Menunggu Approval</span>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                {activeLoans.filter(l => l.status_peminjaman === 'menunggu_persetujuan').length}
                            </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Tiket Laporan</span>
                            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                                {tickets.length}
                            </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left: Active/Pending Loans */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                            Peminjaman Aktif & Persetujuan
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">Alat yang sedang dipinjam atau menunggu persetujuan laboran.</p>

                        {activeLoans.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <h4 className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">Tidak ada peminjaman aktif</h4>
                                <p className="mt-1 text-[11px] text-slate-500">Anda dapat mengajukan peminjaman alat praktik melalui halaman katalog.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeLoans.map((loan) => (
                                    <div key={loan.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                                                {loan.aset.kode_aset}
                                            </span>
                                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                loan.status_peminjaman === 'menunggu_persetujuan' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                loan.status_peminjaman === 'dipinjam' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                                                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                                            }`}>
                                                {loan.status_peminjaman === 'menunggu_persetujuan' ? 'Menunggu Approval' :
                                                 loan.status_peminjaman === 'dipinjam' ? 'Sedang Dipinjam' : 'Disetujui'}
                                            </span>
                                        </div>

                                        <h4 className="mt-2 font-bold text-slate-800 dark:text-slate-200 text-sm">{loan.aset.nama_aset}</h4>
                                        <p className="text-slate-500 mt-0.5">📍 {loan.aset.laboratorium.nama_lab}</p>

                                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-900 text-slate-650 dark:text-slate-400">
                                            <div>
                                                <span className="font-semibold block text-[10px] text-slate-500 uppercase tracking-wide">Jumlah Pinjam</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{loan.jumlah} Pcs</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold block text-[10px] text-slate-500 uppercase tracking-wide">Rencana Kembali</span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                                    {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Reported Tickets */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                            Laporan Kendala Saya
                        </h3>
                        <p className="text-xs text-slate-500 mb-6">Status pengerjaan penanganan kerusakan PC/alat yang Anda laporkan.</p>

                        {tickets.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                <svg className="mx-auto h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h4 className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">Belum ada laporan kerusakan</h4>
                                <p className="mt-1 text-[11px] text-slate-500">Anda dapat melapor kerusakan dengan men-scan QR code di komputer laboratorium.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                                {tickets.map((t) => (
                                    <div key={t.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                {t.aset.kode_aset}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                                t.status === 'dilaporkan' ? 'bg-slate-100 text-slate-655 dark:bg-slate-800 dark:text-slate-400' :
                                                t.status === 'sedang_diperiksa' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                t.status === 'sedang_diperbaiki' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                                                t.status === 'selesai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                                                'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                                            }`}>
                                                {t.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <p className="mt-2 font-semibold text-slate-850 dark:text-slate-200">
                                            Aset: <span className="font-bold">{t.aset.nama_aset}</span>
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-400 mt-2 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900">
                                            "{t.deskripsi_kerusakan}"
                                        </p>

                                        {t.solusi && (
                                            <div className="mt-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 p-3 rounded-lg text-emerald-800 dark:text-emerald-400">
                                                <span className="font-bold block text-[10px] uppercase tracking-wide">Solusi Teknisi:</span>
                                                <p className="mt-1 font-medium">"{t.solusi}"</p>
                                            </div>
                                        )}
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
