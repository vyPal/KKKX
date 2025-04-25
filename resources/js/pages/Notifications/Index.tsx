import PushNotificationsManager from '@/components/PushNotificationsManager';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

interface Notification {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

interface NotificationData {
    type: string;
    action: string;
    editor_username: string;
    liked_by_username: string;
    mentioned_by_username: string;
    post_preview: string;
    url: string;
}

interface NotificationsIndexProps {
    auth: {
        user: User;
    };
    notifications: {
        data: Notification[];
        links: Link[];
        current_page: number;
        last_page: number;
    };
    unreadCount: number;
    vapidPublicKey: string;
}

interface Link {
    url: string;
    label: string;
    active: boolean;
}

export default function NotificationsIndex({ auth, notifications, unreadCount, vapidPublicKey }: NotificationsIndexProps) {
    const markAsRead = (id: string) => {
        router.post(
            route('notifications.read', id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const markAllAsRead = () => {
        router.post(
            route('notifications.read-all'),
            {},
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const renderNotificationContent = (notification: Notification) => {
        const data = notification.data;

        switch (data.type) {
            case 'post_liked':
                return (
                    <div>
                        <strong>{data.liked_by_username}</strong> liked your post:
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">"{data.post_preview}"</p>
                    </div>
                );
            case 'post_edited':
                return (
                    <div>
                        <strong>{data.editor_username}</strong> edited your post:
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">"{data.post_preview}"</p>
                    </div>
                );
            case 'post_moderated':
                if (data.action === 'approved') {
                    return (
                        <div>
                            Your post has been approved:
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">"{data.post_preview}"</p>
                        </div>
                    );
                } else if (data.action === 'hidden') {
                    return (
                        <div>
                            Your post has been hidden:
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">"{data.post_preview}"</p>
                        </div>
                    );
                } else if (data.action === 'unhidden') {
                    return (
                        <div>
                            Your post is visible again:
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">"{data.post_preview}"</p>
                        </div>
                    );
                }
                break;
            case 'post_mention':
                return (
                    <div>
                        <strong>{data.mentioned_by_username}</strong> mentioned you in a post:
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">"{data.post_preview}"</p>
                    </div>
                );
            default:
                return <div>You have a new notification.</div>;
        }
    };

    // Format date to relative time (e.g. "2 hours ago")
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Notifications" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>

                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="mb-6">
                                <PushNotificationsManager vapidPublicKey={vapidPublicKey} />
                            </div>

                            {notifications.data.length === 0 ? (
                                <div className="py-10 text-center text-gray-500 dark:text-gray-400">You don't have any notifications yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.data.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`rounded-lg border p-4 ${
                                                notification.read_at
                                                    ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                                                    : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="text-sm text-gray-900 dark:text-white">
                                                        {renderNotificationContent(notification)}
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                        {formatRelativeTime(notification.created_at)}
                                                    </div>
                                                </div>

                                                <div className="ml-4 flex flex-shrink-0 space-x-2">
                                                    {notification.data.url && (
                                                        <Link
                                                            href={notification.data.url}
                                                            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            View
                                                        </Link>
                                                    )}

                                                    {!notification.read_at && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {notifications.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-1">
                                        {notifications.links.map((link, i) => (
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
}
