import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ loans, assets = [], filters }) {
    const [activeSubTab, setActiveSubTab] = useState('form');
    const [approvingGroup, setApprovingGroup] = useState(null);
    const [groupAllocations, setGroupAllocations] = useState({});

    const handleLoanAction = (id, action) => {
        if (confirm(`Apakah Anda yakin ingin melakukan tindakan "${action}" untuk transaksi peminjaman ini?`)) {
            router.patch(route('admin.peminjaman.approve', { peminjaman: id }), { action });
        }
    };

    const handleConfirmApproveGroup = (loanId) => {
        const loanObj = loans.data.find(l => l.id === loanId);
        const allocations = loanObj.items.map(item => ({
            id: item.id,
            aset_id: groupAllocations[item.id]
        }));

        router.patch(route('admin.peminjaman.approve', { peminjaman: loanId }), {
            action: 'approve',
            allocations: allocations
        }, {
            onSuccess: () => {
                setApprovingGroup(null);
                setGroupAllocations({});
            }
        });
    };

    const handleStartApprove = (loan) => {
        setApprovingGroup(loan.id);
        const initialAllocations = {};
        loan.items.forEach(item => {
            const matching = assets.filter(a => a.jenis_aset === item.kategori_aset);
            initialAllocations[item.id] = matching.length > 0 ? matching[0].id : '';
        });
        setGroupAllocations(initialAllocations);
    };

    const displayLoans = loans.data.filter(l => activeSubTab === 'barcode' ? l.is_barcode : !l.is_barcode);

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                        Kelola Peminjaman Perangkat Praktik
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Persetujuan izin peminjaman alat, monitoring pengembalian perangkat, dan penyesuaian ketersediaan stok fisik di lab secara langsung.
                    </p>
                </div>
            }
        >
            <Head title="Manajemen Peminjaman" />

            <div className="space-y-6">
                {/* Status Quick Filter Bar */}
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route('admin.peminjaman.index')}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold border transition ${
                            !filters.status
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400'
                        }`}
                    >
                        Semua Peminjaman
                    </Link>
                    {['menunggu_persetujuan', 'dipinjam', 'dikembalikan', 'ditolak'].map((statusOption) => (
                        <Link
                            key={statusOption}
                            href={route('admin.peminjaman.index', { status: statusOption })}
                            className={`rounded-lg px-4 py-2 text-xs font-semibold border transition uppercase tracking-wider ${
                                filters.status === statusOption
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400'
                            }`}
                        >
                            {statusOption.replace('_', ' ')}
                        </Link>
                    ))}
                </div>

                {/* Sub Tab selection */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => {
                            setActiveSubTab('form');
                            setApprovingGroup(null);
                        }}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                            activeSubTab === 'form'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-slate-50/50 dark:bg-slate-900/20'
                                : 'border-transparent text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        📝 Form Peminjaman (Kategori)
                    </button>
                    <button
                        onClick={() => {
                            setActiveSubTab('barcode');
                            setApprovingGroup(null);
                        }}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                            activeSubTab === 'barcode'
                                ? 'border-indigo-600 text-indigo-650 dark:text-indigo-400 bg-slate-50/50 dark:bg-slate-900/20'
                                : 'border-transparent text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        📷 Scan Barcode (Aset Spesifik)
                    </button>
                </div>

                {/* Loans Table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                    <th className="px-6 py-4">Peminjam / Instansi</th>
                                    <th className="px-6 py-4">Aset / Lab</th>
                                    <th className="px-6 py-4 text-center">Jumlah</th>
                                    <th className="px-6 py-4">Tgl Pinjam</th>
                                    <th className="px-6 py-4">Rencana Kembali</th>
                                    <th className="px-6 py-4">Aktual Kembali</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                                {displayLoans.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-slate-500">
                                            Tidak ada riwayat peminjaman barang dengan status ini.
                                        </td>
                                    </tr>
                                ) : (
                                    displayLoans.map((loan) => (
                                        <tr key={loan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 align-top">
                                            <td className="px-6 py-4">
                                                {loan.user ? (
                                                    <>
                                                        <span className="font-bold text-slate-850 dark:text-slate-200 block">{loan.user.name}</span>
                                                        <span className="text-[10px] text-slate-400 block mt-0.5">{loan.user.email}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mt-0.5">{loan.user.role}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="font-bold text-slate-850 dark:text-slate-200 block">{loan.nama_peminjam}</span>
                                                        <span className="text-[10px] text-slate-450 block mt-0.5">📞 WhatsApp: {loan.kontak_peminjam}</span>
                                                        <span className="text-[10px] text-slate-400 block mt-0.5">📧 Email: {loan.email_peminjam}</span>
                                                        <span className="text-[10px] text-amber-500 uppercase tracking-widest font-semibold block mt-0.5">Tamu / Tanpa Akun</span>
                                                    </>
                                                )}
                                                {loan.kode_peminjaman && (
                                                    <span className="mt-1 inline-block font-mono text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-bold">
                                                        Code: {loan.kode_peminjaman}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {loan.items ? loan.items.map((item, idx) => (
                                                    <div key={item.id} className={idx > 0 ? "mt-3 pt-3 border-t border-slate-100 dark:border-slate-900" : ""}>
                                                        {item.aset ? (
                                                            <>
                                                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{item.aset.kode_aset}</span>
                                                                <span className="text-slate-800 dark:text-slate-200 mt-0.5 block font-bold">{item.aset.nama_aset}</span>
                                                                <span className="text-[10px] text-slate-500 block">📍 Ruang: {item.aset.laboratorium.nama_lab}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[11px]">Kategori: {item.kategori_aset}</span>
                                                                <span className="text-[10px] text-amber-500 font-semibold block mt-0.5">Belum ditentukan unit fisiknya</span>
                                                            </>
                                                        )}
                                                    </div>
                                                )) : (
                                                    loan.aset ? (
                                                        <>
                                                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{loan.aset.kode_aset}</span>
                                                            <span className="text-slate-800 dark:text-slate-200 mt-0.5 block font-bold">{loan.aset.nama_aset}</span>
                                                            <span className="text-[10px] text-slate-500 block">📍 Ruang: {loan.aset.laboratorium.nama_lab}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 block uppercase tracking-wider text-[11px]">Kategori: {loan.kategori_aset}</span>
                                                            <span className="text-[10px] text-amber-500 font-semibold block mt-0.5">Belum ditentukan unit fisiknya</span>
                                                        </>
                                                    )
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {loan.items ? loan.items.map((item, idx) => (
                                                    <div key={item.id} className={`font-bold text-slate-800 dark:text-slate-200 ${idx > 0 ? "mt-3 pt-3 border-t border-slate-100 dark:border-slate-900" : ""}`}>
                                                        {item.jumlah} Pcs
                                                    </div>
                                                )) : (
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">{loan.jumlah} Pcs</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-655 dark:text-slate-400">
                                                {new Date(loan.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-slate-655 dark:text-slate-400">
                                                {new Date(loan.tanggal_kembali_rencana).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {loan.tanggal_kembali_aktual ? (
                                                    <span className="text-emerald-600 dark:text-emerald-450 font-bold">
                                                        {new Date(loan.tanggal_kembali_aktual).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-600 italic">Belum kembali</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                                    loan.status_peminjaman === 'menunggu_persetujuan' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                    loan.status_peminjaman === 'dipinjam' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                                                    loan.status_peminjaman === 'dikembalikan' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                                    'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                                                }`}>
                                                    {loan.status_peminjaman.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                {loan.status_peminjaman === 'menunggu_persetujuan' && (
                                                    <>
                                                        {loan.is_barcode ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleLoanAction(loan.id, 'reject')}
                                                                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 mr-2.5"
                                                                >
                                                                    Tolak
                                                                </button>
                                                                <button
                                                                    onClick={() => handleLoanAction(loan.id, 'approve')}
                                                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400"
                                                                >
                                                                    Approve Peminjaman
                                                                </button>
                                                            </>
                                                        ) : approvingGroup === loan.id ? (
                                                            <div className="inline-flex flex-col gap-2 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm max-w-xs text-left">
                                                                <span className="font-bold text-slate-700 dark:text-slate-200 block text-[10px] uppercase tracking-wider">
                                                                    Alokasikan Aset:
                                                                </span>
                                                                {loan.items ? loan.items.map((item) => (
                                                                    <div key={item.id} className="flex flex-col gap-0.5 border-b border-slate-100 dark:border-slate-850 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                                                                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                                                                            {item.kategori_aset} ({item.jumlah} Pcs)
                                                                        </span>
                                                                        <select
                                                                            value={groupAllocations[item.id] || ''}
                                                                            onChange={(e) => setGroupAllocations({
                                                                                ...groupAllocations,
                                                                                [item.id]: e.target.value
                                                                            })}
                                                                            className="rounded border border-slate-300 dark:border-slate-800 dark:bg-slate-950 text-[10px] px-1.5 py-0.5 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 w-full"
                                                                            required
                                                                        >
                                                                            <option value="">-- Pilih Unit --</option>
                                                                            {assets
                                                                                .filter(a => a.jenis_aset === item.kategori_aset)
                                                                                .map(a => (
                                                                                    <option key={a.id} value={a.id}>
                                                                                        {a.nama_aset} ({a.kode_aset}) - Stok: {a.stok}
                                                                                    </option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                )) : (
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                                                                            {loan.kategori_aset} ({loan.jumlah} Pcs)
                                                                        </span>
                                                                        <select
                                                                            value={groupAllocations[loan.id] || ''}
                                                                            onChange={(e) => setGroupAllocations({
                                                                                ...groupAllocations,
                                                                                [loan.id]: e.target.value
                                                                            })}
                                                                            className="rounded border border-slate-300 dark:border-slate-800 dark:bg-slate-950 text-[10px] px-1.5 py-0.5 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 w-full"
                                                                            required
                                                                        >
                                                                            <option value="">-- Pilih Unit --</option>
                                                                            {assets
                                                                                .filter(a => a.jenis_aset === loan.kategori_aset)
                                                                                .map(a => (
                                                                                    <option key={a.id} value={a.id}>
                                                                                        {a.nama_aset} ({a.kode_aset}) - Stok: {a.stok}
                                                                                    </option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                )}
                                                                <div className="flex justify-end gap-1 mt-2">
                                                                    <button
                                                                        onClick={() => setApprovingGroup(null)}
                                                                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-[10px] font-semibold px-2 py-0.5 border border-slate-200 dark:border-slate-800 rounded"
                                                                    >
                                                                        Batal
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleConfirmApproveGroup(loan.id)}
                                                                        disabled={loan.items ? !loan.items.every(item => groupAllocations[item.id]) : !groupAllocations[loan.id]}
                                                                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded px-2 py-0.5 text-[10px] font-semibold transition"
                                                                    >
                                                                        Setuju
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => handleLoanAction(loan.id, 'reject')}
                                                                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-455"
                                                                >
                                                                    Tolak
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStartApprove(loan)}
                                                                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 dark:text-emerald-450"
                                                                >
                                                                    Approve
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                                {loan.status_peminjaman === 'dipinjam' && (
                                                    <button
                                                        onClick={() => handleLoanAction(loan.id, 'return')}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    >
                                                        Kembalikan Barang
                                                    </button>
                                                )}
                                                {['dikembalikan', 'ditolak'].includes(loan.status_peminjaman) && (
                                                    <span className="text-slate-400 italic">Selesai</span>
                                                )}
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
                                            : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400'
                                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
