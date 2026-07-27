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
        Schema::create('guest_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_invitation_id')->constrained('user_invitations')->onDelete('cascade');
            $table->string('guest_name');
            $table->string('qr_code_slug')->unique();
            $table->integer('pax_count')->default(1);
            $table->enum('attendance_status', ['Hadir', 'Tidak Hadir', 'Ragu-ragu', 'Belum Konfirmasi'])->default('Belum Konfirmasi');
            $table->boolean('is_checked_in')->default(false);
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_lists');
    }
};
