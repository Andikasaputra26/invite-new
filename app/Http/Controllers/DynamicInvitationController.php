<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserInvitation;
use App\Models\GuestWish;
use Inertia\Inertia;

class DynamicInvitationController extends Controller
{
    /**
     * Dynamic Renderer Engine for Public Invitations domain.com/v/{slug}?to=Guest+Name
     */
    public function render(Request $request, $slug)
    {
        // 1. Fetch Active User Invitation by Slug
        $invitation = UserInvitation::where('slug', $slug)
            ->where('status', 'active')
            ->firstOrFail();

        // 2. Extract Guest Name Parameter ?to=
        $guestName = $request->query('to', 'Tamu Undangan');

        // 3. Fetch Guestbook Wishes & RSVP
        $wishes = GuestWish::where('user_invitation_id', $invitation->id)
            ->latest()
            ->get()
            ->map(function ($w) {
                return [
                    'name' => $w->guest_name,
                    'status' => $w->attendance_status,
                    'text' => $w->message,
                    'time' => $w->created_at->diffForHumans(),
                ];
            });

        // 4. Fetch Gift Wishlists (WeGiftry)
        $giftWishlists = $invitation->giftWishlists()->get();

        // 5. Render Dynamic Template
        return Inertia::render('Demo/Invitation', [
            'templateSlug' => $invitation->template_slug,
            'guestName' => $guestName,
            'invitationSlug' => $invitation->slug,
            'invitationId' => $invitation->id,
            'invitationTitle' => $invitation->title,
            'packageType' => $invitation->package_type ?? 'premium',
            'customData' => $invitation->custom_data,
            'wishes' => $wishes,
            'giftWishlists' => $giftWishlists,
        ]);
    }
}
