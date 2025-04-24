<?php

namespace App\Notifications;

use App\Models\Post;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class PostLiked extends Notification
{
    use Queueable;

    protected $post;
    protected $likedBy;

    public function __construct(Post $post, User $likedBy)
    {
        $this->post = $post;
        $this->likedBy = $likedBy;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        $message = "{$this->likedBy->username} liked your post";

        return (new WebPushMessage)
            ->title('New Like on Your Post')
            ->icon('/notification-icon.png')
            ->body($message)
            ->action('View Post', route('posts.index') . "#post-{$this->post->id}")
            ->data(['post_id' => $this->post->id, 'url' => route('posts.index') . "#post-{$this->post->id}"]);
    }

    public function toArray($notifiable)
    {
        return [
            'post_id' => $this->post->id,
            'post_preview' => substr($this->post->content, 0, 50) . (strlen($this->post->content) > 50 ? '...' : ''),
            'liked_by_id' => $this->likedBy->id,
            'liked_by_username' => $this->likedBy->username,
            'type' => 'post_liked',
            'url' => route('posts.index') . "#post-{$this->post->id}",
        ];
    }
}
