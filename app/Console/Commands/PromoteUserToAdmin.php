<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class PromoteUserToAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:promote {username : The username of the user to promote} {--role=admin : The role to assign (admin or moderator)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Promote a user to admin or moderator role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $username = $this->argument('username');
        $role = $this->option('role');

        // Validate role
        if (!in_array($role, ['admin', 'moderator'])) {
            $this->error("Invalid role. Role must be 'admin' or 'moderator'.");
            return 1;
        }

        // Find the user by username
        $user = User::where('username', $username)->first();

        if (!$user) {
            $this->error("User with username '{$username}' not found.");
            return 1;
        }

        // Check if user already has the role
        if ($user->role === $role) {
            $this->info("User '{$username}' is already a {$role}.");
            return 0;
        }

        // Confirm the action
        if (!$this->confirm("Are you sure you want to promote '{$username}' to {$role}?")) {
            $this->info('Operation cancelled.');
            return 0;
        }

        // Update user role
        $user->role = $role;
        $user->save();

        $this->info("User '{$username}' has been promoted to {$role} successfully!");

        return 0;
    }
}
