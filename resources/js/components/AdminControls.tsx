import { Post } from '@/types';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';
import React, { useState } from 'react';

interface AdminControlsProps {
    post: Post;
}

const AdminControls: React.FC<AdminControlsProps> = ({ post }) => {
    const [processing, setProcessing] = useState(false);

    const handleAction = (action: string) => {
        if (processing) return;

        setProcessing(true);

        const routes = {
            approve: route('admin.posts.approve', post.id),
            hide: route('admin.posts.hide', post.id),
            unhide: route('admin.posts.unhide', post.id),
            delete: route('admin.posts.delete', post.id),
        };

        router.visit(routes[action as keyof typeof routes], {
            method: action === 'delete' ? 'delete' : 'patch',
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <Menu as="div" className="relative">
            <MenuButton className="flex items-center rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Post actions">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </MenuButton>

            <MenuItems className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black focus:outline-none dark:bg-gray-800 dark:shadow-gray-700/20">
                <MenuItem>
                    {({ active }) => (
                        <Link
                            href={route('admin.posts.edit', post.id)}
                            className={`block px-4 py-2 text-sm ${
                                active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            Edit Post
                        </Link>
                    )}
                </MenuItem>

                {!post.is_approved && (
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={() => handleAction('approve')}
                                className={`block w-full px-4 py-2 text-left text-sm ${
                                    active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                } ${processing ? 'opacity-75' : ''}`}
                                disabled={processing}
                            >
                                Approve Post
                            </button>
                        )}
                    </MenuItem>
                )}

                {post.is_hidden ? (
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={() => handleAction('unhide')}
                                className={`block w-full px-4 py-2 text-left text-sm ${
                                    active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                } ${processing ? 'opacity-75' : ''}`}
                                disabled={processing}
                            >
                                Unhide Post
                            </button>
                        )}
                    </MenuItem>
                ) : (
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={() => handleAction('hide')}
                                className={`block w-full px-4 py-2 text-left text-sm ${
                                    active ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                                } ${processing ? 'opacity-75' : ''}`}
                                disabled={processing}
                            >
                                Hide Post
                            </button>
                        )}
                    </MenuItem>
                )}

                <MenuItem>
                    {({ active }) => (
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                                    handleAction('delete');
                                }
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm ${
                                active ? 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'text-red-600 dark:text-red-400'
                            } ${processing ? 'opacity-75' : ''}`}
                            disabled={processing}
                        >
                            Delete Post
                        </button>
                    )}
                </MenuItem>
            </MenuItems>
        </Menu>
    );
};

export default AdminControls;
