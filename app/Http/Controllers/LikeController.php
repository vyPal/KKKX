<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    public function toggleLike(Post $post)
    {
        $user = auth()->user();

        // Check if the user has already liked the post
        $existing = DB::table('likes')
            ->where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if ($existing) {
            // Unlike: Delete the like
            DB::table('likes')
                ->where('user_id', $user->id)
                ->where('post_id', $post->id)
                ->delete();

            // Decrement the likes_count on the post
            $post->decrement('likes_count');

            return response()->json([
                'liked' => false,
                'count' => $post->likes_count,
            ]);
        }

        // Like: Create a new like
        DB::table('likes')->insert([
            'user_id' => $user->id,
            'post_id' => $post->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Increment the likes_count on the post
        $post->increment('likes_count');

        // Send notification if the post author is not the same as the liker
        if ($post->user_id !== $user->id) {
            $post->user->notify(new \App\Notifications\PostLiked($post, $user));
        }

        return response()->json([
            'liked' => true,
            'count' => $post->likes_count,
        ]);
    }

    public function getLikeStatus(Post $post)
    {
        $user = auth()->user();
        $liked = DB::table('likes')
            ->where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists();

        return response()->json([
            'liked' => $liked,
            'count' => $post->likes_count,
        ]);
    }
}
