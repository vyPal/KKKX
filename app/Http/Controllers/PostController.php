<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ContentModerationService;

class PostController extends Controller
{
    protected $moderationService;

    public function __construct(ContentModerationService $moderationService)
    {
        $this->moderationService = $moderationService;
    }

    private function isAdmin()
    {
        return auth()->check() && auth()->user()->isAdmin();
    }

    public function index()
    {
        $posts = Post::with('user')
            ->when(!$this->isAdmin(), function ($query) {
                return $query->approved()->orWhere('user_id', auth()->user()->id());
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'isAdmin' => $this->isAdmin(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:280',
        ]);

        // Create post but don't show it yet
        $post = Post::create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'is_approved' => false,
        ]);

        // Check content using the moderation service
        $racismScore = $this->moderationService->analyzeContent($post->content);

        // Update the post with the score
        $post->update([
            'racism_score' => $racismScore,
            // Auto-approve if score is below threshold
            'is_approved' => $racismScore > config('moderation.racism_threshold'),
            // Auto-hide if score is above critical threshold
            'is_hidden' => $racismScore < config('moderation.critical_threshold')
        ]);

        return redirect()->back()->with('success', 'Post submitted for review');
    }

    public function report(Post $post, Request $request)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
            'is_racism_report' => 'boolean'
        ]);

        $post->reports()->create([
            'reported_by' => auth()->id(),
            'reason' => $validated['reason'],
            'is_racism_report' => $validated['is_racism_report'] ?? false
        ]);

        // Recalculate racism score based on reports
        $this->moderationService->recalculateScore($post);

        return back()->with('success', 'Content reported. Thank you for helping keep our platform safe.');
    }
}
