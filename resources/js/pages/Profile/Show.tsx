import Modal from '@/components/Modal';
import PostCard from '@/components/PostCard';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Post, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

interface ProfileShowProps {
    auth: {
        user: User;
    };
    profileUser: {
        id: number;
        username: string;
        name: string;
        created_at: string;
        is_admin: boolean;
        cumulativeRacismScore: number;
        flaggedPostsCount: number;
        totalLikesReceived: number;
    };
    userPosts: {
        data: Post[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    likedPosts: {
        data: Post[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    isAdmin: boolean;
    isOwnProfile: boolean;
}

const ProfileShow: React.FC<ProfileShowProps> = ({ auth, profileUser, userPosts, likedPosts, isAdmin, isOwnProfile }) => {
    const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
    const [reportingPost, setReportingPost] = useState<Post | null>(null);

    const reportForm = useForm<{
        reason: string;
        is_racism_report: boolean;
    }>({
        reason: '',
        is_racism_report: false,
    });

    const handleReport = (postId: number) => {
        const posts = activeTab === 'posts' ? userPosts.data : likedPosts.data;
        setReportingPost(posts.find((post) => post.id === postId) || null);
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

    // Format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${profileUser.username}'s Profile`} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
                                {/* Profile Avatar */}
                                <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-5xl font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                    {profileUser.username.charAt(0)}
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex flex-col justify-between md:flex-row md:items-center">
                                        <div>
                                            <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                                                {profileUser.username}
                                                {profileUser.is_admin && (
                                                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        Admin
                                                    </span>
                                                )}
                                            </h1>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{profileUser.name}</p>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Joined {formatDate(profileUser.created_at)}
                                            </p>
                                        </div>

                                        {isOwnProfile && (
                                            <div className="mt-4 md:mt-0">
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                                >
                                                    Edit Profile
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <div className="text-center">
                                            <div className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {profileUser.totalLikesReceived}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Likes Received</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {userPosts.data.length > 0
                                                    ? userPosts.current_page < userPosts.last_page
                                                        ? `${userPosts.data.length}+`
                                                        : userPosts.data.length
                                                    : 0}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
                                        </div>

                                        <div className="text-center">
                                            <div
                                                className={`text-xl font-semibold ${
                                                    profileUser.cumulativeRacismScore > 1
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : profileUser.cumulativeRacismScore > 0.3
                                                          ? 'text-yellow-600 dark:text-yellow-400'
                                                          : 'text-green-600 dark:text-green-400'
                                                }`}
                                            >
                                                {profileUser.cumulativeRacismScore.toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Racism Score</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex">
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`w-1/2 border-b-2 px-1 py-4 text-center text-sm font-medium ${
                                        activeTab === 'posts'
                                            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Posts
                                </button>
                                <button
                                    onClick={() => setActiveTab('likes')}
                                    className={`w-1/2 border-b-2 px-1 py-4 text-center text-sm font-medium ${
                                        activeTab === 'likes'
                                            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                                    }`}
                                >
                                    Liked Posts
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === 'posts' && (
                                <div className="space-y-4">
                                    {userPosts.data.length > 0 ? (
                                        userPosts.data.map((post) => <PostCard key={post.id} post={post} onReport={handleReport} isAdmin={isAdmin} />)
                                    ) : (
                                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">No posts yet.</div>
                                    )}

                                    {/* Pagination for posts */}
                                    {userPosts.last_page > 1 && (
                                        <div className="mt-6 flex justify-center">
                                            <div className="flex space-x-2">
                                                {userPosts.links.map((link, i) => (
                                                    <Link
                                                        key={i}
                                                        href={link.url ?? '#'}
                                                        className={`rounded px-3 py-1 ${
                                                            link.active
                                                                ? 'bg-blue-500 text-white'
                                                                : !link.url
                                                                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                                                  : 'bg-white text-blue-500 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'likes' && (
                                <div className="space-y-4">
                                    {likedPosts.data.length > 0 ? (
                                        likedPosts.data.map((post) => (
                                            <PostCard key={post.id} post={post} onReport={handleReport} isAdmin={isAdmin} />
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-gray-500 dark:text-gray-400">No liked posts yet.</div>
                                    )}

                                    {/* Pagination for liked posts */}
                                    {likedPosts.last_page > 1 && (
                                        <div className="mt-6 flex justify-center">
                                            <div className="flex space-x-2">
                                                {likedPosts.links.map((link, i) => (
                                                    <Link
                                                        key={i}
                                                        href={link.url ?? '#'}
                                                        className={`rounded px-3 py-1 ${
                                                            link.active
                                                                ? 'bg-blue-500 text-white'
                                                                : !link.url
                                                                  ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                                                  : 'bg-white text-blue-500 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
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

export default ProfileShow;
