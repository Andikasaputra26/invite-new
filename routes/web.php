<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\UserInvitationController;
use App\Http\Controllers\DynamicInvitationController;
use App\Http\Controllers\GuestWishController;
use App\Http\Controllers\ReceptionistController;
use App\Http\Controllers\GiftWishlistController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Demo Catalog Live Preview (Supports Numeric IDs 1, 2, 3, 4, 5, 6 & Slugs)
Route::get('/demo/invitation/{template?}', function ($template = '1') {
    $map = [
        '1' => 'midnight-gold',
        '2' => 'rose-romance',
        '3' => 'emerald-botanical',
        '4' => 'royal-velvet',
        '5' => 'boho-terracotta',
        '6' => 'minimalist-monochrome',
    ];
    $templateSlug = $map[$template] ?? $template;

    return Inertia::render('Demo/Invitation', [
        'templateSlug' => $templateSlug
    ]);
});

// 1. Dynamic Public Invitation Renderer domain.com/v/{slug}?to=Guest+Name
Route::get('/v/{slug}', [DynamicInvitationController::class, 'render'])->name('invitation.dynamic');

// 2. RSVP & Guestbook Wish Submission Route
Route::post('/v/{slug}/wishes', [GuestWishController::class, 'store'])->name('invitation.wishes.store');

// 3. WeGiftry Wishlist Reserve Item Route
Route::post('/v/{slug}/wishlist/{id}/reserve', [GiftWishlistController::class, 'reserve'])->name('invitation.wishlist.reserve');

// 4. Layar Penerima Tamu / Receptionist Venue Screen & QR Check-in
Route::get('/v/{slug}/receptionist', [ReceptionistController::class, 'show'])->name('invitation.receptionist.show');
Route::post('/v/{slug}/checkin', [ReceptionistController::class, 'checkIn'])->name('invitation.receptionist.checkin');

// 5. Purchase & Checkout Route
Route::post('/checkout/{slug}', [CheckoutController::class, 'checkout'])->name('checkout.store');

Route::get('/demo/editor', function () {
    return Inertia::render('Customer/Invitations/Edit');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Admin Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/templates', function () {
        return Inertia::render('Admin/Templates/Index');
    })->name('admin.templates.index');
});

// Customer Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/customer/invitations/edit', [UserInvitationController::class, 'edit'])->name('customer.invitations.edit');
    Route::post('/customer/invitations/save/{id}', [UserInvitationController::class, 'update'])->name('customer.invitations.update');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
