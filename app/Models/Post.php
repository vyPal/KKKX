<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id', 'content', 'racism_score', 'is_approved', 'is_hidden',
        'edited_by_admin', 'admin_editor_id', 'admin_edited_at', 'original_content'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'is_hidden' => 'boolean',
        'edited_by_admin' => 'boolean',
        'admin_edited_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function adminEditor()
    {
        return $this->belongsTo(User::class, 'admin_editor_id');
    }

    public function reports()
    {
        return $this->hasMany(ContentReport::class);
    }

    // Scope for approved content
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true)->where('is_hidden', false);
    }

    // Scope for posts that need moderation
    public function scopeNeedsModeration($query)
    {
        return $query->where('is_approved', false);
    }

    // Scope for hidden posts
    public function scopeHidden($query)
    {
        return $query->where('is_hidden', true);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function likedBy()
    {
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }

    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    protected static function booted()
    {
        // Automatically update the likes_count when likes are added/removed
        static::updated(function ($post) {
            if ($post->isDirty('likes_count')) {
                cache()->forget("post.{$post->id}.likes_count");
            }
        });
    }
}
