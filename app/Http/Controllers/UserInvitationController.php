<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserInvitation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserInvitationController extends Controller
{
    /**
     * Display customization editor.
     */
    public function edit(Request $request)
    {
        $id = $request->query('id');
        $user = Auth::user();

        if ($id) {
            $invitation = UserInvitation::where('id', $id)->first();
        } else {
            $invitation = UserInvitation::where('user_id', optional($user)->id)->latest()->first();
        }

        return Inertia::render('Customer/Invitations/Edit', [
            'invitation' => $invitation,
            'templateSlug' => optional($invitation)->template_slug ?? 'midnight-gold',
        ]);
    }

    /**
     * Save customer custom data and slug.
     */
    public function update(Request $request, $id)
    {
        $invitation = UserInvitation::findOrFail($id);

        $request->validate([
            'slug' => 'required|string|max:255|unique:user_invitations,slug,' . $invitation->id,
            'custom_data' => 'required|array',
        ]);

        $invitation->update([
            'slug' => Str::slug($request->slug),
            'custom_data' => $request->custom_data,
        ]);

        return back()->with('success', 'Kustomisasi undangan berhasil disimpan!');
    }
}
