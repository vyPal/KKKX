import axios from 'axios';
import { useEffect } from 'react';

interface NotificationListenerProps {
    userId: number;
}

export default function NotificationListener({ userId }: NotificationListenerProps) {
    useEffect(() => {
        // Request notification permission if not already granted
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        // Setup polling for new notifications
        const checkNewNotifications = async () => {
            try {
                const response = await axios.get('/api/notifications/latest');
                const latestNotification = response.data.notification;

                if (latestNotification && document.hidden && Notification.permission === 'granted') {
                    // Notification data
                    const data = latestNotification.data;
                    let title = 'New Notification';
                    let body = 'You have a new notification';

                    // Format notification based on type
                    switch (data.type) {
                        case 'post_liked':
                            title = 'New Like';
                            body = `${data.liked_by_username} liked your post`;
                            break;
                        case 'post_edited':
                            title = 'Post Edited';
                            body = `An admin has edited your post`;
                            break;
                        case 'post_mention':
                            title = 'You were mentioned';
                            body = `${data.mentioned_by_username} mentioned you in a post`;
                            break;
                        case 'post_moderated':
                            title = 'Post Update';
                            if (data.action === 'approved') {
                                body = 'Your post has been approved';
                            } else if (data.action === 'hidden') {
                                body = 'Your post has been hidden';
                            } else if (data.action === 'unhidden') {
                                body = 'Your post is visible again';
                            }
                            break;
                    }

                    const browserNotification = new Notification(title, {
                        body,
                        icon: '/notification-icon.png',
                    });

                    browserNotification.onclick = function () {
                        window.focus();
                        if (data.url) {
                            window.location.href = data.url;
                        } else {
                            window.location.href = route('notifications.index');
                        }
                    };

                    // Update notification badge count
                    window.dispatchEvent(new CustomEvent('new-notification'));
                }
            } catch (error) {
                console.error('Failed to fetch latest notification:', error);
            }
        };

        // Check for new notifications every 30 seconds
        const interval = setInterval(checkNewNotifications, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [userId]);

    return null;
}
