import Modal from '@/components/Modal';
import PostCard from '@/components/PostCard';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PaginatedData, Post, ReportFormData, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface IndexProps {
    auth: {
        user: User;
    };
    posts: PaginatedData<Post>;
    isAdmin: boolean;
}

const Index: React.FC<IndexProps> = ({ auth, posts, isAdmin }) => {
    const [reportingPost, setReportingPost] = useState<Post | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm<{
        content: string;
    }>({
        content: '',
    });

    const reportForm = useForm<Required<ReportFormData>>({
        reason: '',
        is_racism_report: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('posts.store'), {
            onSuccess: () => reset('content'),
        });
    };

    const handleReport = (postId: number) => {
        setReportingPost(posts.data.find((post) => post.id === postId) || null);
    };

    const submitReport = (e: React.FormEvent) => {
        e.preventDefault();
        if (reportingPost) {
            reportForm.post(route('posts.report', reportingPost.id), {
                onSuccess: () => {
                    setReportingPost(null);
                    reportForm.reset();
                },
            });
        }
    };

    const closeReportModal = () => {
        setReportingPost(null);
        reportForm.reset();
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Timeline" />

            <div className="mx-auto max-w-2xl p-4">
                <form onSubmit={handleSubmit} className="mb-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 dark:shadow-gray-700/20">
                    <h2 className="mb-4 text-lg font-semibold dark:text-white">Create a New Post</h2>
                    <textarea
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        className="min-h-[120px] w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="What's happening?"
                        maxLength={280}
                    ></textarea>

                    {errors.content && <div className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.content}</div>}

                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{data.content.length}/280 characters</span>
                        <button
                            type="submit"
                            disabled={processing || data.content.length === 0}
                            className={`rounded-full px-4 py-2 font-medium text-white ${
                                processing || data.content.length === 0
                                    ? 'bg-blue-300 dark:bg-blue-700'
                                    : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500'
                            } transition`}
                        >
                            {processing ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    {posts.data.length === 0 ? (
                        <div className="rounded-lg bg-white py-8 text-center shadow dark:bg-gray-800 dark:shadow-gray-700/20">
                            <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to post!</p>
                        </div>
                    ) : (
                        posts.data.map((post) => <PostCard key={post.id} post={post} onReport={handleReport} isAdmin={isAdmin} />)
                    )}

                    {/* Pagination controls could be added here */}
                </div>
            </div>

            <Modal show={reportingPost !== null} onClose={closeReportModal}>
                <div className="p-6">
                    <h2 className="mb-4 text-lg font-semibold dark:text-white">Report Content</h2>

                    <form onSubmit={submitReport}>
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300" htmlFor="reason">
                                Why are you reporting this post?
                            </label>
                            <textarea
                                id="reason"
                                className="min-h-[100px] w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                value={reportForm.data.reason}
                                onChange={(e) => reportForm.setData('reason', e.target.value)}
                                placeholder="Please provide details about why you're reporting this content..."
                            />
                            {reportForm.errors.reason && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{reportForm.errors.reason}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="focus:ring-opacity-50 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-blue-500"
                                    checked={reportForm.data.is_racism_report}
                                    onChange={(e) => reportForm.setData('is_racism_report', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">This content contains racist language or themes</span>
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={closeReportModal}
                                className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={reportForm.processing || !reportForm.data.reason}
                                className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
                                    reportForm.processing || !reportForm.data.reason
                                        ? 'bg-red-300 dark:bg-red-800'
                                        : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                                }`}
                            >
                                Submit Report
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default Index;
