import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

interface LeaderboardProps {
    auth: {
        user: User;
    };
    users: {
        data: (User & { total_racism_score: number; flagged_posts_count: number })[];
        links: Link[];
        current_page: number;
        last_page: number;
    };
    sortBy: 'score' | 'count';
    direction: 'asc' | 'desc';
}

interface Link {
    url: string;
    label: string;
    active: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ auth, users, sortBy, direction }) => {
    // Helper to create sort links
    const getSortLink = (column: 'score' | 'count') => {
        let newDirection = 'desc';

        if (sortBy === column && direction === 'desc') {
            newDirection = 'asc';
        }

        return route('leaderboard', { sort: column, direction: newDirection });
    };

    // Helper to show sort icons
    const getSortIcon = (column: 'score' | 'count') => {
        if (sortBy !== column) {
            return null;
        }

        return direction === 'asc' ? '↑' : '↓';
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Racism Leaderboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="mb-6 text-2xl font-bold">Racism Leaderboard</h1>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Rank
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                <Link href={getSortLink('score')} className="flex items-center">
                                                    Total Racism Score
                                                    <span className="ml-1">{getSortIcon('score')}</span>
                                                </Link>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                <Link href={getSortLink('count')} className="flex items-center">
                                                    Flagged Posts
                                                    <span className="ml-1">{getSortIcon('count')}</span>
                                                </Link>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {users.data.length > 0 ? (
                                            users.data.map((user, index) => {
                                                // Calculate rank based on page
                                                const rank = (users.current_page - 1) * 20 + index + 1;

                                                // Determine rank styling
                                                let rankClass = '';
                                                if (rank === 1) rankClass = 'text-yellow-500 font-bold';
                                                else if (rank === 2) rankClass = 'text-gray-400 font-bold';
                                                else if (rank === 3) rankClass = 'text-amber-600 font-bold';

                                                return (
                                                    <tr
                                                        key={user.id}
                                                        className={
                                                            user.id === auth.user.id
                                                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                                        }
                                                    >
                                                        <td className={`px-6 py-4 text-sm whitespace-nowrap ${rankClass}`}>{rank}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                                    {user.username.charAt(0)}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {user.username}
                                                                    </div>
                                                                    {user.id === auth.user.id && (
                                                                        <div className="text-xs text-gray-500 dark:text-gray-400">(You)</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900 dark:text-white">
                                                                {user.total_racism_score?.toFixed(2) ?? 0}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                            {user.flagged_posts_count ?? 0}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    No users have flagged posts yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {users.last_page > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing page {users.current_page} of {users.last_page}
                                    </div>
                                    <div className="flex space-x-2">
                                        {users.links.map((link, i) => (
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Leaderboard;
