<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class DemoteUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:demote {username : The username of the user to demote}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Demote a user back to regular user role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $username = $this->argument('username');

        // Find the user by username
        $user = User::where('username', $username)->first();

        if (!$user) {
            $this->error("User with username '{$username}' not found.");
            return 1;
        }

        // Check if user is already a regular user
        if ($user->role === 'user') {
            $this->info("User '{$username}' is already a regular user.");
            return 0;
        }

        $currentRole = $user->role;

        // Confirm the action
        if (!$this->confirm("Are you sure you want to demote '{$username}' from {$currentRole} to regular user?")) {
            $this->info('Operation cancelled.');
            return 0;
        }

        // Update user role
        $user->role = 'user';
        $user->save();

        $this->info("User '{$username}' has been demoted from {$currentRole} to regular user successfully!");

        return 0;
    }
}
