<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Template;
use App\Models\User;
use App\Models\UserInvitation;
use App\Models\GiftWishlist;
use App\Models\GuestList;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Master Templates
        $t1 = Template::updateOrCreate(
            ['slug' => 'midnight-gold'],
            [
                'name' => 'Midnight Serenade Gold',
                'code' => 'T-001',
                'category' => 'Luxury & Royal',
                'thumbnail' => 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
                'view_path' => 'Demo/Invitation',
                'price' => 149000,
                'is_active' => true,
                'is_premium' => true,
            ]
        );

        $t2 = Template::updateOrCreate(
            ['slug' => 'rose-romance'],
            [
                'name' => 'Floral Garden Romance',
                'code' => 'T-002',
                'category' => 'Romantic & Pastel',
                'thumbnail' => 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
                'view_path' => 'Demo/Invitation',
                'price' => 99000,
                'is_active' => true,
                'is_premium' => true,
            ]
        );

        $t3 = Template::updateOrCreate(
            ['slug' => 'emerald-botanical'],
            [
                'name' => 'Emerald Botanical Haven',
                'code' => 'T-003',
                'category' => 'Nature & Glass',
                'thumbnail' => 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
                'view_path' => 'Demo/Invitation',
                'price' => 119000,
                'is_active' => true,
                'is_premium' => false,
            ]
        );

        $t4 = Template::updateOrCreate(
            ['slug' => 'royal-velvet'],
            [
                'name' => 'Royal Velvet Sapphire',
                'code' => 'T-004',
                'category' => 'Regal & Platinum',
                'thumbnail' => 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
                'view_path' => 'Demo/Invitation',
                'price' => 139000,
                'is_active' => true,
                'is_premium' => true,
            ]
        );

        // 2. Ensure Customer User Exists
        $user = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Raden Arya',
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]
        );

        // 3. Seed Initial Customer Invitation Proyek 1 (romeo-juliet - Template 1)
        $inv1 = UserInvitation::updateOrCreate(
            ['slug' => 'romeo-juliet'],
            [
                'user_id' => $user->id,
                'template_id' => $t1->id,
                'template_slug' => 'midnight-gold',
                'title' => 'Walimatul Ursy Arya & Sekar',
                'package_type' => 'business',
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
                        'wishlist' => true,
                        'rsvp' => true
                    ]
                ]
            ]
        );

        // 4. Seed Customer Invitation Proyek 2 (kiara-dimas - Template 2 Rose Romance)
        $inv2 = UserInvitation::updateOrCreate(
            ['slug' => 'kiara-dimas'],
            [
                'user_id' => $user->id,
                'template_id' => $t2->id,
                'template_slug' => 'rose-romance',
                'title' => 'Pernikahan Kiara & Dimas',
                'package_type' => 'premium',
                'status' => 'active',
                'custom_data' => [
                    'groom' => [
                        'name' => 'Dimas Prasetyo, M.B.A',
                        'orderText' => 'Putra kedua dari',
                        'father' => 'Bpk. Ir. H. Agus Prasetyo',
                        'mother' => 'Ibu Hj. Ratna Sari',
                        'instagram' => '@dimasprasetyo',
                        'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
                    ],
                    'bride' => [
                        'name' => 'Kiara Larasati, S.Psi',
                        'orderText' => 'Putri pertama dari',
                        'father' => 'Bpk. Dr. H. Hendra Laksana',
                        'mother' => 'Ibu Hj. Wulandari',
                        'instagram' => '@kiaralarasati',
                        'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
                    ],
                    'event' => [
                        'date' => '2026-09-10',
                        'time' => '09:00 WIB - Selesai',
                        'venue' => 'Bambini Garden, Jakarta',
                        'address' => 'Jl. Bambu Apus No. 12, Cipayung, Jakarta Timur',
                        'gmaps' => 'https://maps.google.com'
                    ],
                    'components' => [
                        'bgm' => true,
                        'mempelai' => true,
                        'acara' => true,
                        'story' => true,
                        'gallery' => true,
                        'bank' => true,
                        'wishlist' => true,
                        'rsvp' => true
                    ]
                ]
            ]
        );

        // 5. Seed Customer Invitation Proyek 3 (rian-maya - Template 3 Emerald Botanical)
        $inv3 = UserInvitation::updateOrCreate(
            ['slug' => 'rian-maya'],
            [
                'user_id' => $user->id,
                'template_id' => $t3->id,
                'template_slug' => 'emerald-botanical',
                'title' => 'Botanical Marriage Rian & Maya',
                'package_type' => 'free',
                'status' => 'active',
                'custom_data' => [
                    'groom' => [
                        'name' => 'Rian Hidayat, S.Kom',
                        'orderText' => 'Putra bungsu dari',
                        'father' => 'Bpk. H. Ahmad Hidayat',
                        'mother' => 'Ibu Hj. Mariam',
                        'instagram' => '@rianhidayat',
                        'photo' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80'
                    ],
                    'bride' => [
                        'name' => 'Maya Kartika, S.T',
                        'orderText' => 'Putri pertama dari',
                        'father' => 'Bpk. H. Rudi Kartika',
                        'mother' => 'Ibu Hj. Nurhayaty',
                        'instagram' => '@mayakartika',
                        'photo' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
                    ],
                    'event' => [
                        'date' => '2026-10-15',
                        'time' => '10:00 WIB - Selesai',
                        'venue' => 'Hutan Kota by Plataran, Jakarta',
                        'address' => 'Jendral Sudirman Kav. 54-55, Senayan, Jakarta Pusat',
                        'gmaps' => 'https://maps.google.com'
                    ],
                    'components' => [
                        'bgm' => true,
                        'mempelai' => true,
                        'acara' => true,
                        'story' => true,
                        'gallery' => true,
                        'bank' => true,
                        'wishlist' => true,
                        'rsvp' => true
                    ]
                ]
            ]
        );

        // 6. Seed Wishlist Kado Impian (WeGiftry)
        GiftWishlist::updateOrCreate(
            ['user_invitation_id' => $inv1->id, 'item_name' => 'Air Fryer Digital Philips 4.1L'],
            [
                'item_url' => 'https://tokopedia.com',
                'price_estimate' => 'Rp 1.499.000',
                'item_image' => 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80',
                'is_reserved' => false,
                'reserved_by' => null,
            ]
        );

        GiftWishlist::updateOrCreate(
            ['user_invitation_id' => $inv2->id, 'item_name' => 'Espresso Coffee Machine DeLonghi'],
            [
                'item_url' => 'https://shopee.co.id',
                'price_estimate' => 'Rp 2.899.000',
                'item_image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
                'is_reserved' => false,
                'reserved_by' => null,
            ]
        );

        // 7. Seed Guest Lists & QR Slugs
        GuestList::updateOrCreate(
            ['user_invitation_id' => $inv1->id, 'guest_name' => 'Budi Santoso'],
            [
                'qr_code_slug' => 'QR-BUDI-8821',
                'pax_count' => 2,
                'attendance_status' => 'Hadir',
                'is_checked_in' => false,
            ]
        );

        GuestList::updateOrCreate(
            ['user_invitation_id' => $inv2->id, 'guest_name' => 'Budi Santoso'],
            [
                'qr_code_slug' => 'QR-BUDI-9910',
                'pax_count' => 2,
                'attendance_status' => 'Hadir',
                'is_checked_in' => false,
            ]
        );
    }
}
