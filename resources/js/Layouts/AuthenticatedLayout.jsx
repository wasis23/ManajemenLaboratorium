import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [toast, setToast] = useState(null);

    // Watch flash messages and show toast
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const isAdmin = user.role === 'admin';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Nav Bar */}
            <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            {/* Logo */}
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20">
                                        SL
                                    </div>
                                    <span className="hidden font-bold tracking-tight text-slate-800 dark:text-slate-200 sm:block">
                                        SIMLAB INDONUSA
                                    </span>
                                </Link>
                            </div>

                            {/* Desktop Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {isAdmin ? (
                                    <>
                                        <NavLink
                                            href={route('admin.dashboard')}
                                            active={route().current('admin.dashboard')}
                                        >
                                            Dashboard
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.laboratorium.index')}
                                            active={route().current('admin.laboratorium.*')}
                                        >
                                            Laboratorium
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.aset.index')}
                                            active={route().current('admin.aset.*')}
                                        >
                                            Inventaris Aset
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.tickets.index')}
                                            active={route().current('admin.tickets.*')}
                                        >
                                            Tiket Kerusakan
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.peminjaman.index')}
                                            active={route().current('admin.peminjaman.*')}
                                        >
                                            Peminjaman Alat
                                        </NavLink>
                                    </>
                                ) : (
                                    <>
                                        <NavLink
                                            href={route('dashboard')}
                                            active={route().current('dashboard')}
                                        >
                                            Dashboard Saya
                                        </NavLink>
                                        <NavLink
                                            href={route('katalog')}
                                            active={route().current('katalog')}
                                        >
                                            Katalog Alat
                                        </NavLink>
                                        <NavLink
                                            href={route('peminjaman.saya')}
                                            active={route().current('peminjaman.saya')}
                                        >
                                            Riwayat Pinjam
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-sm font-medium leading-4 text-slate-600 transition duration-150 ease-in-out hover:text-slate-800 hover:bg-slate-50 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-800"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    {user.name}
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                        {user.role}
                                                    </span>
                                                </div>

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile Saya
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Keluar (Log Out)
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger Icon */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition duration-150 ease-in-out hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 focus:outline-none dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-400 dark:focus:bg-slate-900 dark:focus:text-slate-400"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {isAdmin ? (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.dashboard')}
                                >
                                    Dashboard Admin
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.laboratorium.index')}
                                    active={route().current('admin.laboratorium.*')}
                                >
                                    Laboratorium
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.aset.index')}
                                    active={route().current('admin.aset.*')}
                                >
                                    Inventaris Aset
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.tickets.index')}
                                    active={route().current('admin.tickets.*')}
                                >
                                    Tiket Kerusakan
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.peminjaman.index')}
                                    active={route().current('admin.peminjaman.*')}
                                >
                                    Peminjaman Alat
                                </ResponsiveNavLink>
                            </>
                        ) : (
                            <>
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard Saya
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('katalog')}
                                    active={route().current('katalog')}
                                >
                                    Katalog Alat
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('peminjaman.saya')}
                                    active={route().current('peminjaman.saya')}
                                >
                                    Riwayat Pinjam
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="border-t border-slate-200 pb-1 pt-4 dark:border-slate-800">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-800 dark:text-slate-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                {user.email} ({user.role})
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile Saya
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Keluar (Log Out)
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sticky Toasts */}
            {toast && (
                <div className="fixed bottom-5 right-5 z-50 flex max-w-sm transform animate-bounce items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        toast.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50' : 'bg-rose-100 text-rose-600 dark:bg-rose-950/50'
                    }`}>
                        {toast.type === 'success' ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                        {toast.message}
                    </div>
                </div>
            )}

            {header && (
                <header className="bg-white shadow-sm border-b border-slate-100 dark:bg-slate-950 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
