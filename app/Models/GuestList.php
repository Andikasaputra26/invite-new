<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestList extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_invitation_id',
        'guest_name',
        'qr_code_slug',
        'pax_count',
        'attendance_status',
        'is_checked_in',
        'checked_in_at',
    ];

    protected $casts = [
        'is_checked_in' => 'boolean',
        'checked_in_at' => 'datetime',
    ];

    public function userInvitation()
    {
        return $this->belongsTo(UserInvitation::class);
    }
}
