import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function PeminjamanSaya({ loans }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                        Riwayat Peminjaman Alat Saya
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Daftar lengkap riwayat peminjaman barang praktikum Anda beserta status approval dan pengembalian fisik.
                    </p>
                </div>
            }
        >
            <Head title="Riwayat Peminjaman" />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                <th className="px-6 py-4">Kode / Alat</th>
                                <th className="px-6 py-4">Lab / Lokasi</th>
                                <th className="px-6 py-4 text-center">Jumlah</th>
                                <th className="px-6 py-4">Tgl Pinjam</th>
                                <th className="px-6 py-4">Rencana Kembali</th>
                                <th className="px-6 py-4">Aktual Kembali</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Catatan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                            {loans.data.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                                        Belum ada riwayat transaksi peminjaman barang.
                                    </td>
                                </tr>
                            ) : (
                                loans.data.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                                                {loan.aset.kode_aset}
                                            </span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                                                {loan.aset.nama_aset}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {loan.aset.laboratorium.nama_lab}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                                            {loan.jumlah} Pcs
                                        </td>
                                        <td className="px-6 py-4 text-slate-655 dark:text-slate-400">
                                            {new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-slate-655 dark:text-slate-400">
                                            {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-slate-655 dark:text-slate-400">
                                            {loan.tanggal_kembali_aktual ? (
                                                <span className="text-emerald-600 dark:text-emerald-450 font-bold">
                                                    {new Date(loan.tanggal_kembali_aktual).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 dark:text-slate-600 italic">Belum kembali</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                                loan.status_peminjaman === 'menunggu_persetujuan' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                loan.status_peminjaman === 'disetujui' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                                                loan.status_peminjaman === 'dipinjam' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                                                loan.status_peminjaman === 'dikembalikan' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                                'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                                            }`}>
                                                {loan.status_peminjaman.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={loan.catatan}>
                                            {loan.catatan || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {loans.links && loans.links.length > 3 && (
                    <div className="border-t border-slate-100 p-4 dark:border-slate-900 flex justify-center gap-1">
                        {loans.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                                    link.active
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'
                                } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
