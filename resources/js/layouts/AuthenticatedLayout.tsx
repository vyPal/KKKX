import { User } from '@/types';
import { InertiaLinkProps, Link } from '@inertiajs/react';
import React, { useState } from 'react';

interface NavLinkProps extends InertiaLinkProps {
    active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ active = false, children, ...props }) => {
    return (
        <Link
            {...props}
            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm leading-5 font-medium transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700'
            }`}
        >
            {children}
        </Link>
    );
};

interface ResponsiveNavLinkProps extends NavLinkProps {}

const ResponsiveNavLink: React.FC<ResponsiveNavLinkProps> = ({ active = false, children, ...props }) => {
    return (
        <Link
            {...props}
            className={`block w-full border-l-4 py-2 pr-4 pl-3 text-left text-sm leading-5 font-medium transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800'
            }`}
        >
            {children}
        </Link>
    );
};

interface DropdownProps {
    children: React.ReactNode;
    trigger: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children, trigger }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <div onClick={() => setOpen(!open)}>{trigger}</div>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg" onClick={() => setOpen(false)}>
                    {children}
                </div>
            )}
        </div>
    );
};

interface DropdownLinkProps extends InertiaLinkProps {}

const DropdownLink: React.FC<DropdownLinkProps> = ({ href, children, ...props }) => {
    return (
        <Link
            href={href}
            className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            {...props}
        >
            {children}
        </Link>
    );
};

interface AuthenticatedLayoutProps {
    auth: {
        user: User;
    };
    header?: React.ReactNode;
    children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ auth, header, children }) => {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            {auth.user.role === 'admin' && (
                                <NavLink href={route('admin.posts.index')} active={route().current('admin.posts.*')}>
                                    Admin
                                </NavLink>
                            )}

                            <div className="hidden space-x-8 sm:ml-10 sm:flex">
                                <NavLink href={route('posts.index')} active={route().current('posts.index')}>
                                    Timeline
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative ml-3">
                                <Dropdown
                                    trigger={
                                        <button className="flex items-center text-sm font-medium text-gray-500 transition duration-150 ease-in-out hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none">
                                            <div>{auth.user.username}</div>
                                            <div className="ml-1">
                                                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </button>
                                    }
                                >
                                    <DropdownLink href={route('profile.edit')}>Profile</DropdownLink>
                                    <DropdownLink href={route('logout')} method="post" as="button">
                                        Log Out
                                    </DropdownLink>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
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

                <div className={`sm:hidden ${showingNavigationDropdown ? 'block' : 'hidden'}`}>
                    <div className="space-y-1 pt-2 pb-3">
                        <ResponsiveNavLink href={route('posts.index')} active={route().current('posts.index')}>
                            Timeline
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pt-4 pb-1">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{auth.user.username}</div>
                            <div className="text-sm font-medium text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
};

export default AuthenticatedLayout;
