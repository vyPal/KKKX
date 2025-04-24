import axios from 'axios';
import React, { useEffect, useRef } from 'react';

interface ViewCounterProps {
    postId: number;
    initialCount: number;
    showCount?: boolean;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ postId, initialCount, showCount = true }) => {
    const [count, setCount] = React.useState(initialCount);
    const hasRecordedView = useRef(false);

    useEffect(() => {
        // Only record a view once per component mount
        if (!hasRecordedView.current) {
            const recordView = async () => {
                try {
                    const response = await axios.post(`/api/posts/${postId}/view`);
                    setCount(response.data.views_count);
                    hasRecordedView.current = true;
                } catch (error) {
                    console.error('Failed to record view:', error);
                }
            };

            // Delay the view count by 5 seconds to count more meaningful views
            // and avoid counting views from quick scrolling
            const timer = setTimeout(() => {
                recordView();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [postId]);

    if (!showCount) {
        return null;
    }

    return (
        <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
            </svg>
            {count > 999 ? `${(count / 1000).toFixed(1)}K` : count}
        </span>
    );
};

export default ViewCounter;
