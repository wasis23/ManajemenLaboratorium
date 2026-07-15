import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ laboratoriums }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentLab, setCurrentLab] = useState(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        nama_lab: '',
        lokasi: '',
        kapasitas_meja: 30,
    });

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
        post(route('admin.laboratorium.store'), {
            onSuccess: () => closeCreateModal(),
        });
    };

    const openEditModal = (lab) => {
        setCurrentLab(lab);
        setData({
            nama_lab: lab.nama_lab,
            lokasi: lab.lokasi,
            kapasitas_meja: lab.kapasitas_meja,
        });
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setCurrentLab(null);
        reset();
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.laboratorium.update', { laboratorium: currentLab.id }), {
            onSuccess: () => closeEditModal(),
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus laboratorium "${name}"? Seluruh aset di dalamnya juga akan terhapus secara otomatis.`)) {
            router.delete(route('admin.laboratorium.destroy', { laboratorium: id }));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                            Kelola Ruang Laboratorium
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Daftarkan ruangan laboratorium baru, atur tata letak meja, dan kapasitas maksimum praktik.
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/10 transition"
                    >
                        + Tambah Laboratorium
                    </button>
                </div>
            }
        >
            <Head title="Manajemen Laboratorium" />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                <th className="px-6 py-4">Nama Laboratorium</th>
                                <th className="px-6 py-4">Lokasi Ruangan</th>
                                <th className="px-6 py-4 text-center">Kapasitas Meja</th>
                                <th className="px-6 py-4 text-center">Aset Terdaftar</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                            {laboratoriums.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        Belum ada laboratorium terdaftar. Klik "+ Tambah Laboratorium" untuk memulai.
                                    </td>
                                </tr>
                            ) : (
                                laboratoriums.map((lab) => (
                                    <tr key={lab.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                                            {lab.nama_lab}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {lab.lokasi}
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-800 dark:text-slate-200">
                                            {lab.kapasitas_meja} Unit Meja
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 font-bold">
                                                {lab.asets_count} Item
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(lab)}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lab.id, lab.nama_lab)}
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
            </div>

            {/* Create Modal */}
            <Modal show={isCreateOpen} onClose={closeCreateModal}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 pb-3 dark:border-slate-900">
                        Tambah Laboratorium Baru
                    </h3>
                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nama Laboratorium</label>
                            <input
                                type="text"
                                value={data.nama_lab}
                                onChange={(e) => setData('nama_lab', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Lab Komputer 1"
                                required
                            />
                            {errors.nama_lab && <span className="text-xs text-rose-500 mt-1 block">{errors.nama_lab}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Lokasi Ruangan</label>
                            <input
                                type="text"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Contoh: Gedung A, Lantai 2"
                                required
                            />
                            {errors.lokasi && <span className="text-xs text-rose-500 mt-1 block">{errors.lokasi}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kapasitas Meja</label>
                            <input
                                type="number"
                                min="1"
                                value={data.kapasitas_meja}
                                onChange={(e) => setData('kapasitas_meja', parseInt(e.target.value))}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.kapasitas_meja && <span className="text-xs text-rose-500 mt-1 block">{errors.kapasitas_meja}</span>}
                        </div>

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

            {/* Edit Modal */}
            <Modal show={isEditOpen} onClose={closeEditModal}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 pb-3 dark:border-slate-900">
                        Edit Laboratorium: {currentLab?.nama_lab}
                    </h3>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Nama Laboratorium</label>
                            <input
                                type="text"
                                value={data.nama_lab}
                                onChange={(e) => setData('nama_lab', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.nama_lab && <span className="text-xs text-rose-500 mt-1 block">{errors.nama_lab}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Lokasi Ruangan</label>
                            <input
                                type="text"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.lokasi && <span className="text-xs text-rose-500 mt-1 block">{errors.lokasi}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kapasitas Meja</label>
                            <input
                                type="number"
                                min="1"
                                value={data.kapasitas_meja}
                                onChange={(e) => setData('kapasitas_meja', parseInt(e.target.value))}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.kapasitas_meja && <span className="text-xs text-rose-500 mt-1 block">{errors.kapasitas_meja}</span>}
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
                                {processing ? 'Memperbarui...' : 'Perbarui'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
