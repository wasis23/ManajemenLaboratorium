import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ asets, laboratoriums, filters }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isQrOpen, setIsQrOpen] = useState(false);
    const [currentAset, setCurrentAset] = useState(null);

    const [search, setSearch] = useState(filters.search || '');
    const [selectedLab, setSelectedLab] = useState(filters.laboratorium_id || '');
    const [selectedJenis, setSelectedJenis] = useState(filters.jenis_aset || '');
    const [selectedKondisi, setSelectedKondisi] = useState(filters.kondisi || '');

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        laboratorium_id: '',
        kode_aset: '',
        nama_aset: '',
        jenis_aset: 'PC',
        kondisi: 'baik',
        stok: 1,
        posisi_meja: '',
        spec_cpu: '',
        spec_ram: '',
        spec_storage: '',
        spec_gpu: '',
        spec_os: '',
        spec_brand: '',
        spec_details: '',
    });

    const handleFilterChange = (newFilters) => {
        router.get(route('admin.aset.index'), {
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
        router.get(route('admin.aset.index'));
    };

    const openCreateModal = () => {
        reset();
        setIsCreateOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateOpen(false);
        reset();
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        post(route('admin.aset.store'), {
            onSuccess: () => closeCreateModal(),
        });
    };

    const openEditModal = (aset) => {
        setCurrentAset(aset);
        setData({
            laboratorium_id: aset.laboratorium_id,
            kode_aset: aset.kode_aset,
            nama_aset: aset.nama_aset,
            jenis_aset: aset.jenis_aset,
            kondisi: aset.kondisi,
            stok: aset.stok,
            posisi_meja: aset.posisi_meja || '',
            spec_cpu: aset.spesifikasi?.cpu || '',
            spec_ram: aset.spesifikasi?.ram || '',
            spec_storage: aset.spesifikasi?.storage || '',
            spec_gpu: aset.spesifikasi?.gpu || '',
            spec_os: aset.spesifikasi?.os || '',
            spec_brand: aset.spesifikasi?.brand || '',
            spec_details: aset.spesifikasi?.details || '',
        });
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setCurrentAset(null);
        reset();
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.aset.update', { aset: currentAset.id }), {
            onSuccess: () => closeEditModal(),
        });
    };

    const handleDelete = (id, code) => {
        if (confirm(`Apakah Anda yakin ingin menghapus aset dengan kode "${code}"?`)) {
            router.delete(route('admin.aset.destroy', { aset: id }));
        }
    };

    const openQrModal = (aset) => {
        setCurrentAset(aset);
        setIsQrOpen(true);
    };

    const closeQrModal = () => {
        setIsQrOpen(false);
        setCurrentAset(null);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                            Inventarisasi & Katalog Aset
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Lacak PC client statis, routerboard, kabel crimping, proyektor, dan buat QR Label untuk pelaporan kendala.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 transition"
                    >
                        + Tambah Aset
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Aset" />

            <div className="space-y-6">
                {/* Search & Filters Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 shadow-sm">
                    <form onSubmit={handleSearchSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Cari Kata Kunci</label>
                            <input
                                type="text"
                                placeholder="Kode / nama aset..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Laboratorium</label>
                            <select
                                value={selectedLab}
                                onChange={(e) => {
                                    setSelectedLab(e.target.value);
                                    handleFilterChange({ laboratorium_id: e.target.value });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                            >
                                <option value="">Semua Ruangan</option>
                                {laboratoriums.map((l) => (
                                    <option key={l.id} value={l.id}>{l.nama_lab}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Jenis Aset</label>
                            <select
                                value={selectedJenis}
                                onChange={(e) => {
                                    setSelectedJenis(e.target.value);
                                    handleFilterChange({ jenis_aset: e.target.value });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                            >
                                <option value="">Semua Jenis</option>
                                <option value="PC">PC</option>
                                <option value="Monitor">Monitor</option>
                                <option value="Keyboard">Keyboard</option>
                                <option value="Mouse">Mouse</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kondisi</label>
                            <select
                                value={selectedKondisi}
                                onChange={(e) => {
                                    setSelectedKondisi(e.target.value);
                                    handleFilterChange({ kondisi: e.target.value });
                                }}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                            >
                                <option value="">Semua Kondisi</option>
                                <option value="baik">Baik</option>
                                <option value="rusak_ringan">Rusak Ringan</option>
                                <option value="rusak_berat">Rusak Berat</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-xs font-semibold text-white transition"
                            >
                                Cari
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition font-semibold"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* Assets Table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                    <th className="px-6 py-4">Kode Aset</th>
                                    <th className="px-6 py-4">Nama Aset</th>
                                    <th className="px-6 py-4">Laboratorium</th>
                                    <th className="px-6 py-4">Kategori</th>
                                    <th className="px-6 py-4">Kondisi</th>
                                    <th className="px-6 py-4 text-center">Stok</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                                {asets.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-slate-500">
                                            Tidak ada aset terdaftar dengan filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    asets.data.map((aset) => (
                                        <tr key={aset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => openQrModal(aset)}
                                                    className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                                                    title="Lihat Label QR Code"
                                                >
                                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {aset.kode_aset}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-800 dark:text-slate-200 block">{aset.nama_aset}</span>
                                                {aset.posisi_meja && <span className="text-[10px] text-slate-400">Meja: {aset.posisi_meja}</span>}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                                {aset.laboratorium?.nama_lab}
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
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`h-2.5 w-2.5 rounded-full ${
                                                        aset.kondisi === 'baik' ? 'bg-emerald-500' :
                                                        aset.kondisi === 'rusak_ringan' ? 'bg-amber-500' :
                                                        'bg-rose-500'
                                                    }`}></span>
                                                    <span className="font-semibold uppercase text-[10px] tracking-wider">
                                                        {aset.kondisi.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-slate-200">
                                                {aset.stok}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => openEditModal(aset)}
                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(aset.id, aset.kode_aset)}
                                                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-350"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {asets.links && asets.links.length > 3 && (
                        <div className="border-t border-slate-100 p-4 dark:border-slate-900 flex justify-center gap-1">
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

            {/* Create Asset Modal */}
            <Modal show={isCreateOpen} onClose={closeCreateModal}>
                <div className="p-6 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 pb-3 dark:border-slate-900">
                        Tambah Aset Baru
                    </h3>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Laboratorium</label>
                                <select
                                    value={data.laboratorium_id}
                                    onChange={(e) => setData('laboratorium_id', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Pilih Ruangan</option>
                                    {laboratoriums.map((l) => (
                                        <option key={l.id} value={l.id}>{l.nama_lab}</option>
                                    ))}
                                </select>
                                {errors.laboratorium_id && <span className="text-xs text-rose-500 mt-1 block">{errors.laboratorium_id}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kode Aset / Label</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: LAB01-PC05"
                                    value={data.kode_aset}
                                    onChange={(e) => setData('kode_aset', e.target.value.toUpperCase())}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.kode_aset && <span className="text-xs text-rose-500 mt-1 block">{errors.kode_aset}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nama Aset / Alat</label>
                                <input
                                    type="text"
                                    value={data.nama_aset}
                                    onChange={(e) => setData('nama_aset', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contoh: PC Client Lenovo Core i5"
                                    required
                                />
                                {errors.nama_aset && <span className="text-xs text-rose-500 mt-1 block">{errors.nama_aset}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kategori Aset</label>
                                <select
                                    value={data.jenis_aset}
                                    onChange={(e) => setData('jenis_aset', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="PC">PC</option>
                                    <option value="Monitor">Monitor</option>
                                    <option value="Keyboard">Keyboard</option>
                                    <option value="Mouse">Mouse</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Stok</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stok}
                                    onChange={(e) => setData('stok', parseInt(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.stok && <span className="text-xs text-rose-500 mt-1 block">{errors.stok}</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kondisi</label>
                                <select
                                    value={data.kondisi}
                                    onChange={(e) => setData('kondisi', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="baik">Baik</option>
                                    <option value="rusak_ringan">Rusak Ringan</option>
                                    <option value="rusak_berat">Rusak Berat</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nomor Meja</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.posisi_meja}
                                    onChange={(e) => setData('posisi_meja', e.target.value ? parseInt(e.target.value) : '')}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Opsional"
                                />
                            </div>
                        </div>

                        {/* Conditional Specs Input */}
                        {data.jenis_aset === 'PC' ? (
                            <div className="border-t border-slate-100 pt-4 dark:border-slate-900 space-y-4">
                                <h4 className="text-xs font-bold text-slate-455 uppercase tracking-wide">Spesifikasi PC Client</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Processor (CPU)</label>
                                        <input
                                            type="text"
                                            value={data.spec_cpu}
                                            onChange={(e) => setData('spec_cpu', e.target.value)}
                                            placeholder="Contoh: Intel Core i5-11400"
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Memori (RAM)</label>
                                        <input
                                            type="text"
                                            value={data.spec_ram}
                                            onChange={(e) => setData('spec_ram', e.target.value)}
                                            placeholder="Contoh: 16GB DDR4"
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Penyimpanan</label>
                                        <input
                                            type="text"
                                            value={data.spec_storage}
                                            onChange={(e) => setData('spec_storage', e.target.value)}
                                            placeholder="Contoh: SSD 512GB NVMe"
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">VGA / GPU</label>
                                        <input
                                            type="text"
                                            value={data.spec_gpu}
                                            onChange={(e) => setData('spec_gpu', e.target.value)}
                                            placeholder="Contoh: Integrated Intel UHD"
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sistem Operasi (OS)</label>
                                        <input
                                            type="text"
                                            value={data.spec_os}
                                            onChange={(e) => setData('spec_os', e.target.value)}
                                            placeholder="Contoh: Windows 11 Pro"
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-slate-100 pt-4 dark:border-slate-900 space-y-4">
                                <h4 className="text-xs font-bold text-slate-455 uppercase tracking-wide">Detail Alat (Monitor / Keyboard / Mouse)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Merk / Brand</label>
                                        <input
                                            type="text"
                                            value={data.spec_brand}
                                            onChange={(e) => setData('spec_brand', e.target.value)}
                                            placeholder="Contoh: Mikrotik / Belden"
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Detail Keterangan</label>
                                        <input
                                            type="text"
                                            value={data.spec_details}
                                            onChange={(e) => setData('spec_details', e.target.value)}
                                            placeholder="Contoh: Routerboard RB951Ui-2HnD"
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
                            <button
                                type="button"
                                onClick={closeCreateModal}
                                className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Asset Modal */}
            <Modal show={isEditOpen} onClose={closeEditModal}>
                <div className="p-6 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 pb-3 dark:border-slate-900">
                        Edit Aset: {currentAset?.kode_aset}
                    </h3>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Laboratorium</label>
                                <select
                                    value={data.laboratorium_id}
                                    onChange={(e) => setData('laboratorium_id', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                                    required
                                >
                                    {laboratoriums.map((l) => (
                                        <option key={l.id} value={l.id}>{l.nama_lab}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kode Aset / Label</label>
                                <input
                                    type="text"
                                    value={data.kode_aset}
                                    onChange={(e) => setData('kode_aset', e.target.value.toUpperCase())}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                                    required
                                />
                                {errors.kode_aset && <span className="text-xs text-rose-500 mt-1 block">{errors.kode_aset}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nama Aset / Alat</label>
                                <input
                                    type="text"
                                    value={data.nama_aset}
                                    onChange={(e) => setData('nama_aset', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                                    required
                                />
                                {errors.nama_aset && <span className="text-xs text-rose-500 mt-1 block">{errors.nama_aset}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kategori Aset</label>
                                <select
                                    value={data.jenis_aset}
                                    onChange={(e) => setData('jenis_aset', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                                    required
                                >
                                    <option value="PC">PC</option>
                                    <option value="Monitor">Monitor</option>
                                    <option value="Keyboard">Keyboard</option>
                                    <option value="Mouse">Mouse</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Stok</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stok}
                                    onChange={(e) => setData('stok', parseInt(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kondisi</label>
                                <select
                                    value={data.kondisi}
                                    onChange={(e) => setData('kondisi', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none"
                                >
                                    <option value="baik">Baik</option>
                                    <option value="rusak_ringan">Rusak Ringan</option>
                                    <option value="rusak_berat">Rusak Berat</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nomor Meja</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.posisi_meja}
                                    onChange={(e) => setData('posisi_meja', e.target.value ? parseInt(e.target.value) : '')}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
                                />
                            </div>
                        </div>

                        {data.jenis_aset === 'PC' ? (
                            <div className="border-t border-slate-100 pt-4 dark:border-slate-900 space-y-4">
                                <h4 className="text-xs font-bold text-slate-455 uppercase tracking-wide">Spesifikasi PC Client</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Processor (CPU)</label>
                                        <input
                                            type="text"
                                            value={data.spec_cpu}
                                            onChange={(e) => setData('spec_cpu', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Memori (RAM)</label>
                                        <input
                                            type="text"
                                            value={data.spec_ram}
                                            onChange={(e) => setData('spec_ram', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Penyimpanan</label>
                                        <input
                                            type="text"
                                            value={data.spec_storage}
                                            onChange={(e) => setData('spec_storage', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">VGA / GPU</label>
                                        <input
                                            type="text"
                                            value={data.spec_gpu}
                                            onChange={(e) => setData('spec_gpu', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sistem Operasi (OS)</label>
                                        <input
                                            type="text"
                                            value={data.spec_os}
                                            onChange={(e) => setData('spec_os', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-slate-100 pt-4 dark:border-slate-900 space-y-4">
                                <h4 className="text-xs font-bold text-slate-455 uppercase tracking-wide">Detail Alat (Monitor / Keyboard / Mouse)</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Merk / Brand</label>
                                        <input
                                            type="text"
                                            value={data.spec_brand}
                                            onChange={(e) => setData('spec_brand', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Detail Keterangan</label>
                                        <input
                                            type="text"
                                            value={data.spec_details}
                                            onChange={(e) => setData('spec_details', e.target.value)}
                                            className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

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
                                {processing ? 'Memperbarui...' : 'Perbarui'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* QR Label Print Modal */}
            <Modal show={isQrOpen} onClose={closeQrModal}>
                <div className="p-6 flex flex-col items-center">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Print QR Label Aset</h3>

                    {/* QR Code Printable Label Card */}
                    <div id="printable-qr-label" className="border-4 border-slate-900 bg-white p-6 rounded-2xl flex flex-col items-center max-w-xs text-slate-900 shadow-xl">
                        <span className="font-extrabold text-xs uppercase tracking-widest text-slate-500">SIMLAB INDONUSA</span>
                        <h4 className="font-black text-sm tracking-tight text-center mt-1 max-w-[200px] truncate">{currentAset?.nama_aset}</h4>

                        {/* Real QR API image based on app scan URL */}
                        <div className="mt-4 p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                            {currentAset && (
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/scan/${currentAset.kode_aset}`}
                                    alt={`QR Code ${currentAset.kode_aset}`}
                                    className="h-32 w-32 object-contain"
                                />
                            )}
                        </div>

                        <span className="font-mono text-base font-black tracking-wider text-blue-650 mt-4 px-3 py-1 bg-slate-50 rounded border border-slate-150">
                            {currentAset?.kode_aset}
                        </span>
                        
                        <p className="mt-3 text-[10px] font-bold text-slate-400 text-center uppercase tracking-wide leading-relaxed">
                            📍 {currentAset?.laboratorium?.nama_lab}
                            <br />
                            Scan QR untuk Melapor Kerusakan
                        </p>
                    </div>

                    <div className="mt-6 flex gap-3 w-full border-t border-slate-100 pt-4 dark:border-slate-900">
                        <button
                            type="button"
                            onClick={closeQrModal}
                            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition text-slate-700 dark:text-slate-350"
                        >
                            Tutup
                        </button>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-sm font-semibold text-white transition shadow-md shadow-blue-500/10"
                        >
                            Cetak Label
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
