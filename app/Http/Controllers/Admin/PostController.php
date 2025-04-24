<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $pendingPosts = Post::with('user')
            ->needsModeration()
            ->latest()
            ->paginate(10, ['*'], 'pending');

        $flaggedPosts = Post::with(['user', 'reports'])
            ->whereHas('reports', function($query) {
                $query->where('is_racism_report', true);
            })
            ->latest()
            ->paginate(10, ['*'], 'flagged');

        $hiddenPosts = Post::with('user')
            ->hidden()
            ->latest()
            ->paginate(10, ['*'], 'hidden');

        return Inertia::render('Admin/Posts', [
            'pendingPosts' => $pendingPosts,
            'flaggedPosts' => $flaggedPosts,
            'hiddenPosts' => $hiddenPosts
        ]);
    }

    public function approve(Post $post)
    {
        $post->update([
            'is_approved' => true,
        ]);

        return back()->with('success', 'Post approved.');
    }

    public function hide(Post $post)
    {
        $post->update([
            'is_hidden' => true,
        ]);

        return back()->with('success', 'Post hidden.');
    }

    public function unhide(Post $post)
    {
        $post->update([
            'is_hidden' => false,
        ]);

        return back()->with('success', 'Post is now visible.');
    }

    public function edit(Post $post)
    {
        return Inertia::render('Admin/EditPost', [
            'post' => $post->load('user'),
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $request->validate([
            'content' => 'required|string|max:280',
        ]);

        // Store the original content if this is the first admin edit
        if (!$post->edited_by_admin) {
            $post->original_content = $post->content;
        }

        $post->update([
            'content' => $request->content,
            'edited_by_admin' => true,
            'admin_editor_id' => auth()->id(),
            'admin_edited_at' => now(),
        ]);

        return redirect()->route('admin.posts.index')->with('success', 'Post updated successfully.');
    }

    public function delete(Post $post)
    {
        $post->delete();
        return back()->with('success', 'Post deleted.');
    }
}
