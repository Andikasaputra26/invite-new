<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestWish extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_invitation_id',
        'guest_name',
        'message',
        'attendance_status',
    ];

    public function userInvitation()
    {
        return $this->belongsTo(UserInvitation::class);
    }
}
