import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Scan({ aset, workstationAssets = [], activeTickets = [] }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [activeTab, setActiveTab] = useState('report'); // 'report' or 'borrow'

    const reportForm = useForm({
        aset_id: workstationAssets.length > 0 ? workstationAssets[0].id : aset.id,
        nama_pelapor: user ? user.name : '',
        deskripsi_kerusakan: '',
    });

    const borrowForm = useForm({
        nama_peminjam: user ? user.name : '',
        nomor_induk: '',
        prodi_unit: '',
        kontak_peminjam: '',
        email_peminjam: user ? user.email : '',
        tanggal_pinjam: '',
        tanggal_kembali_rencana: '',
        tujuan_penggunaan: '',
        lokasi_penggunaan: aset.laboratorium ? `Meja ${aset.posisi_meja || ''} - ${aset.laboratorium.nama_lab}` : 'Dalam Laboratorium',
        setuju_syarat: false,
    });

    const handleReportSubmit = (e) => {
        e.preventDefault();
        reportForm.post(route('public.report', { kode_aset: aset.kode_aset }), {
            onSuccess: () => reportForm.reset('deskripsi_kerusakan'),
        });
    };

    const handleBorrowSubmit = (e) => {
        e.preventDefault();
        borrowForm.post(route('public.borrow', { kode_aset: aset.kode_aset }), {
            onSuccess: () => {
                borrowForm.reset();
            }
        });
    };

    return (
        <>
            <Head title={`Workstation: ${aset.kode_aset}`} />
            <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 py-12 transition-colors duration-200">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    
                    {/* Back Link */}
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali ke Katalog Publik
                        </Link>
                    </div>

                    {/* Flash messages */}
                    {reportForm.wasSuccessful && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 text-sm font-semibold">
                            🎉 Laporan kerusakan berhasil dikirim! Teknisi kami akan segera memeriksa.
                        </div>
                    )}

                    {borrowForm.wasSuccessful && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 text-sm font-semibold">
                            🎉 Pengajuan peminjaman workstation via barcode berhasil diajukan! Silakan hubungi admin laboratorium untuk persetujuan:{' '}
                            <a
                                href="https://wa.me/62859106886664?text=Halo%20Mas%20Wasis%2C%20saya%20baru%20saja%20membuat%20pengajuan%20peminjaman%20workstation%20via%20barcode%20di%20SIMLAB.%20Mohon%20untuk%20diperiksa%20dan%20disetujui.%20Terima%20kasih!"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-emerald-600 dark:hover:text-emerald-300 transition"
                            >
                                Mas Wasis (+62859106886664)
                            </a>
                        </div>
                    )}

                    {/* Main Asset Detail Card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        {/* Banner Header */}
                        <div className="bg-slate-900 px-6 py-8 text-white relative">
                            <div className="absolute top-0 right-0 p-4 font-mono text-4xl font-black text-white/5 tracking-wider select-none">
                                WORKSTATION
                            </div>
                            <span className="font-mono text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/25 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {aset.kode_aset}
                            </span>
                            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                                Set PC Client Statis & Perangkat Pendukung
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                📍 {aset.laboratorium?.nama_lab} &bull; {aset.laboratorium?.lokasi} {aset.posisi_meja ? `&bull; Meja Nomor ${aset.posisi_meja}` : ''}
                            </p>
                        </div>

                        {/* Workstation Devices Grid */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                                Daftar Perangkat Terkait di Meja Ini
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {workstationAssets.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={`rounded-xl border p-4 transition-all ${
                                            reportForm.data.aset_id === item.id 
                                                ? 'bg-blue-50/40 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800' 
                                                : 'bg-slate-50/50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-850'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-1">
                                            <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                                                {item.kode_aset}
                                            </span>
                                            <span className={`h-2 w-2 rounded-full ${
                                                item.kondisi === 'baik' ? 'bg-emerald-500' :
                                                item.kondisi === 'rusak_ringan' ? 'bg-amber-500' : 'bg-rose-500'
                                            }`} />
                                        </div>
                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mt-2 text-xs line-clamp-1">
                                            {item.nama_aset}
                                        </h4>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 uppercase tracking-wide">
                                            Kategori: {item.jenis_aset}
                                        </span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider block mt-2 text-slate-500">
                                            Kondisi: {item.kondisi.replace('_', ' ')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950">
                            <button
                                onClick={() => setActiveTab('report')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                                    activeTab === 'report'
                                        ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-950'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                📢 Laporkan Kerusakan
                            </button>
                            <button
                                onClick={() => setActiveTab('borrow')}
                                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                                    activeTab === 'borrow'
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-950'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                📦 Pinjam Workstation
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-6">
                            
                            {/* ACTIVE TICKETS WARNING */}
                            {activeTickets.length > 0 && (
                                <div className="mb-6 rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs dark:border-amber-950/40 dark:bg-amber-950/20">
                                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400 mb-2">
                                        <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Laporan Kendala Aktif Pada Set Ini
                                    </div>
                                    <div className="space-y-2 text-amber-700 dark:text-amber-300/90 font-medium">
                                        {activeTickets.map((t) => (
                                            <div key={t.id} className="border-l-2 border-amber-400 pl-2 py-0.5">
                                                Aset <span className="font-mono font-bold">({t.aset?.kode_aset})</span> &bull; Lapor: <span className="font-bold">{t.nama_pelapor}</span>: "{t.deskripsi_kerusakan}"
                                                <div className="text-[9px] text-amber-500/80 font-bold uppercase tracking-wider mt-0.5">
                                                    Status: {t.status.replace('_', ' ')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'report' ? (
                                <div className="space-y-4">
                                    <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">
                                        Formulir Pelaporan Kerusakan Perangkat
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Pilih perangkat yang bermasalah pada workstation ini, kemudian jelaskan kendala atau kerusakan yang dialami.
                                    </p>

                                    <form onSubmit={handleReportSubmit} className="space-y-4 mt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                                                Pilih Perangkat Yang Rusak
                                            </label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {workstationAssets.map((item) => (
                                                    <label 
                                                        key={item.id} 
                                                        className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition ${
                                                            reportForm.data.aset_id === item.id 
                                                                ? 'bg-rose-50/30 border-rose-300 dark:bg-rose-950/10 dark:border-rose-900' 
                                                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                                                        }`}
                                                    >
                                                        <input 
                                                            type="radio" 
                                                            name="aset_id"
                                                            value={item.id}
                                                            checked={reportForm.data.aset_id === item.id}
                                                            onChange={() => reportForm.setData('aset_id', item.id)}
                                                            className="text-rose-600 focus:ring-rose-500"
                                                        />
                                                        <div>
                                                            <span className="font-mono font-bold block">{item.kode_aset}</span>
                                                            <span className="text-[10px] text-slate-500">{item.nama_aset}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nama Pelapor</label>
                                            <input
                                                type="text"
                                                value={reportForm.data.nama_pelapor}
                                                onChange={(e) => reportForm.setData('nama_pelapor', e.target.value)}
                                                required
                                                disabled={user !== null}
                                                placeholder="Masukkan nama lengkap Anda..."
                                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
                                            />
                                            {reportForm.errors.nama_pelapor && <span className="text-xs text-rose-500 mt-1 block">{reportForm.errors.nama_pelapor}</span>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Deskripsi Kerusakan / Kendala</label>
                                            <textarea
                                                value={reportForm.data.deskripsi_kerusakan}
                                                onChange={(e) => reportForm.setData('deskripsi_kerusakan', e.target.value)}
                                                required
                                                rows="4"
                                                placeholder="Jelaskan kendala secara spesifik, misal: layar berkedip, tombol klik kiri mouse tidak responsif, OS tidak bisa booting..."
                                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                            ></textarea>
                                            {reportForm.errors.deskripsi_kerusakan && <span className="text-xs text-rose-500 mt-1 block">{reportForm.errors.deskripsi_kerusakan}</span>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={reportForm.processing}
                                            className="w-full flex justify-center items-center rounded-lg bg-rose-600 hover:bg-rose-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/10 transition"
                                        >
                                            {reportForm.processing ? 'Mengirim...' : 'Kirim Laporan Kerusakan'}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs dark:border-amber-950/40 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 font-semibold mb-4 leading-relaxed">
                                        ⚠️ PERINGATAN KETENTUAN:<br />
                                        Peminjaman alat melalui scan barcode ini hanya berlaku untuk penggunaan langsung di dalam ruangan laboratorium komputer. Perangkat/alat apapun TIDAK BOLEH dibawa ke luar ruangan lab dengan alasan apapun.
                                    </div>

                                    <h3 className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">
                                        Formulir Pengajuan Peminjaman Workstation (Dalam Lab)
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Lengkapi data diri Anda di bawah ini untuk meminjam set workstation lengkap di meja ini. Seluruh perangkat otomatis terpilih.
                                    </p>

                                    <form onSubmit={handleBorrowSubmit} className="space-y-4 mt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nama Lengkap</label>
                                                <input
                                                    type="text"
                                                    value={borrowForm.data.nama_peminjam}
                                                    onChange={(e) => borrowForm.setData('nama_peminjam', e.target.value)}
                                                    required
                                                    placeholder="Nama Lengkap..."
                                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {borrowForm.errors.nama_peminjam && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.nama_peminjam}</span>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nomor Induk (NIM / NIDN / NIK)</label>
                                                <input
                                                    type="text"
                                                    value={borrowForm.data.nomor_induk}
                                                    onChange={(e) => borrowForm.setData('nomor_induk', e.target.value)}
                                                    required
                                                    placeholder="NIM / NIDN / NIK..."
                                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {borrowForm.errors.nomor_induk && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.nomor_induk}</span>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Program Studi / Unit Kerja</label>
                                                <input
                                                    type="text"
                                                    value={borrowForm.data.prodi_unit}
                                                    onChange={(e) => borrowForm.setData('prodi_unit', e.target.value)}
                                                    required
                                                    placeholder="Informatika / Administrasi..."
                                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {borrowForm.errors.prodi_unit && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.prodi_unit}</span>}
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nomor WhatsApp Aktif</label>
                                                <input
                                                    type="text"
                                                    value={borrowForm.data.kontak_peminjam}
                                                    onChange={(e) => borrowForm.setData('kontak_peminjam', e.target.value)}
                                                    required
                                                    placeholder="Contoh: 0859..."
                                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {borrowForm.errors.kontak_peminjam && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.kontak_peminjam}</span>}
                                            </div>

                                            <div className="md:col-span-1">
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Email Aktif</label>
                                                <input
                                                    type="email"
                                                    value={borrowForm.data.email_peminjam}
                                                    onChange={(e) => borrowForm.setData('email_peminjam', e.target.value)}
                                                    required
                                                    placeholder="Email..."
                                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {borrowForm.errors.email_peminjam && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.email_peminjam}</span>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Tanggal & Jam Peminjaman (Pengambilan)</label>
                                                <input
                                                    type="datetime-local"
                                                    value={borrowForm.data.tanggal_pinjam}
                                                    onChange={(e) => borrowForm.setData('tanggal_pinjam', e.target.value)}
                                                    required
                                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {borrowForm.errors.tanggal_pinjam && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.tanggal_pinjam}</span>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Tanggal & Jam Rencana Pengembalian</label>
                                                <input
                                                    type="datetime-local"
                                                    value={borrowForm.data.tanggal_kembali_rencana}
                                                    onChange={(e) => borrowForm.setData('tanggal_kembali_rencana', e.target.value)}
                                                    required
                                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                {borrowForm.errors.tanggal_kembali_rencana && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.tanggal_kembali_rencana}</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Tujuan Penggunaan / Nama Kegiatan</label>
                                            <input
                                                type="text"
                                                value={borrowForm.data.tujuan_penggunaan}
                                                onChange={(e) => borrowForm.setData('tujuan_penggunaan', e.target.value)}
                                                required
                                                placeholder="Contoh: Praktikum Pemrograman, Ujian Sertifikasi..."
                                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                            {borrowForm.errors.tujuan_penggunaan && <span className="text-xs text-rose-500 mt-1 block">{borrowForm.errors.tujuan_penggunaan}</span>}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Lokasi Penggunaan Alat (Otomatis Terisi)</label>
                                            <input
                                                type="text"
                                                value={borrowForm.data.lokasi_penggunaan}
                                                disabled
                                                className="w-full rounded-lg border border-slate-200/80 bg-slate-100 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                            />
                                        </div>

                                        <div className="flex items-start gap-2 pt-2">
                                            <input
                                                type="checkbox"
                                                id="setuju_syarat"
                                                checked={borrowForm.data.setuju_syarat}
                                                onChange={(e) => borrowForm.setData('setuju_syarat', e.target.checked)}
                                                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                required
                                            />
                                            <label htmlFor="setuju_syarat" className="text-xs text-slate-500 dark:text-slate-400 leading-normal select-none">
                                                Saya menyatakan bertanggung jawab penuh untuk menjaga keutuhan seluruh aset pada workstation ini selama peminjaman berlangsung dan bersedia mengganti jika ada kehilangan atau kerusakan karena kelalaian.
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!borrowForm.data.setuju_syarat || borrowForm.processing}
                                            className={`w-full flex justify-center items-center rounded-lg py-2.5 text-sm font-semibold text-white shadow-md transition ${
                                                borrowForm.data.setuju_syarat 
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10' 
                                                    : 'bg-slate-350 cursor-not-allowed dark:bg-slate-800'
                                            }`}
                                        >
                                            {borrowForm.processing ? 'Mengirim...' : 'Kirim Pengajuan Peminjaman'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
