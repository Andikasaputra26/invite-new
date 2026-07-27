<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gift_wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_invitation_id')->constrained('user_invitations')->onDelete('cascade');
            $table->string('item_name');
            $table->string('item_url')->nullable();
            $table->string('price_estimate')->nullable();
            $table->string('item_image')->nullable();
            $table->boolean('is_reserved')->default(false);
            $table->string('reserved_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gift_wishlists');
    }
};
