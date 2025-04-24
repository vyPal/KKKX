import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function NotificationBadge() {
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/api/notifications/unread-count');
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch unread notifications count:', error);
        }
    };

    useEffect(() => {
        // Fetch initial count
        fetchUnreadCount();

        // Set up polling every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);

        // Listen for the new-notification custom event
        const handleNewNotification = () => {
            fetchUnreadCount();
        };

        window.addEventListener('new-notification', handleNewNotification);

        // Clean up on unmount
        return () => {
            clearInterval(interval);
            window.removeEventListener('new-notification', handleNewNotification);
        };
    }, []);

    return (
        <Link href={route('notifications.index')} className="relative flex items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </Link>
    );
}
