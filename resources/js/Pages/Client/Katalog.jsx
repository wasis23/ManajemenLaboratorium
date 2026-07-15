import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Katalog({ asets }) {
    const [selectedAset, setSelectedAset] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        aset_id: '',
        jumlah: 1,
        tanggal_pinjam: new Date().toISOString().split('T')[0],
        tanggal_kembali_rencana: '',
        catatan: '',
    });

    const openBorrowModal = (aset) => {
        setSelectedAset(aset);
        setData({
            aset_id: aset.id,
            jumlah: 1,
            tanggal_pinjam: new Date().toISOString().split('T')[0],
            tanggal_kembali_rencana: '',
            catatan: '',
        });
        setIsModalOpen(true);
    };

    const closeBorrowModal = () => {
        setIsModalOpen(false);
        setSelectedAset(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('peminjaman.store'), {
            onSuccess: () => {
                closeBorrowModal();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                        Katalog Alat & Perangkat Praktik
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pilih perangkat jaringan atau perkakas yang ingin Anda pinjam untuk praktikum mandiri maupun penugasan kelas.
                    </p>
                </div>
            }
        >
            <Head title="Katalog Alat" />

            <div className="space-y-6">
                {/* Catalog Grid */}
                {asets.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
                        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Tidak ada alat yang dapat dipinjam</h3>
                        <p className="mt-2 text-xs text-slate-500">Stok sedang kosong atau semua perangkat dalam kondisi rusak.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {asets.map((aset) => (
                            <div
                                key={aset.id}
                                className="rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-200"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                                            {aset.kode_aset}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                            Tersedia
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">
                                        {aset.nama_aset}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        📍 Ruang: {aset.laboratorium?.nama_lab}
                                    </p>

                                    {/* Specs preview */}
                                    {aset.spesifikasi && (
                                        <div className="mt-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg text-[11px] space-y-1 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-900">
                                            {aset.spesifikasi.brand && <div><span className="font-semibold">Brand:</span> {aset.spesifikasi.brand}</div>}
                                            {aset.spesifikasi.details && <div><span className="font-semibold">Detail:</span> {aset.spesifikasi.details}</div>}
                                            {aset.spesifikasi.ports && <div><span className="font-semibold">Ports:</span> {aset.spesifikasi.ports}</div>}
                                            {aset.spesifikasi.material && <div><span className="font-semibold">Material:</span> {aset.spesifikasi.material}</div>}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        Sisa Stok: <span className="font-bold text-slate-900 dark:text-white">{aset.stok} unit</span>
                                    </span>

                                    <button
                                        onClick={() => openBorrowModal(aset)}
                                        disabled={aset.stok <= 0}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white transition disabled:bg-slate-150 disabled:text-slate-400 dark:disabled:bg-slate-800"
                                    >
                                        Pinjam Alat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Borrow Form Modal */}
            <Modal show={isModalOpen} onClose={closeBorrowModal}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        Form Pengajuan Peminjaman
                    </h3>
                    <p className="text-xs text-slate-500 mb-6 border-b border-slate-100 pb-3 dark:border-slate-900">
                        Aset: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAset?.nama_aset}</span> ({selectedAset?.kode_aset})
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                                Jumlah Peminjaman (Pcs)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max={selectedAset?.stok || 1}
                                value={data.jumlah}
                                onChange={(e) => setData('jumlah', parseInt(e.target.value))}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            {errors.jumlah && <span className="text-xs text-rose-500 mt-1 block">{errors.jumlah}</span>}
                            <span className="text-[10px] text-slate-500 mt-1 block">Maksimal pinjam: {selectedAset?.stok} unit.</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                                    Tanggal Pinjam
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_pinjam}
                                    onChange={(e) => setData('tanggal_pinjam', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.tanggal_pinjam && <span className="text-xs text-rose-500 mt-1 block">{errors.tanggal_pinjam}</span>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                                    Rencana Pengembalian
                                </label>
                                <input
                                    type="date"
                                    value={data.tanggal_kembali_rencana}
                                    onChange={(e) => setData('tanggal_kembali_rencana', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.tanggal_kembali_rencana && <span className="text-xs text-rose-500 mt-1 block">{errors.tanggal_kembali_rencana}</span>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                                Catatan / Keperluan Praktikum
                            </label>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Tuliskan alasan peminjaman, contoh: Untuk pengerjaan tugas akhir konfigurasi OSPF."
                            ></textarea>
                            {errors.catatan && <span className="text-xs text-rose-500 mt-1 block">{errors.catatan}</span>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
                            <button
                                type="button"
                                onClick={closeBorrowModal}
                                className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition"
                            >
                                {processing ? 'Memproses...' : 'Kirim Pengajuan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
