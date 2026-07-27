<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GiftWishlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_invitation_id',
        'item_name',
        'item_url',
        'price_estimate',
        'item_image',
        'is_reserved',
        'reserved_by',
    ];

    protected $casts = [
        'is_reserved' => 'boolean',
    ];

    public function userInvitation()
    {
        return $this->belongsTo(UserInvitation::class);
    }
}
