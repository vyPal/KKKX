<?php

namespace App\Notifications;

use App\Models\Post;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushMessage;
use NotificationChannels\WebPush\WebPushChannel;

class PostEdited extends Notification
{
    use Queueable;

    protected $post;
    protected $editor;

    public function __construct(Post $post, User $editor)
    {
        $this->post = $post;
        $this->editor = $editor;
    }

    public function via($notifiable)
    {
        return ['database', WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification)
    {
        return (new WebPushMessage)
            ->title('Your Post Was Edited by an Admin')
            ->icon('/notification-icon.png')
            ->body("An admin has modified the content of your post.")
            ->action('View Post', route('posts.index') . "#post-{$this->post->id}")
            ->data(['post_id' => $this->post->id, 'url' => route('posts.index') . "#post-{$this->post->id}"]);
    }

    public function toArray($notifiable)
    {
        return [
            'post_id' => $this->post->id,
            'post_preview' => substr($this->post->content, 0, 50) . (strlen($this->post->content) > 50 ? '...' : ''),
            'editor_id' => $this->editor->id,
            'editor_username' => $this->editor->username,
            'type' => 'post_edited',
            'url' => route('posts.index') . "#post-{$this->post->id}",
        ];
    }
}
