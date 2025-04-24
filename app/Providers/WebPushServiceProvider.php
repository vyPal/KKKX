<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use NotificationChannels\WebPush\PushSubscription;

class WebPushServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Add this if you need to clean up unused subscriptions
        $this->app->singleton('webpush.cleaner', function () {
            return new class {
                public function cleanInvalidSubscriptions()
                {
                    // Clean old subscriptions that got invalidated
                    PushSubscription::whereNotNull('expired_at')->delete();
                }
            };
        });
    }
}
