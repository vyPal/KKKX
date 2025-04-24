import LikeButton from '@/components/LikeButton';
import { Post } from '@/types';
import { Link } from '@inertiajs/react';
import React from 'react';

interface PostCardProps {
    post: Post;
    onReport: (postId: number) => void;
    isAdmin?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, onReport, isAdmin = false }) => {
    return (
        <div
            className={`rounded-lg p-6 shadow dark:shadow-gray-700/20 ${post.is_hidden ? 'bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'} ${!post.is_approved ? 'border-l-4 border-yellow-400 dark:border-yellow-600' : ''} `}
        >
            <div className="flex items-center">
                <Link href={route('profile.show', post.user.username)} className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {post.user.username.charAt(0)}
                    </div>
                    <div className="ml-3">
                        <div className="font-semibold dark:text-white">{post.user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleString()}</div>
                    </div>
                </Link>
            </div>

            <div className="mt-4 dark:text-white">
                {post.content}

                {post.edited_by_admin && (
                    <div className="mt-1 text-xs text-gray-500 italic dark:text-gray-400">
                        Edited by admin on {new Date(post.admin_edited_at!).toLocaleString()}
                    </div>
                )}
            </div>

            {isAdmin && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Score:{' '}
                    <span
                        className={
                            post.racism_score > 0.7
                                ? 'text-red-600 dark:text-red-400'
                                : post.racism_score > 0.3
                                  ? 'text-yellow-600 dark:text-yellow-500'
                                  : 'text-green-600 dark:text-green-500'
                        }
                    >
                        {post.racism_score}
                    </span>
                </div>
            )}

            {/* Status indicators */}
            {post.is_hidden && <div className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">This post is hidden</div>}

            {!post.is_approved && <div className="mt-2 text-xs font-medium text-yellow-500 dark:text-yellow-400">This post is pending approval</div>}

            <div className="mt-4 flex items-center space-x-4">
                <LikeButton postId={post.id} initialLikeCount={post.likes_count} initialLiked={post.is_liked_by_user ?? false} />

                <button
                    onClick={() => onReport(post.id)}
                    className="flex items-center text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    Report
                </button>
            </div>
        </div>
    );
};

export default PostCard;
