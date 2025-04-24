<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Ensure a user can only like a post once
            $table->unique(['user_id', 'post_id']);
        });

        // Add likes_count column to posts for faster querying
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedInteger('likes_count')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');

        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('likes_count');
        });
    }
};
