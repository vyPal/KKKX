import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Post, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface EditPostProps {
    auth: {
        user: User;
    };
    post: Post;
}

const EditPost: React.FC<EditPostProps> = ({ auth, post }) => {
    const { data, setData, patch, processing, errors } = useForm({
        content: post.content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.posts.update', post.id));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Post" />

            <div className="mx-auto max-w-2xl p-4">
                <div className="mb-4 flex items-center">
                    <a href={route('admin.posts.index')} className="mr-2 text-blue-500 hover:underline dark:text-blue-400">
                        ← Back to Admin
                    </a>
                    <h1 className="text-xl font-bold dark:text-white">Edit Post</h1>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-700/20">
                    <div className="mb-4">
                        <div className="flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                {post.user.username.charAt(0)}
                            </div>
                            <div className="ml-3">
                                <div className="font-semibold dark:text-white">{post.user.username}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    {post.original_content && (
                        <div className="mb-4">
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">Original Content:</div>
                            <div className="mt-1 rounded bg-gray-100 p-3 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                {post.original_content}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Edit Content
                            </label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={5}
                                className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                maxLength={280}
                            />
                            {errors.content && <div className="mt-1 text-sm text-red-500">{errors.content}</div>}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{data.content.length}/280 characters</div>
                            <div className="flex space-x-2">
                                <a
                                    href={route('admin.posts.index')}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing || data.content === post.content}
                                    className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                                        processing || data.content === post.content
                                            ? 'bg-blue-300 dark:bg-blue-700'
                                            : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500'
                                    }`}
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default EditPost;
