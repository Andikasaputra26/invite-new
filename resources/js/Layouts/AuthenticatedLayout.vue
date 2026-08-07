<script setup>
import { ref } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import { Link, usePage } from '@inertiajs/vue3';

const showingNavigationDropdown = ref(false);
const page = usePage();
</script>

<template>
    <div class="min-h-screen bg-[#F8FAFC] flex font-sans">
        
        <!-- Sidebar (Desktop) -->
        <aside 
            :class="[
                'hidden md:flex flex-col w-64 fixed inset-y-0 z-10 transition-all duration-300',
                $page.props.auth?.user?.role === 'owner' ? 'bg-[#161B22] text-white' : 'bg-white border-r border-gray-200 text-gray-800 shadow-sm'
            ]">
            
            <!-- Logo Area -->
            <div :class="['h-20 flex items-center px-6', $page.props.auth?.user?.role === 'owner' ? 'border-b border-gray-800' : '']">
                <Link :href="route('dashboard')" class="flex flex-col">
                    <span :class="['text-xl font-bold tracking-tight', $page.props.auth?.user?.role === 'owner' ? 'text-white' : 'text-gray-900']">
                        UndanganKu
                    </span>
                    <span :class="['text-xs font-medium', $page.props.auth?.user?.role === 'owner' ? 'text-gray-400' : 'text-gray-500']">
                        {{ $page.props.auth?.user?.role === 'owner' ? 'Creator Dashboard' : 'Customer Dashboard' }}
                    </span>
                </Link>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                
                <!-- Role: Admin (Owner) -->
                <template v-if="$page.props.auth?.user?.role === 'owner'">
                    <Link :href="route('dashboard')" :class="{'bg-gray-800 text-[#F5C518] border border-gray-700 shadow-sm': route().current('dashboard'), 'text-gray-400 hover:text-white': !route().current('dashboard')}" class="flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Ringkasan
                    </Link>
                    <Link :href="route('admin.templates.index')" :class="{'bg-gray-800 text-[#F5C518] border border-gray-700 shadow-sm': route().current('admin.templates.index'), 'text-gray-400 hover:text-white': !route().current('admin.templates.index')}" class="flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Produk Template
                    </Link>
                    <a href="#" class="text-gray-400 hover:text-white flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Pesanan Masuk
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        Laporan Keuangan
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Pelanggan
                    </a>
                    <a href="#" class="text-gray-400 hover:text-white flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Pengaturan
                    </a>
                </template>

                <!-- Role: Pelanggan (User) -->
                <template v-else>
                    <Link :href="route('dashboard')" :class="{'bg-[#E8F0FE] text-blue-700': route().current('dashboard'), 'text-gray-600 hover:bg-gray-100 hover:text-gray-900': !route().current('dashboard')}" class="flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Undangan Saya
                    </Link>
                    <a href="#" class="text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Beli Template Baru
                    </a>
                    <a href="#" class="text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Riwayat Transaksi
                    </a>
                    <a href="#" class="text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center px-4 py-3 text-sm font-semibold rounded-lg transition-colors group">
                        <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profil
                    </a>
                </template>
            </nav>

            <div :class="['p-4 space-y-2', $page.props.auth?.user?.role === 'owner' ? 'border-t border-gray-800' : 'border-t border-gray-200']">
                <a href="#" :class="['flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors group', $page.props.auth?.user?.role === 'owner' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50']">
                    <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help Center
                </a>
                <Link :href="route('logout')" method="post" as="button" :class="['w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors group', $page.props.auth?.user?.role === 'owner' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600 hover:bg-red-50']">
                    <svg class="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </Link>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 md:ml-64 flex flex-col min-h-screen relative">
            
            <!-- Topbar -->
            <header class="h-20 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 lg:px-10 z-0 sticky top-0">
                <!-- Search -->
                <div class="flex-1 flex">
                    <div class="relative w-full max-w-md">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input type="text" class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 focus:border-gray-300 sm:text-sm transition-all" placeholder="Search analytics...">
                    </div>
                </div>

                <!-- Right items -->
                <div class="ml-4 flex items-center space-x-5">
                    <!-- Notifications -->
                    <button class="text-gray-400 hover:text-gray-600 relative transition">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span class="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                    <!-- Messages -->
                    <button class="text-gray-400 hover:text-gray-600 transition">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>

                    <div class="h-6 w-px bg-gray-200"></div>

                    <!-- Profile Dropdown -->
                    <Dropdown align="right" width="48">
                        <template #trigger>
                            <button type="button" class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none transition duration-150 ease-in-out">
                                <div class="text-right mr-3 hidden sm:block">
                                    <div class="text-sm font-bold text-gray-900 leading-tight">{{ $page.props.auth?.user?.name || 'User' }}</div>
                                    <div class="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">{{ $page.props.auth?.user?.role === 'owner' ? 'Premium Account' : 'Premium Member' }}</div>
                                </div>
                                <img class="h-9 w-9 rounded-full object-cover border border-gray-200 shadow-sm" :src="'https://ui-avatars.com/api/?name='+ encodeURIComponent($page.props.auth?.user?.name || 'User') +'&color=111827&background=F3F4F6'" alt="Avatar">
                            </button>
                        </template>
                        <template #content>
                            <DropdownLink :href="route('profile.edit')">
                                Profile
                            </DropdownLink>
                            <DropdownLink :href="route('logout')" method="post" as="button">
                                Log Out
                            </DropdownLink>
                        </template>
                    </Dropdown>
                </div>
            </header>

            <!-- Main view -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC]">
                <slot />
            </main>
        </div>
    </div>
</template>
