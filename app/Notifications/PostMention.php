<?php

namespace App\Notifications;

use App\Models\Post;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class PostMention extends Notification
{
    use Queueable;

    protected $post;
    protected $mentionedBy;

    public function __construct(Post $post, User $mentionedBy)
    {
        $this->post = $post;
        $this->mentionedBy = $mentionedBy;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('You Were Mentioned in a Post')
            ->icon('/notification-icon.png')
            ->body("{$this->mentionedBy->username} mentioned you in a post.")
            ->action('View Post', route('posts.index') . "#post-{$this->post->id}")
            ->data(['post_id' => $this->post->id, 'url' => route('posts.index') . "#post-{$this->post->id}"]);
    }

    public function toArray($notifiable)
    {
        return [
            'post_id' => $this->post->id,
            'post_preview' => substr($this->post->content, 0, 50) . (strlen($this->post->content) > 50 ? '...' : ''),
            'mentioned_by_id' => $this->mentionedBy->id,
            'mentioned_by_username' => $this->mentionedBy->username,
            'type' => 'post_mention',
            'url' => route('posts.index') . "#post-{$this->post->id}",
        ];
    }
}
