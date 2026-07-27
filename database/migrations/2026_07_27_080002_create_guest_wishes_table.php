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
        Schema::create('guest_wishes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_invitation_id')->constrained('user_invitations')->onDelete('cascade');
            $table->string('guest_name');
            $table->text('message');
            $table->enum('attendance_status', ['Hadir', 'Tidak Hadir', 'Ragu-ragu'])->default('Hadir');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_wishes');
    }
};
