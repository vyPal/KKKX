import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface LikeButtonProps {
    postId: number;
    initialLikeCount: number;
    initialLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId, initialLikeCount, initialLiked = false }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLoading, setIsLoading] = useState(false);

    const toggleLike = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await axios.post(route('posts.toggle-like', postId));
            setLiked(response.data.liked);
            setLikeCount(response.data.count);
        } catch (error) {
            console.error('Error toggling like', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Optionally fetch the initial like status if initialLiked is not provided
    useEffect(() => {
        const fetchLikeStatus = async () => {
            try {
                const response = await axios.get(route('posts.like-status', postId));
                setLiked(response.data.liked);
                setLikeCount(response.data.count);
            } catch (error) {
                console.error('Error fetching like status', error);
            }
        };

        // Only fetch if initialLiked is not provided
        if (initialLiked === undefined) {
            fetchLikeStatus();
        }
    }, [postId, initialLiked]);

    return (
        <button
            onClick={toggleLike}
            disabled={isLoading}
            className={`group flex items-center gap-1 text-sm transition-colors ${
                liked ? 'text-red-500 dark:text-red-400' : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
            } ${isLoading ? 'opacity-70' : ''}`}
            aria-label={liked ? 'Unlike' : 'Like'}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-all ${liked ? 'scale-110 fill-red-500 dark:fill-red-400' : 'fill-none'}`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={liked ? 1 : 1.5}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className={`transition-all ${liked ? 'font-medium' : 'group-hover:text-red-500 dark:group-hover:text-red-400'}`}>
                {likeCount > 0 ? likeCount : 'Like'}
            </span>
        </button>
    );
};

export default LikeButton;
