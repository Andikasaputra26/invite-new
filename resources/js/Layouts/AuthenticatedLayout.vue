<script setup>
import { ref } from 'vue';
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import Dropdown from '@/Components/Dropdown.vue';
import DropdownLink from '@/Components/DropdownLink.vue';
import { Link, usePage } from '@inertiajs/vue3';
import { Sparkles, LayoutDashboard, FileText, ShoppingCart, BarChart3, Users, Settings, HelpCircle, LogOut } from 'lucide-vue-next';

const showingNavigationDropdown = ref(false);
const page = usePage();
</script>

<template>
    <div class="min-h-screen bg-[#FAF9F5] flex font-sans text-slate-800">
        
        <!-- Sidebar (Desktop) -->
        <aside 
            class="hidden md:flex flex-col w-64 fixed inset-y-0 z-20 bg-white border-r border-slate-200/80 shadow-sm transition-all duration-300">
            
            <!-- Logo Area -->
            <div class="h-20 flex items-center px-6 border-b border-slate-100">
                <Link :href="route('dashboard')" class="flex items-center space-x-3 group">
                    <div class="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20 group-hover:scale-105 transition duration-300">
                        <Sparkles class="w-5 h-5 fill-white" />
                    </div>
                    <div class="flex flex-col">
                        <span class="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">
                            UndanganKu
                        </span>
                        <span class="text-[11px] font-semibold text-orange-600 uppercase tracking-wider">
                            {{ $page.props.auth?.user?.role === 'owner' ? 'Creator Suite' : 'Customer Portal' }}
                        </span>
                    </div>
                </Link>
            </div>

            <!-- Navigation Links -->
            <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                
                <!-- Role: Admin (Owner) -->
                <template v-if="$page.props.auth?.user?.role === 'owner'">
                    <Link :href="route('dashboard')" :class="[route().current('dashboard') ? 'bg-orange-50 text-orange-600 font-bold border-r-4 border-orange-500 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900', 'flex items-center px-4 py-3 text-sm rounded-xl transition-all group']">
                        <LayoutDashboard class="mr-3 h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span>Ringkasan Dashboard</span>
                    </Link>
                    <Link :href="route('admin.templates.index')" :class="[route().current('admin.templates.index') ? 'bg-orange-50 text-orange-600 font-bold border-r-4 border-orange-500 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900', 'flex items-center px-4 py-3 text-sm rounded-xl transition-all group']">
                        <FileText class="mr-3 h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span>Katalog Template</span>
                    </Link>
                    <a href="#" class="text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all group">
                        <ShoppingCart class="mr-3 h-5 w-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                        <span>Pesanan Masuk</span>
                    </a>
                    <a href="#" class="text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all group">
                        <BarChart3 class="mr-3 h-5 w-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                        <span>Laporan Keuangan</span>
                    </a>
                    <a href="#" class="text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all group">
                        <Users class="mr-3 h-5 w-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                        <span>Daftar Pelanggan</span>
                    </a>
                </template>

                <!-- Role: Pelanggan (User) -->
                <template v-else>
                    <Link :href="route('dashboard')" :class="[route().current('dashboard') ? 'bg-orange-50 text-orange-600 font-bold border-r-4 border-orange-500 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900', 'flex items-center px-4 py-3 text-sm rounded-xl transition-all group']">
                        <LayoutDashboard class="mr-3 h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span>Undangan Saya</span>
                    </Link>
                    <Link :href="route('customer.invitations.edit')" :class="[route().current('customer.invitations.edit') ? 'bg-orange-50 text-orange-600 font-bold border-r-4 border-orange-500 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900', 'flex items-center px-4 py-3 text-sm rounded-xl transition-all group']">
                        <FileText class="mr-3 h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span>Form Edit Template</span>
                    </Link>
                    <a href="#" class="text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all group">
                        <ShoppingCart class="mr-3 h-5 w-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                        <span>Beli Template Baru</span>
                    </a>
                    <a href="#" class="text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all group">
                        <BarChart3 class="mr-3 h-5 w-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                        <span>Riwayat Transaksi</span>
                    </a>
                </template>

                <a href="#" class="text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all group">
                    <Settings class="mr-3 h-5 w-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                    <span>Pengaturan Akun</span>
                </a>
            </nav>

            <div class="p-4 space-y-1.5 border-t border-slate-100 bg-slate-50/50">
                <a href="#" class="flex items-center px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg transition group">
                    <HelpCircle class="mr-3 h-4 w-4 text-slate-400 group-hover:text-orange-500" />
                    <span>Bantuan & Dukungan</span>
                </a>
                <Link :href="route('logout')" method="post" as="button" class="w-full flex items-center px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition group">
                    <LogOut class="mr-3 h-4 w-4 text-slate-400 group-hover:text-rose-500" />
                    <span>Keluar Akun</span>
                </Link>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 md:ml-64 flex flex-col min-h-screen relative">
            
            <!-- Topbar -->
            <header class="h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-xs">
                <!-- Search -->
                <div class="flex-1 flex">
                    <div class="relative w-full max-w-md">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input type="text" class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-full text-xs bg-slate-50/70 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" placeholder="Cari template, transaksi, atau bantuan...">
                    </div>
                </div>

                <!-- Right items -->
                <div class="ml-4 flex items-center space-x-5">
                    <div class="h-6 w-px bg-slate-200"></div>

                    <!-- Profile Dropdown -->
                    <Dropdown align="right" width="48">
                        <template #trigger>
                            <button type="button" class="flex items-center text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none transition duration-150 ease-in-out">
                                <div class="text-right mr-3 hidden sm:block">
                                    <div class="text-sm font-bold text-slate-900 leading-tight">{{ $page.props.auth?.user?.name || 'User Pelanggan' }}</div>
                                    <div class="text-[10px] text-orange-600 font-extrabold tracking-wider uppercase">Lisensi Premium</div>
                                </div>
                                <img class="h-9 w-9 rounded-full object-cover border-2 border-orange-500 shadow-sm" :src="'https://ui-avatars.com/api/?name='+ encodeURIComponent($page.props.auth?.user?.name || 'User') +'&color=ffffff&background=f97316'" alt="Avatar">
                            </button>
                        </template>
                        <template #content>
                            <DropdownLink :href="route('profile.edit')">
                                Profil Akun
                            </DropdownLink>
                            <DropdownLink :href="route('logout')" method="post" as="button">
                                Log Out
                            </DropdownLink>
                        </template>
                    </Dropdown>
                </div>
            </header>

            <!-- Main view slot -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-[#FAF9F5] p-4 sm:p-8">
                <slot />
            </main>
        </div>
    </div>
</template>
