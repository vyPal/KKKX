<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(User $user)
    {
        // Check if viewing user is admin
        $isAdmin = auth()->check() && auth()->user()->isAdmin();

        // Calculate total likes received across all user's posts
        $totalLikesReceived = Post::where('user_id', $user->id)->sum('likes_count');

        // Get user's posts
        $userPosts = Post::with('user')
            ->where('user_id', $user->id)
            ->when(!$isAdmin, function ($query) {
                return $query->approved()->where('is_hidden', false);
            })
            ->latest()
            ->paginate(10, ['*'], 'posts_page');

        // Get posts liked by user
        $likedPosts = Post::with('user')
            ->whereHas('likes', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->when(!$isAdmin, function ($query) {
                return $query->approved()->where('is_hidden', false);
            })
            ->latest()
            ->paginate(10, ['*'], 'likes_page');

        // Calculate cumulative racism score
        $cumulativeRacismScore = Post::where('user_id', $user->id)
            ->where('racism_score', '>', 0)
            ->sum('racism_score');

        // Count flagged posts
        $flaggedPostsCount = Post::where('user_id', $user->id)
            ->where('racism_score', '>', 0)
            ->count();

        // Add like status to posts for the authenticated user
        $authUser = auth()->user();
        if ($authUser) {
            $userPosts->getCollection()->transform(function ($post) use ($authUser) {
                $post->is_liked_by_user = $post->likes()->where('user_id', $authUser->id)->exists();
                return $post;
            });

            $likedPosts->getCollection()->transform(function ($post) use ($authUser) {
                $post->is_liked_by_user = true; // By definition, these are liked by the user
                return $post;
            });
        }

        $totalViews = $user->posts->sum('views_count');

        return Inertia::render('Profile/Show', [
            'profileUser' => [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'created_at' => $user->created_at,
                'is_admin' => $user->isAdmin(),
                'cumulativeRacismScore' => round($cumulativeRacismScore, 2),
                'flaggedPostsCount' => $flaggedPostsCount,
                'totalLikesReceived' => $totalLikesReceived,
                'totalViews' => $totalViews,
            ],
            'userPosts' => $userPosts,
            'likedPosts' => $likedPosts,
            'isAdmin' => $isAdmin,
            'isOwnProfile' => auth()->id() === $user->id,
        ]);
    }
}
