<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Facades\WebPush;

class CleanWebPushSubscriptions extends Command
{
    protected $signature = 'webpush:clean';
    protected $description = 'Clean invalid WebPush subscriptions';

    public function handle()
    {
        $this->info('Cleaning invalid WebPush subscriptions...');
        app('webpush.cleaner')->cleanInvalidSubscriptions();
        $this->info('Done!');

        return Command::SUCCESS;
    }
}
