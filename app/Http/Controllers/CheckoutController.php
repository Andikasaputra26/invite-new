<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Template;
use App\Models\User;
use App\Models\UserInvitation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CheckoutController extends Controller
{
    /**
     * Handles template purchase & webhook simulation.
     */
    public function checkout(Request $request, $slug)
    {
        $template = Template::where('slug', $slug)->firstOrFail();

        // 1. Get or Create Authenticated Customer
        $user = Auth::user();

        if (!$user) {
            $user = User::firstOrCreate(
                ['email' => $request->input('email', 'pelanggan_' . time() . '@example.com')],
                [
                    'name' => $request->input('name', 'Pelanggan Baru'),
                    'password' => Hash::make('password123'),
                    'role' => 'customer',
                ]
            );
            Auth::login($user);
        }

        // 2. Generate Unique Slug
        $baseSlug = Str::slug($request->input('title', 'pernikahan-' . Str::random(5)));
        $uniqueSlug = $baseSlug;
        $counter = 1;

        while (UserInvitation::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = $baseSlug . '-' . $counter;
            $counter++;
        }

        // 3. Create User Invitation Record
        $userInvitation = UserInvitation::create([
            'user_id' => $user->id,
            'template_id' => $template->id,
            'template_slug' => $template->slug,
            'slug' => $uniqueSlug,
            'title' => $request->input('title', 'Undangan ' . $template->name),
            'status' => 'active',
            'custom_data' => [
                'groom' => [
                    'name' => 'Raden Arya Kusuma, S.T.',
                    'orderText' => 'Putra pertama dari',
                    'father' => 'Bpk. Hj. Suryo Wijaya',
                    'mother' => 'Ibu Hj. Endang Rahayu',
                    'instagram' => '@aryawijaya',
                    'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
                ],
                'bride' => [
                    'name' => 'Putri Sekar Arum, S.Ked',
                    'orderText' => 'Putri kedua dari',
                    'father' => 'Bpk. Dr. H. Bambang Subroto',
                    'mother' => 'Ibu Hj. Dewi Lestari',
                    'instagram' => '@sekararum',
                    'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                ],
                'event' => [
                    'date' => '2026-08-24',
                    'time' => '08:00 WIB - Selesai',
                    'venue' => 'Gedung Serbaguna Senayan, Jakarta',
                    'address' => 'Jl. Jend. Gatot Subroto No.1, Gelora, Tanah Abang, Jakarta Pusat',
                    'gmaps' => 'https://maps.google.com'
                ],
                'components' => [
                    'bgm' => true,
                    'mempelai' => true,
                    'acara' => true,
                    'story' => true,
                    'gallery' => true,
                    'bank' => true,
                    'rsvp' => true
                ]
            ]
        ]);

        return redirect()->route('dashboard')->with('success', 'Pembelian template berhasil! Undangan Anda telah siap dikustomisasi.');
    }
}
