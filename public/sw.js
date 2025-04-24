self.addEventListener('push', function (e) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    let data = {};
    if (e.data) {
        data = e.data.json();
    }

    const title = data.title || 'KKKX Notification';
    const body = data.body || 'Something happened on KKKX!';
    const icon = data.icon || '/notification-icon.png';
    const actions = data.actions || [];
    const url = data.data?.url || '/notifications';

    e.waitUntil(
        self.registration.showNotification(title, {
            body,
            icon,
            actions,
            data: data.data,
        }),
    );
});

self.addEventListener('notificationclick', function (e) {
    e.notification.close();

    let url = '/notifications';

    if (e.action && e.notification.data?.actions) {
        const action = e.notification.data.actions.find((a) => a.action === e.action);
        if (action) {
            url = action.url;
        }
    } else if (e.notification.data?.url) {
        url = e.notification.data.url;
    }

    e.waitUntil(
        clients.matchAll({ type: 'window' }).then((windowClients) => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window/tab is already open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        }),
    );
});
