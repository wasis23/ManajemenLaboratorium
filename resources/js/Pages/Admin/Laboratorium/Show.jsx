import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Show({ laboratorium, asets, tickets, peminjamans }) {
    const [activeTab, setActiveTab] = useState('assets');
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);

    const { data, setData, patch, processing, errors, reset } = useForm({
        status: '',
        solusi: '',
    });

    const openEditModal = (ticket) => {
        setCurrentTicket(ticket);
        setData({
            status: ticket.status,
            solusi: ticket.solusi || '',
        });
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setCurrentTicket(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.tickets.update', { ticket: currentTicket.id }), {
            onSuccess: () => closeEditModal(),
        });
    };

    // Stats
    const totalAssets = asets.reduce((acc, curr) => acc + curr.stok, 0);
    const activeTickets = tickets.filter(t => ['dilaporkan', 'sedang_diperiksa', 'sedang_diperbaiki'].includes(t.status)).length;
    const activeLoans = peminjamans.filter(p => p.status_peminjaman === 'dipinjam').length;

    const countByCategory = (category) => {
        return asets
            .filter(a => a.jenis_aset === category)
            .reduce((acc, curr) => acc + curr.stok, 0);
    };

    const countPC = countByCategory('PC');
    const countMonitor = countByCategory('Monitor');
    const countKeyboard = countByCategory('Keyboard');
    const countMouse = countByCategory('Mouse');

    const getKondisiStatsByCategory = (category) => {
        const filtered = asets.filter(a => a.jenis_aset === category);
        const baik = filtered.filter(a => a.kondisi === 'baik').reduce((acc, curr) => acc + curr.stok, 0);
        const rusakRingan = filtered.filter(a => a.kondisi === 'rusak_ringan').reduce((acc, curr) => acc + curr.stok, 0);
        const rusakBerat = filtered.filter(a => a.kondisi === 'rusak_berat').reduce((acc, curr) => acc + curr.stok, 0);
        return { baik, rusakRingan, rusakBerat };
    };

    const statsPC = getKondisiStatsByCategory('PC');
    const statsMonitor = getKondisiStatsByCategory('Monitor');
    const statsKeyboard = getKondisiStatsByCategory('Keyboard');
    const statsMouse = getKondisiStatsByCategory('Mouse');

    // Badges helper
    const getKondisiBadge = (kondisi) => {
        switch (kondisi) {
            case 'baik':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450';
            case 'rusak_ringan':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
            case 'rusak_berat':
                return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
            default:
                return 'bg-slate-100 text-slate-600 dark:bg-slate-800';
        }
    };

    const getStatusTicketBadge = (status) => {
        switch (status) {
            case 'dilaporkan':
                return 'bg-slate-100 text-slate-655 dark:bg-slate-800 dark:text-slate-400';
            case 'sedang_diperiksa':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
            case 'sedang_diperbaiki':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
            case 'selesai':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusLoanBadge = (status) => {
        switch (status) {
            case 'menunggu_persetujuan':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400';
            case 'dipinjam':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
            case 'dikembalikan':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450';
            case 'ditolak':
                return 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
            default:
                return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={route('admin.dashboard')}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 flex items-center gap-1"
                            >
                                &larr; Kembali ke Dashboard
                            </Link>
                        </div>
                        <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100 mt-1">
                            Detail {laboratorium.nama_lab}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Analisis menyeluruh untuk aset, perbaikan, dan peminjaman aktif.
                        </p>
                    </div>
                    <Link
                        href={route('admin.aset.index', { laboratorium_id: laboratorium.id })}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 transition"
                    >
                        Kelola Aset Ruangan
                    </Link>
                </div>
            }
        >
            <Head title={`Detail ${laboratorium.nama_lab}`} />

            <div className="space-y-6">
                {/* Laboratory Info & Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    {/* Lab Metadata Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Informasi Ruangan</span>
                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{laboratorium.nama_lab}</h3>
                            <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">📍 Lokasi:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-250">{laboratorium.lokasi}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400">🪑 Kapasitas Meja:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-250">{laboratorium.kapasitas_meja} Unit Meja Kerja</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stat: Total Assets by Category & Condition */}
                    <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-4">Stok Aset Per Kategori & Kondisi</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {/* PC */}
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">PC Client</span>
                                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">{countPC} <span className="text-[10px] font-semibold text-slate-400">unit</span></span>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1 text-[10px] font-bold text-slate-505">
                                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-450 font-semibold">
                                            <span>Baik:</span>
                                            <span>{statsPC.baik}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-semibold">
                                            <span>R. Ringan:</span>
                                            <span>{statsPC.rusakRingan}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-rose-600 dark:text-rose-455 font-semibold">
                                            <span>R. Berat:</span>
                                            <span>{statsPC.rusakBerat}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Monitor */}
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Monitor</span>
                                        <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{countMonitor} <span className="text-[10px] font-semibold text-slate-400">unit</span></span>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1 text-[10px] font-bold text-slate-505">
                                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-450 font-semibold">
                                            <span>Baik:</span>
                                            <span>{statsMonitor.baik}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-semibold">
                                            <span>R. Ringan:</span>
                                            <span>{statsMonitor.rusakRingan}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-rose-600 dark:text-rose-455 font-semibold">
                                            <span>R. Berat:</span>
                                            <span>{statsMonitor.rusakBerat}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Keyboard */}
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Keyboard</span>
                                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{countKeyboard} <span className="text-[10px] font-semibold text-slate-400">unit</span></span>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1 text-[10px] font-bold text-slate-505">
                                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-450 font-semibold">
                                            <span>Baik:</span>
                                            <span>{statsKeyboard.baik}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-semibold">
                                            <span>R. Ringan:</span>
                                            <span>{statsKeyboard.rusakRingan}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-rose-600 dark:text-rose-455 font-semibold">
                                            <span>R. Berat:</span>
                                            <span>{statsKeyboard.rusakBerat}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mouse */}
                                <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase">Mouse</span>
                                        <span className="text-xl font-black text-amber-600 dark:text-amber-400">{countMouse} <span className="text-[10px] font-semibold text-slate-400">unit</span></span>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1 text-[10px] font-bold text-slate-505">
                                        <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-450 font-semibold">
                                            <span>Baik:</span>
                                            <span>{statsMouse.baik}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 font-semibold">
                                            <span>R. Ringan:</span>
                                            <span>{statsMouse.rusakRingan}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-rose-600 dark:text-rose-455 font-semibold">
                                            <span>R. Berat:</span>
                                            <span>{statsMouse.rusakBerat}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900/80 text-xs font-bold text-slate-400 flex justify-between">
                            <span>Total Seluruh Aset:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-extrabold">{totalAssets} Unit</span>
                        </div>
                    </div>

                    {/* Stat: Active Issues */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Laporan Kerusakan</span>
                            <h3 className={`text-3xl font-extrabold mt-2 ${activeTickets > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-450'}`}>
                                {activeTickets}
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-2">Menunggu perbaikan/tindak lanjut</p>
                        </div>
                        <div className="mt-4 text-xs font-bold text-slate-500">
                            Total {tickets.length} laporan historis
                        </div>
                    </div>
                </div>

                {/* Tabs Selector */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => setActiveTab('assets')}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                            activeTab === 'assets'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                    >
                        Aset ({asets.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                            activeTab === 'tickets'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                    >
                        Tiket Kendala ({tickets.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('loans')}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                            activeTab === 'loans'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                        }`}
                    >
                        Riwayat Peminjaman ({peminjamans.length})
                    </button>
                </div>

                {/* Tab 1: Assets List */}
                {activeTab === 'assets' && (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                        <th className="px-6 py-4">Kode Aset</th>
                                        <th className="px-6 py-4">Nama Alat / Aset</th>
                                        <th className="px-6 py-4">Kategori</th>
                                        <th className="px-6 py-4 text-center">Stok</th>
                                        <th className="px-6 py-4">Spesifikasi</th>
                                        <th className="px-6 py-4">Kondisi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                                    {asets.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                                Belum ada aset terdaftar di laboratorium ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        asets.map((aset) => (
                                            <tr key={aset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="px-6 py-4 font-mono font-bold text-blue-600 dark:text-blue-450">
                                                    {aset.kode_aset}
                                                </td>
                                                <td className="px-6 py-4 text-slate-800 dark:text-slate-200">
                                                    <span className="font-bold block">{aset.nama_aset}</span>
                                                    {aset.posisi_meja && <span className="text-[10px] text-slate-400">Meja: {aset.posisi_meja}</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        aset.jenis_aset === 'PC' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                                                        aset.jenis_aset === 'Monitor' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' :
                                                        aset.jenis_aset === 'Keyboard' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450' :
                                                        'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                                    }`}>
                                                        {aset.jenis_aset}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200">
                                                    {aset.stok} Unit
                                                </td>
                                                <td className="px-6 py-4 text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                                    {aset.spesifikasi ? (
                                                        aset.jenis_aset === 'PC' ? (
                                                            <span>{aset.spesifikasi.cpu || '-'}, {aset.spesifikasi.ram || '-'}, {aset.spesifikasi.storage || '-'}</span>
                                                        ) : (
                                                            <span>Merk: {aset.spesifikasi.brand || '-'} &bull; {aset.spesifikasi.details || '-'}</span>
                                                        )
                                                    ) : (
                                                        <span className="text-slate-400">Tidak ada spesifikasi</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getKondisiBadge(aset.kondisi)}`}>
                                                        {aset.kondisi.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 2: Tickets List */}
                {activeTab === 'tickets' && (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                        <th className="px-6 py-4">Aset</th>
                                        <th className="px-6 py-4">Pelapor</th>
                                        <th className="px-6 py-4">Deskripsi Kerusakan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Solusi Penanganan</th>
                                        <th className="px-6 py-4">Tanggal Laporan</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                                    {tickets.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                                                Tidak ada riwayat kendala/tiket kerusakan pada laboratorium ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        tickets.map((t) => (
                                            <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.aset?.nama_aset}</span>
                                                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{t.aset?.kode_aset}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-850 dark:text-slate-200">
                                                    {t.nama_pelapor}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-sm">
                                                    {t.deskripsi_kerusakan}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusTicketBadge(t.status)}`}>
                                                        {t.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                    {t.solusi || <span className="text-slate-400 italic">Belum ada solusi</span>}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(t.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openEditModal(t)}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        Tindak Lanjuti
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Tab 3: Loan Requests List */}
                {activeTab === 'loans' && (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                        <th className="px-6 py-4">Aset Dipinjam</th>
                                        <th className="px-6 py-4">Peminjam</th>
                                        <th className="px-6 py-4 text-center">Jumlah</th>
                                        <th className="px-6 py-4">Keperluan / Catatan</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Rencana Kembali</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                                    {peminjamans.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                                Belum ada pengajuan peminjaman untuk aset di laboratorium ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        peminjamans.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{p.aset?.nama_aset}</span>
                                                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-450">{p.aset?.kode_aset}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-800 dark:text-slate-200">
                                                    {p.user ? (
                                                        <>
                                                            <span className="font-bold">{p.user.name}</span>
                                                            <span className="text-[10px] text-slate-400 block mt-0.5">{p.user.email}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="font-bold">{p.nama_peminjam}</span>
                                                            <span className="text-[10px] text-amber-500 block mt-0.5">{p.kontak_peminjam} (Tamu)</span>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200 font-bold">
                                                    {p.jumlah} Pcs
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                                    {p.catatan || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusLoanBadge(p.status_peminjaman)}`}>
                                                        {p.status_peminjaman.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(p.tanggal_kembali_rencana).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Ticket Modal */}
            <Modal show={isEditOpen} onClose={closeEditModal}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 pb-3 dark:border-slate-900">
                        Tindak Lanjuti Kerusakan: {currentTicket?.aset?.kode_aset}
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-xs space-y-2 mb-6 border border-slate-100 dark:border-slate-800">
                        <div><span className="font-bold text-slate-500">Nama Pelapor:</span> {currentTicket?.nama_pelapor}</div>
                        <div><span className="font-bold text-slate-500">Deskripsi Kendala:</span> "{currentTicket?.deskripsi_kerusakan}"</div>
                        <div><span className="font-bold text-slate-500">Kondisi Aset Saat Ini:</span> <span className="font-bold uppercase text-amber-700 dark:text-amber-455">{currentTicket?.aset?.kondisi?.replace('_', ' ')}</span></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Perbarui Status Penanganan</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-105"
                                required
                            >
                                <option value="dilaporkan">Dilaporkan (Dalam Antrean)</option>
                                <option value="sedang_diperiksa">Sedang Diperiksa</option>
                                <option value="sedang_diperbaiki">Sedang Diperbaiki</option>
                                <option value="selesai">Selesai (Aset Kembali Baik)</option>
                                <option value="tidak_bisa_diperbaiki">Tidak Bisa Diperbaiki (Aset Rusak Berat)</option>
                            </select>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                                *Memilih "Selesai" akan mengubah kondisi fisik aset menjadi "Baik" secara otomatis.
                                <br />
                                *Memilih "Tidak Bisa Diperbaiki" akan mengubah kondisi fisik aset menjadi "Rusak Berat".
                            </span>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Tindakan / Solusi Teknisi</label>
                            <textarea
                                value={data.solusi}
                                onChange={(e) => setData('solusi', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-805 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-105"
                                rows="4"
                                placeholder="Jelaskan tindakan yang diambil, contoh: Kabel RAM dibersihkan, OS di-reinstall..."
                            ></textarea>
                            {errors.solusi && <span className="text-xs text-rose-500 mt-1 block">{errors.solusi}</span>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Tindakan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
