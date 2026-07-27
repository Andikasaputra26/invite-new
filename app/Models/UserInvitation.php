<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInvitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'template_id',
        'template_slug',
        'slug',
        'title',
        'package_type',
        'custom_data',
        'status',
    ];

    protected $casts = [
        'custom_data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function guestWishes()
    {
        return $this->hasMany(GuestWish::class);
    }

    public function giftWishlists()
    {
        return $this->hasMany(GiftWishlist::class);
    }

    public function guestLists()
    {
        return $this->hasMany(GuestList::class);
    }
}
