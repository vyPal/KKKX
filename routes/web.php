<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('posts', [PostController::class, 'index'])->name('posts.index');
    Route::post('posts', [PostController::class, 'store'])->name('posts.store');
    Route::post('posts/{post}/report', [PostController::class, 'report'])->name('posts.report');

    Route::get('/leaderboard', [App\Http\Controllers\LeaderboardController::class, 'index'])
        ->name('leaderboard');

    Route::post('/posts/{post}/toggle-like', [App\Http\Controllers\LikeController::class, 'toggleLike'])
        ->name('posts.toggle-like');
    Route::get('/posts/{post}/like-status', [App\Http\Controllers\LikeController::class, 'getLikeStatus'])
        ->name('posts.like-status');

    Route::get('/profile/{user:username}', [App\Http\Controllers\ProfileController::class, 'show'])
        ->name('profile.show');

    Route::post('/push-subscriptions', 'App\Http\Controllers\PushSubscriptionController@store')
        ->name('push-subscriptions.store');
    Route::post('/push-subscriptions/update', 'App\Http\Controllers\PushSubscriptionController@update')
        ->name('push-subscriptions.update');
    Route::delete('/push-subscriptions', 'App\Http\Controllers\PushSubscriptionController@destroy')
        ->name('push-subscriptions.destroy');

    // Notifications routes
    Route::get('/notifications', 'App\Http\Controllers\NotificationController@index')
        ->name('notifications.index');
    Route::post('/notifications/{id}/read', 'App\Http\Controllers\NotificationController@markAsRead')
        ->name('notifications.read');
    Route::post('/notifications/read-all', 'App\Http\Controllers\NotificationController@markAllAsRead')
        ->name('notifications.read-all');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/posts', [App\Http\Controllers\Admin\PostController::class, 'index'])
        ->name('posts.index');
    Route::patch('/posts/{post}/approve', [App\Http\Controllers\Admin\PostController::class, 'approve'])
        ->name('posts.approve');
    Route::patch('/posts/{post}/hide', [App\Http\Controllers\Admin\PostController::class, 'hide'])
        ->name('posts.hide');
    Route::patch('/posts/{post}/unhide', [App\Http\Controllers\Admin\PostController::class, 'unhide'])
        ->name('posts.unhide');
    Route::get('/posts/{post}/edit', [App\Http\Controllers\Admin\PostController::class, 'edit'])
        ->name('posts.edit');
    Route::patch('/posts/{post}', [App\Http\Controllers\Admin\PostController::class, 'update'])
        ->name('posts.update');
    Route::delete('/posts/{post}', [App\Http\Controllers\Admin\PostController::class, 'delete'])
        ->name('posts.delete');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/api.php';
