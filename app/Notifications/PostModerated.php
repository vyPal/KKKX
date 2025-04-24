<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class PostModerated extends Notification
{
    use Queueable;

    protected $post;
    protected $action;

    public function __construct(Post $post, string $action)
    {
        $this->post = $post;
        $this->action = $action; // 'approved', 'hidden', 'unhidden'
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        $title = '';
        $body = '';

        switch ($this->action) {
            case 'approved':
                $title = 'Your Post Has Been Approved';
                $body = 'Your post is now visible to everyone.';
                break;
            case 'hidden':
                $title = 'Your Post Has Been Hidden';
                $body = 'Your post has been hidden due to policy violations.';
                break;
            case 'unhidden':
                $title = 'Your Post Is Visible Again';
                $body = 'Your post that was previously hidden is now visible again.';
                break;
        }

        return (new WebPushMessage)
            ->title($title)
            ->icon('/notification-icon.png')
            ->body($body)
            ->action('View Post', route('posts.index') . "#post-{$this->post->id}")
            ->data(['post_id' => $this->post->id, 'url' => route('posts.index') . "#post-{$this->post->id}"]);
    }

    public function toArray($notifiable)
    {
        return [
            'post_id' => $this->post->id,
            'post_preview' => substr($this->post->content, 0, 50) . (strlen($this->post->content) > 50 ? '...' : ''),
            'action' => $this->action,
            'type' => 'post_moderated',
            'url' => route('posts.index') . "#post-{$this->post->id}",
        ];
    }
}
