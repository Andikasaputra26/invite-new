<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserInvitation;
use App\Models\GuestList;
use Inertia\Inertia;

class ReceptionistController extends Controller
{
    /**
     * Display Receptionist Venue Screen (/v/{slug}/receptionist)
     */
    public function show(Request $request, $slug)
    {
        $invitation = UserInvitation::where('slug', $slug)->firstOrFail();

        $guestLists = GuestList::where('user_invitation_id', $invitation->id)
            ->orderBy('is_checked_in', 'desc')
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Venue/Receptionist', [
            'invitationSlug' => $invitation->slug,
            'invitationTitle' => $invitation->title,
            'customData' => $invitation->custom_data,
            'guestLists' => $guestLists,
        ]);
    }

    /**
     * Process QR Code scan or manual guest check-in
     */
    public function checkIn(Request $request, $slug)
    {
        $invitation = UserInvitation::where('slug', $slug)->firstOrFail();
        $query = $request->input('qr_code_slug_or_name');

        $guest = GuestList::where('user_invitation_id', $invitation->id)
            ->where(function ($q) use ($query) {
                $q->where('qr_code_slug', $query)
                  ->orWhere('guest_name', 'LIKE', "%{$query}%");
            })
            ->first();

        if (!$guest) {
            return response()->json([
                'success' => false,
                'message' => 'Data tamu tidak ditemukan di daftar undangan.'
            ], 404);
        }

        $guest->update([
            'is_checked_in' => true,
            'checked_in_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Check-in Berhasil! Selamat Datang ' . $guest->guest_name,
            'guest' => [
                'name' => $guest->guest_name,
                'pax' => $guest->pax_count,
                'status' => $guest->attendance_status,
                'checked_in_at' => $guest->checked_in_at->format('H:i:s WIB'),
            ]
        ]);
    }
}
