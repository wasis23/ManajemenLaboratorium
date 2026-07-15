import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth, laboratoriums, asets, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedLab, setSelectedLab] = useState(filters.laboratorium_id || '');
    const [selectedJenis, setSelectedJenis] = useState(filters.jenis_aset || '');
    const [selectedKondisi, setSelectedKondisi] = useState(filters.kondisi || '');
    const [simulatedCode, setSimulatedCode] = useState('');

    const handleFilterChange = (newFilters) => {
        router.get(route('public.catalog'), {
            search,
            laboratorium_id: selectedLab,
            jenis_aset: selectedJenis,
            kondisi: selectedKondisi,
            ...newFilters
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange({ search });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedLab('');
        setSelectedJenis('');
        setSelectedKondisi('');
        router.get(route('public.catalog'));
    };

    const handleSimulateScan = (e) => {
        e.preventDefault();
        if (simulatedCode) {
            router.get(route('public.scan', { kode_aset: simulatedCode.trim().toUpperCase() }));
        }
    };

    return (
        <>
            <Head title="SIMLAB - Politeknik Indonusa Surakarta" />
            <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
                {/* Header / Navbar */}
                <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20">
                                    SL
                                </div>
                                <div>
                                    <h1 className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base leading-none sm:text-lg">
                                        SIMLAB
                                    </h1>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                                        Politeknik Indonusa Surakarta
                                    </span>
                                </div>
                            </div>
                            <nav className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg bg-slate-100 hover:bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                                    >
                                        Dashboard Saya
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 py-20 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent"></div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="max-w-3xl">
                            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-4 uppercase tracking-wider">
                                Portal Manajemen Laboratorium
                              </span>
                            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                                SIMLAB Komputer & Jaringan
                            </h2>
                            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
                                Sistem manajemen laboratorium digital untuk melacak spesifikasi komputer client, ketersediaan kabel/alat jaringan, peminjaman perangkat routerboard, dan penanganan kerusakan aset terintegrasi QR Code.
                            </p>

                            {/* QR Scanner Simulator Card */}
                            <div className="mt-10 rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md max-w-md shadow-xl">
                                <h3 className="text-sm font-semibold tracking-wide uppercase text-blue-400 flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    QR Code Scan Simulator
                                </h3>
                                <p className="mt-2 text-xs text-slate-300">
                                    Simulasikan scan QR Code yang tertera pada meja laboratorium / router untuk melapor kendala secara langsung.
                                </p>
                                <form onSubmit={handleSimulateScan} className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Contoh: LAB01-PC03"
                                        value={simulatedCode}
                                        onChange={(e) => setSimulatedCode(e.target.value)}
                                        className="flex-1 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold transition"
                                    >
                                        Scan QR
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Filter and Catalog Section */}
                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-8 md:flex-row">
                        {/* Sidebar Filters */}
                        <div className="w-full md:w-64 shrink-0">
                            <div className="rounded-xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-base">Filter Katalog</h3>

                                <form onSubmit={handleSearchSubmit} className="space-y-4">
                                    {/* Search */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Cari Nama / Kode</label>
                                        <div className="flex gap-1.5">
                                            <input
                                                type="text"
                                                placeholder="Cari..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button type="submit" className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 text-white transition text-sm">
                                                Go
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lab Filter */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Laboratorium</label>
                                        <select
                                            value={selectedLab}
                                            onChange={(e) => {
                                                setSelectedLab(e.target.value);
                                                handleFilterChange({ laboratorium_id: e.target.value });
                                            }}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Ruangan</option>
                                            {laboratoriums.map((lab) => (
                                                <option key={lab.id} value={lab.id}>{lab.nama_lab}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Jenis Aset */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Jenis Aset</label>
                                        <select
                                            value={selectedJenis}
                                            onChange={(e) => {
                                                setSelectedJenis(e.target.value);
                                                handleFilterChange({ jenis_aset: e.target.value });
                                            }}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Jenis</option>
                                            <option value="statis">Statis (PC, AC, Proyektor)</option>
                                            <option value="loanable">Loanable (Bisa Dipinjam)</option>
                                            <option value="consumable">Consumable (Bahan Habis)</option>
                                        </select>
                                    </div>

                                    {/* Kondisi */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kondisi</label>
                                        <select
                                            value={selectedKondisi}
                                            onChange={(e) => {
                                                setSelectedKondisi(e.target.value);
                                                handleFilterChange({ kondisi: e.target.value });
                                            }}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Semua Kondisi</option>
                                            <option value="baik">Baik</option>
                                            <option value="rusak_ringan">Rusak Ringan</option>
                                            <option value="rusak_berat">Rusak Berat</option>
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                                    >
                                        Reset Filter
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Catalog Cards Grid */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                                    Daftar Inventaris Aset ({asets.total})
                                </h3>
                            </div>

                            {asets.data.length === 0 ? (
                                <div className="rounded-xl border-2 border-dashed border-slate-200/80 p-12 text-center dark:border-slate-800">
                                    <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Tidak ada aset ditemukan</h3>
                                    <p className="mt-2 text-xs text-slate-500">Coba ubah keyword pencarian atau filter yang Anda gunakan.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {asets.data.map((aset) => (
                                        <div
                                            key={aset.id}
                                            className="rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200"
                                        >
                                            <div>
                                                {/* Header Badges */}
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                                                        {aset.kode_aset}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        {/* Jenis Badge */}
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                                            aset.jenis_aset === 'statis' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                                            aset.jenis_aset === 'loanable' ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400' :
                                                            'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                                                        }`}>
                                                            {aset.jenis_aset}
                                                        </span>
                                                        {/* Kondisi Badge */}
                                                        <span className={`h-2.5 w-2.5 rounded-full ${
                                                            aset.kondisi === 'baik' ? 'bg-emerald-500' :
                                                            aset.kondisi === 'rusak_ringan' ? 'bg-amber-500' :
                                                            'bg-rose-500'
                                                        }`} title={`Kondisi: ${aset.kondisi}`}></span>
                                                    </div>
                                                </div>

                                                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm leading-snug">
                                                    {aset.nama_aset}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    📍 {aset.laboratorium?.nama_lab || 'Lokasi tidak diset'}
                                                </p>

                                                {/* Specifications preview */}
                                                {aset.spesifikasi && (
                                                    <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-900 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                                                        {aset.jenis_aset === 'statis' ? (
                                                            <>
                                                                {aset.spesifikasi.cpu && <div><span className="font-semibold">CPU:</span> {aset.spesifikasi.cpu}</div>}
                                                                {aset.spesifikasi.ram && <div><span className="font-semibold">RAM:</span> {aset.spesifikasi.ram}</div>}
                                                                {aset.spesifikasi.storage && <div><span className="font-semibold">Storage:</span> {aset.spesifikasi.storage}</div>}
                                                                {aset.spesifikasi.os && <div><span className="font-semibold">OS:</span> {aset.spesifikasi.os}</div>}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {aset.spesifikasi.brand && <div><span className="font-semibold">Brand:</span> {aset.spesifikasi.brand}</div>}
                                                                {aset.spesifikasi.details && <div><span className="font-semibold">Detail:</span> {aset.spesifikasi.details}</div>}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action / Footer */}
                                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                                <span className="text-[11px] text-slate-500">
                                                    Stok: <span className="font-bold">{aset.stok}</span>
                                                    {aset.posisi_meja && ` | Meja ${aset.posisi_meja}`}
                                                </span>

                                                <Link
                                                    href={route('public.scan', { kode_aset: aset.kode_aset })}
                                                    className="inline-flex items-center gap-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-900 dark:hover:bg-blue-600 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                                                >
                                                    Detail & Laporkan
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination Links */}
                            {asets.links && asets.links.length > 3 && (
                                <div className="mt-8 flex justify-center gap-1">
                                    {asets.links.map((link, idx) => (
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
                    </div>
                </main>
            </div>
        </>
    );
}
