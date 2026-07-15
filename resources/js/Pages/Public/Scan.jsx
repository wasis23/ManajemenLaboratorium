import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Scan({ aset, activeTickets }) {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        nama_pelapor: user ? user.name : '',
        deskripsi_kerusakan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('public.report', { kode_aset: aset.kode_aset }), {
            onSuccess: () => reset('deskripsi_kerusakan'),
        });
    };

    return (
        <>
            <Head title={`Scan Aset: ${aset.kode_aset}`} />
            <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 py-12 transition-colors duration-200">
                <div className="mx-auto max-w-2xl px-4 sm:px-6">
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

                    {/* Main Asset Detail Card */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        {/* Hero Banner Header */}
                        <div className="bg-slate-900 px-6 py-8 text-white relative">
                            <div className="absolute top-0 right-0 p-4 font-mono text-5xl font-black text-white/5 tracking-wider select-none">
                                QR SCAN
                            </div>
                            <span className="font-mono text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/25 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {aset.kode_aset}
                            </span>
                            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                                {aset.nama_aset}
                            </h2>
                            <p className="mt-1 text-sm text-slate-400">
                                📍 {aset.laboratorium?.nama_lab} &bull; {aset.laboratorium?.lokasi}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-5 dark:border-slate-800 text-sm">
                                <div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Status Aset</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`h-3 w-3 rounded-full ${
                                            aset.kondisi === 'baik' ? 'bg-emerald-500' :
                                            aset.kondisi === 'rusak_ringan' ? 'bg-amber-500' :
                                            'bg-rose-500'
                                        }`}></span>
                                        <span className="font-semibold uppercase tracking-wider text-xs">
                                            {aset.kondisi === 'baik' ? 'Baik' :
                                             aset.kondisi === 'rusak_ringan' ? 'Rusak Ringan' : 'Rusak Berat'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Posisi Meja / Lokasi</span>
                                    <span className="font-semibold mt-1 block">
                                        {aset.posisi_meja ? `Meja Nomor ${aset.posisi_meja}` : 'Aset Portable / Logistik'}
                                    </span>
                                </div>
                            </div>

                            {/* Specifications */}
                            {aset.spesifikasi && (
                                <div className="mt-5">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Spesifikasi Alat</h3>
                                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 text-xs space-y-2">
                                        {aset.jenis_aset === 'statis' ? (
                                            <>
                                                {aset.spesifikasi.cpu && <div className="flex justify-between"><span className="text-slate-500">Processor (CPU):</span> <span className="font-semibold">{aset.spesifikasi.cpu}</span></div>}
                                                {aset.spesifikasi.ram && <div className="flex justify-between"><span className="text-slate-500">Memori (RAM):</span> <span className="font-semibold">{aset.spesifikasi.ram}</span></div>}
                                                {aset.spesifikasi.storage && <div className="flex justify-between"><span className="text-slate-500">Penyimpanan:</span> <span className="font-semibold">{aset.spesifikasi.storage}</span></div>}
                                                {aset.spesifikasi.gpu && <div className="flex justify-between"><span className="text-slate-500">Kartu Grafis (GPU):</span> <span className="font-semibold">{aset.spesifikasi.gpu}</span></div>}
                                                {aset.spesifikasi.os && <div className="flex justify-between"><span className="text-slate-500">Sistem Operasi (OS):</span> <span className="font-semibold">{aset.spesifikasi.os}</span></div>}
                                            </>
                                        ) : (
                                            <>
                                                {aset.spesifikasi.brand && <div className="flex justify-between"><span className="text-slate-500">Merk / Brand:</span> <span className="font-semibold">{aset.spesifikasi.brand}</span></div>}
                                                {aset.spesifikasi.details && <div className="flex justify-between"><span className="text-slate-500">Keterangan:</span> <span className="font-semibold">{aset.spesifikasi.details}</span></div>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Active Tickets (Damage Reports) Warning */}
                            {activeTickets.length > 0 && (
                                <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs dark:border-amber-950/40 dark:bg-amber-950/20">
                                    <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-400 mb-2">
                                        <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Kendala Sedang Dalam Penanganan
                                    </div>
                                    <div className="space-y-2 text-amber-700 dark:text-amber-300/90 font-medium">
                                        {activeTickets.map((t) => (
                                            <div key={t.id} className="border-l-2 border-amber-400 pl-2 py-0.5">
                                                Laporan dari <span className="font-bold">{t.nama_pelapor}</span>: "{t.deskripsi_kerusakan}"
                                                <div className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider mt-0.5">
                                                    Status: {t.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Report Damage Form */}
                            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-900">
                                <h3 className="font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Laporkan Kerusakan Meja/PC Ini</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                    Jika Anda menemukan kendala fisik atau software pada aset ini, silakan isi laporan berikut untuk ditindaklanjuti laboran.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nama Pelapor</label>
                                        <input
                                            type="text"
                                            value={data.nama_pelapor}
                                            onChange={(e) => setData('nama_pelapor', e.target.value)}
                                            required
                                            disabled={user !== null}
                                            placeholder="Masukkan nama Anda..."
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-60"
                                        />
                                        {errors.nama_pelapor && <span className="text-xs text-rose-500 mt-1 block">{errors.nama_pelapor}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Deskripsi Kerusakan / Kendala</label>
                                        <textarea
                                            value={data.deskripsi_kerusakan}
                                            onChange={(e) => setData('deskripsi_kerusakan', e.target.value)}
                                            required
                                            rows="4"
                                            placeholder="Jelaskan secara detail, misal: komputer tiba-tiba bluescreen setelah 5 menit, keyboard tombol enter keras, dll..."
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        ></textarea>
                                        {errors.deskripsi_kerusakan && <span className="text-xs text-rose-500 mt-1 block">{errors.deskripsi_kerusakan}</span>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex justify-center items-center rounded-lg bg-rose-600 hover:bg-rose-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/10 transition"
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Laporan Kerusakan'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
