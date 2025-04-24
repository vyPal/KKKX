<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->boolean('edited_by_admin')->default(false);
            $table->foreignId('admin_editor_id')->nullable()->constrained('users');
            $table->timestamp('admin_edited_at')->nullable();
            $table->text('original_content')->nullable();
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['edited_by_admin', 'admin_edited_at', 'original_content']);
            $table->dropConstrainedForeignId('admin_editor_id');
        });
    }
};
