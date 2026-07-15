import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Index({ tickets, filters }) {
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

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-bold leading-tight text-slate-800 dark:text-slate-100">
                        Kelola Tiket Kerusakan Aset
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Tindak lanjuti pelaporan kendala perangkat lab, perbarui status pengerjaan, dan isi rincian solusi perbaikan teknis.
                    </p>
                </div>
            }
        >
            <Head title="Manajemen Tiket" />

            <div className="space-y-6">
                {/* Status Quick Filter Bar */}
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route('admin.tickets.index')}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold border transition ${
                            !filters.status
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400'
                        }`}
                    >
                        Semua Tiket
                    </Link>
                    {['dilaporkan', 'sedang_diperiksa', 'sedang_diperbaiki', 'selesai', 'tidak_bisa_diperbaiki'].map((statusOption) => (
                        <Link
                            key={statusOption}
                            href={route('admin.tickets.index', { status: statusOption })}
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

                {/* Tickets Table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                    <th className="px-6 py-4">Pelapor / Tanggal</th>
                                    <th className="px-6 py-4">Aset / Lokasi</th>
                                    <th className="px-6 py-4">Kerusakan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Solusi</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-900 font-medium">
                                {tickets.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                                            Tidak ada tiket laporan kerusakan terdaftar untuk status ini.
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.data.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-850 dark:text-slate-200 block">{ticket.nama_pelapor}</span>
                                                <span className="text-[10px] text-slate-400 mt-0.5 block">
                                                    {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{ticket.aset.kode_aset}</span>
                                                <span className="text-slate-800 dark:text-slate-200 mt-0.5 block font-bold">{ticket.aset.nama_aset}</span>
                                                <span className="text-[10px] text-slate-500 block">📍 {ticket.aset.laboratorium.nama_lab}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-655 dark:text-slate-400 max-w-xs break-words">
                                                "{ticket.deskripsi_kerusakan}"
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                                    ticket.status === 'dilaporkan' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' :
                                                    ticket.status === 'sedang_diperiksa' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' :
                                                    ticket.status === 'sedang_diperbaiki' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                                                    ticket.status === 'selesai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450' :
                                                    'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                                                }`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                                {ticket.solusi || <span className="text-slate-400 italic">Belum ada solusi</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openEditModal(ticket)}
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

                    {/* Pagination */}
                    {tickets.links && tickets.links.length > 3 && (
                        <div className="border-t border-slate-100 p-4 dark:border-slate-900 flex justify-center gap-1">
                            {tickets.links.map((link, idx) => (
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

            {/* Action Ticket Modal */}
            <Modal show={isEditOpen} onClose={closeEditModal}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 pb-3 dark:border-slate-900">
                        Tindak Lanjuti Kerusakan: {currentTicket?.aset.kode_aset}
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-xs space-y-2 mb-6 border border-slate-100 dark:border-slate-800">
                        <div><span className="font-bold text-slate-500">Nama Pelapor:</span> {currentTicket?.nama_pelapor}</div>
                        <div><span className="font-bold text-slate-500">Deskripsi Kendala:</span> "{currentTicket?.deskripsi_kerusakan}"</div>
                        <div><span className="font-bold text-slate-500">Kondisi Aset Saat Ini:</span> <span className="font-bold uppercase text-amber-700 dark:text-amber-450">{currentTicket?.aset.kondisi.replace('_', ' ')}</span></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Perbarui Status Penanganan</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
