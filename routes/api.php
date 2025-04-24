<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/api/notifications/unread-count', function () {
        return response()->json([
            'count' => auth()->user()->unreadNotifications()->count()
        ]);
    });

    Route::get('/api/notifications/latest', function () {
        $notification = auth()->user()
            ->unreadNotifications()
            ->where('pushed', false)
            ->latest()
            ->first();

        if ($notification) {
            // Mark as pushed so it won't be sent again
            $notification->update(['pushed' => true]);
        }

        return response()->json([
            'notification' => $notification
        ]);
    });
});
