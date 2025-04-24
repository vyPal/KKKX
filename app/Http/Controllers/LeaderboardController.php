<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $sortBy = $request->input('sort', 'score');
        $direction = $request->input('direction', 'desc');

        // Only valid sort options
        if (!in_array($sortBy, ['score', 'count'])) {
            $sortBy = 'score';
        }

        // Only valid directions
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        // Get users with their total racism score and count of flagged posts
        $usersWithScores = User::select('users.*')
            ->selectRaw('SUM(posts.racism_score) as total_racism_score')
            ->selectRaw('COUNT(CASE WHEN posts.racism_score > 0 THEN 1 END) as flagged_posts_count')
            ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
            ->groupBy('users.id')
            ->having('flagged_posts_count', '>', 0)
            ->orderBy($sortBy === 'score' ? 'total_racism_score' : 'flagged_posts_count', $direction)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Leaderboard', [
            'users' => $usersWithScores,
            'sortBy' => $sortBy,
            'direction' => $direction
        ]);
    }
}
