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

    Route::post('/api/posts/{post}/view', function (App\Models\Post $post) {
        // Check if post is approved and not hidden
        if ($post->is_approved && !$post->is_hidden) {
            $post->incrementViewCount();
        }

        return response()->json([
            'views_count' => $post->views_count
        ]);
    });
});
