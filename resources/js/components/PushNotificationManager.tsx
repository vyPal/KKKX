import axios from 'axios';
import { useEffect, useState } from 'react';

interface PushManagerProps {
    vapidPublicKey: string;
}

export default function PushNotificationsManager({ vapidPublicKey }: PushManagerProps) {
    const [supported, setSupported] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if Push API is supported
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            setSupported(false);
            setLoading(false);
            return;
        }

        setSupported(true);

        // Register service worker
        navigator.serviceWorker
            .register('/sw.js')
            .then(async (registration) => {
                // Check if we're already subscribed
                const subscription = await registration.pushManager.getSubscription();
                setSubscribed(!!subscription);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
                setLoading(false);
            });
    }, []);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribe = async () => {
        try {
            setLoading(true);
            const registration = await navigator.serviceWorker.ready;

            // Get new subscription
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            // Send subscription to server
            await axios.post(route('push-subscriptions.store'), subscription.toJSON());

            setSubscribed(true);
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const unsubscribe = async () => {
        try {
            setLoading(true);
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Send subscription to server for deletion
                await axios.delete(route('push-subscriptions.destroy'), {
                    data: { endpoint: subscription.endpoint },
                });

                // Unsubscribe on the browser
                await subscription.unsubscribe();
            }

            setSubscribed(false);
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!supported) {
        return (
            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Push notifications not supported</h3>
                        <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-200">Your browser doesn't support push notifications.</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-md bg-white p-4 shadow dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Push Notifications</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {subscribed ? 'You are currently receiving push notifications.' : 'Enable push notifications to stay updated.'}
            </p>
            <div className="mt-4">
                {subscribed ? (
                    <button
                        type="button"
                        onClick={unsubscribe}
                        disabled={loading}
                        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:bg-red-700 dark:hover:bg-red-600"
                    >
                        {loading ? 'Processing...' : 'Disable Notifications'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={subscribe}
                        disabled={loading}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        {loading ? 'Processing...' : 'Enable Notifications'}
                    </button>
                )}
            </div>
        </div>
    );
}
