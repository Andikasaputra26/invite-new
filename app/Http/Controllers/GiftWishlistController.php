<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserInvitation;
use App\Models\GiftWishlist;

class GiftWishlistController extends Controller
{
    /**
     * Guest reserves a wishlist item (WeGiftry System)
     */
    public function reserve(Request $request, $slug, $itemId)
    {
        $invitation = UserInvitation::where('slug', $slug)->firstOrFail();
        $wishlistItem = GiftWishlist::where('user_invitation_id', $invitation->id)
            ->where('id', $itemId)
            ->firstOrFail();

        if ($wishlistItem->is_reserved) {
            return back()->with('error', 'Kado ini sudah di-reservasi oleh tamu lain.');
        }

        $request->validate([
            'reserved_by' => 'required|string|max:255',
        ]);

        $wishlistItem->update([
            'is_reserved' => true,
            'reserved_by' => $request->reserved_by,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Terima kasih! Kado berhasil di-reservasi atas nama ' . $request->reserved_by,
                'item' => $wishlistItem
            ]);
        }

        return back()->with('success', 'Terima kasih! Kado berhasil di-reservasi.');
    }
}
