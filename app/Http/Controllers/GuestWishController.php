<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserInvitation;
use App\Models\GuestWish;

class GuestWishController extends Controller
{
    /**
     * Submit Guestbook Wish & RSVP Attendance Status
     */
    public function store(Request $request, $slug)
    {
        $invitation = UserInvitation::where('slug', $slug)->firstOrFail();

        $request->validate([
            'guest_name' => 'required|string|max:255',
            'message' => 'required|string',
            'attendance_status' => 'required|in:Hadir,Tidak Hadir,Ragu-ragu',
        ]);

        $wish = GuestWish::create([
            'user_invitation_id' => $invitation->id,
            'guest_name' => $request->guest_name,
            'message' => $request->message,
            'attendance_status' => $request->attendance_status,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Ucapan & konfirmasi kehadiran berhasil dikirim!',
                'wish' => [
                    'name' => $wish->guest_name,
                    'status' => $wish->attendance_status,
                    'text' => $wish->message,
                    'message' => $wish->message,
                    'time' => $wish->created_at->diffForHumans(),
                    'date' => $wish->created_at->diffForHumans(),
                ]
            ]);
        }

        return back()->with('success', 'Ucapan & konfirmasi kehadiran berhasil dikirim!');
    }
}
