import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PaginatedData, Post, User } from '@/types';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';

interface PostsProps {
    auth: {
        user: User;
    };
    pendingPosts: PaginatedData<Post>;
    flaggedPosts: PaginatedData<Post>;
    hiddenPosts: PaginatedData<Post>;
}

const Posts: React.FC<PostsProps> = ({ auth, pendingPosts, flaggedPosts, hiddenPosts }) => {
    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ');
    }

    const categories = {
        'Pending Approval': {
            count: pendingPosts.total,
            posts: pendingPosts.data,
        },
        'Flagged for Racism': {
            count: flaggedPosts.total,
            posts: flaggedPosts.data,
        },
        'Hidden Posts': {
            count: hiddenPosts.total,
            posts: hiddenPosts.data,
        },
    };

    const [processing, setProcessing] = useState(false);

    const handleAction = (post: Post, action: string) => {
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
            preserveState: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Admin - Posts" />

            <div className="mx-auto max-w-5xl p-4">
                <h1 className="mb-6 text-2xl font-bold dark:text-white">Post Moderation</h1>

                <TabGroup>
                    <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        {Object.keys(categories).map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm leading-5 font-medium',
                                        'focus:ring-2 focus:outline-none',
                                        selected
                                            ? 'bg-white text-blue-700 shadow dark:bg-gray-800 dark:text-blue-400'
                                            : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
                                    )
                                }
                            >
                                {category} ({categories[category as keyof typeof categories].count})
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="mt-2">
                        {Object.values(categories).map((category, idx) => (
                            <TabPanel key={idx} className="rounded-xl bg-white p-3 shadow dark:bg-gray-800 dark:shadow-gray-700/20">
                                {category.posts.length === 0 ? (
                                    <p className="py-10 text-center text-gray-500 dark:text-gray-400">No posts in this category.</p>
                                ) : (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {category.posts.map((post) => (
                                            <li key={post.id} className="px-4 py-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                            {post.user.username.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="font-semibold dark:text-white">{post.user.username}</span>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {new Date(post.created_at).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 dark:text-white">{post.content}</p>

                                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                                                <span className="flex items-center rounded bg-gray-200 px-2 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                                    Racism Score:
                                                                    <span
                                                                        className={
                                                                            post.racism_score > 0.7
                                                                                ? 'ml-1 text-red-600 dark:text-red-400'
                                                                                : post.racism_score > 0.3
                                                                                  ? 'ml-1 text-yellow-600 dark:text-yellow-400'
                                                                                  : 'ml-1 text-green-600 dark:text-green-400'
                                                                        }
                                                                    >
                                                                        {post.racism_score}
                                                                    </span>
                                                                </span>

                                                                {post.reports && (
                                                                    <span className="flex items-center rounded bg-red-100 px-2 py-1 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                                        Reports: {post.reports.length}
                                                                    </span>
                                                                )}

                                                                {!post.is_approved && (
                                                                    <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                                        Pending Approval
                                                                    </span>
                                                                )}

                                                                {post.is_hidden && (
                                                                    <span className="rounded bg-red-100 px-2 py-1 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                                                        Hidden
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <a
                                                            href={route('admin.posts.edit', post.id)}
                                                            className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                                                        >
                                                            Edit
                                                        </a>
                                                        {!post.is_approved && (
                                                            <button
                                                                onClick={() => handleAction(post, 'approve')}
                                                                className="rounded-md bg-green-50 px-3 py-1 text-sm font-medium text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        {post.is_hidden ? (
                                                            <button
                                                                onClick={() => handleAction(post, 'unhide')}
                                                                className="rounded-md bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/40"
                                                            >
                                                                Unhide
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAction(post, 'hide')}
                                                                className="rounded-md bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                            >
                                                                Hide
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        'Are you sure you want to delete this post? This action cannot be undone.',
                                                                    )
                                                                ) {
                                                                    handleAction(post, 'delete');
                                                                }
                                                            }}
                                                            className="rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
            </div>
        </AuthenticatedLayout>
    );
};

export default Posts;
