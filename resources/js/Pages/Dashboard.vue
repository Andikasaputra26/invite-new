<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Dashboard" />

    <AuthenticatedLayout>
        <!-- TAMPILAN UNTUK OWNER (ADMIN) -->
        <div v-if="$page.props.auth.user.role === 'owner'" class="p-8 max-w-7xl mx-auto">
            
            <!-- Header Section -->
            <div class="flex justify-between items-start mb-8">
                <div>
                    <h1 class="text-3xl font-serif font-bold text-gray-900 tracking-tight">Ringkasan Dashboard</h1>
                    <p class="mt-1 text-gray-500 text-sm">Selamat datang kembali! Berikut adalah performa penjualan digital Anda untuk bulan ini.</p>
                </div>
                <button class="bg-[#111827] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition shadow-md flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Create New Template
                </button>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <!-- Card 1: Total Pendapatan -->
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div class="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Total Pendapatan</div>
                        <div class="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                    </div>
                    <div class="flex items-baseline space-x-2">
                        <h2 class="text-2xl font-bold text-gray-900">Rp 45.2M</h2>
                        <span class="text-xs font-semibold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">+12%</span>
                    </div>
                </div>

                <!-- Card 2: Pesanan Hari Ini -->
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div class="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Pesanan Hari Ini</div>
                        <div class="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        </div>
                    </div>
                    <div class="flex items-baseline space-x-2">
                        <h2 class="text-2xl font-bold text-gray-900">124</h2>
                        <span class="text-xs font-semibold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">+8%</span>
                    </div>
                </div>

                <!-- Card 3: Template Aktif -->
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div class="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Template Aktif</div>
                        <div class="bg-gray-100 p-2 rounded-lg text-gray-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                        </div>
                    </div>
                    <div class="flex items-baseline space-x-2">
                        <h2 class="text-2xl font-bold text-gray-900">56</h2>
                        <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Static</span>
                    </div>
                </div>

                <!-- Card 4: Total Pelanggan -->
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                    <div class="flex justify-between items-start">
                        <div class="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Total Pelanggan</div>
                        <div class="bg-amber-100 p-2 rounded-lg text-amber-700">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                    </div>
                    <div class="flex items-baseline space-x-2">
                        <h2 class="text-2xl font-bold text-gray-900">1.8k</h2>
                        <span class="text-xs font-semibold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">+24%</span>
                    </div>
                </div>
            </div>

            <!-- Chart and Report Row -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Chart Area -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2 flex flex-col">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-sm font-semibold text-gray-800">Tren Penjualan Bulanan</h3>
                        <div class="flex items-center text-xs text-gray-400 font-medium">
                            <span class="w-2 h-2 rounded-full bg-gray-800 mr-2"></span>
                            REVENUE 2024
                        </div>
                    </div>
                    <div class="flex-1 flex items-end justify-between px-4 pb-2 relative min-h-[200px]">
                        <!-- Fake Chart Grid Lines -->
                        <div class="absolute inset-0 border-b border-gray-100 mb-8"></div>
                        <div class="absolute inset-0 border-b border-gray-100 mb-20"></div>
                        <div class="absolute inset-0 border-b border-gray-100 mb-32"></div>
                        
                        <!-- Fake Chart Bars -->
                        <div class="w-full flex justify-between items-end h-full z-10 space-x-2 pt-10">
                            <div class="w-full bg-gray-100 rounded-t-sm h-[30%] hover:bg-gray-200 transition"></div>
                            <div class="w-full bg-gray-100 rounded-t-sm h-[45%] hover:bg-gray-200 transition"></div>
                            <div class="w-full bg-gray-100 rounded-t-sm h-[35%] hover:bg-gray-200 transition"></div>
                            <div class="w-full bg-gray-100 rounded-t-sm h-[60%] hover:bg-gray-200 transition"></div>
                            <div class="w-full bg-gray-100 rounded-t-sm h-[50%] hover:bg-gray-200 transition"></div>
                            <div class="w-full bg-gray-100 rounded-t-sm h-[75%] hover:bg-gray-200 transition"></div>
                            <div class="w-full bg-gray-800 rounded-t-sm h-[90%] shadow-md"></div>
                        </div>
                    </div>
                    <div class="flex justify-between text-[10px] text-gray-400 font-semibold px-4 pt-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span class="text-gray-800 font-bold">Jul</span>
                    </div>
                </div>

                <!-- Exclusive Report Card -->
                <div class="bg-[#0B0F19] rounded-2xl shadow-lg p-8 flex flex-col justify-between text-white lg:col-span-1 relative overflow-hidden">
                    <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5 blur-2xl"></div>
                    <div>
                        <h3 class="text-2xl font-serif font-bold mb-4">Exclusive Report</h3>
                        <p class="text-gray-400 text-sm leading-relaxed mb-8">Pelajari perilaku pembeli bulan ini untuk meningkatkan konversi template Anda.</p>
                    </div>
                    <button class="w-full bg-white text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition shadow-lg">
                        Download PDF Insight
                    </button>
                </div>
            </div>

            <!-- Recent Orders Table -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                <div class="flex justify-between items-center p-6 border-b border-gray-50">
                    <h3 class="text-sm font-semibold text-gray-800">Pesanan Terbaru</h3>
                    <a href="#" class="text-sm font-medium text-yellow-600 hover:text-yellow-700 flex items-center">
                        Lihat Semua <span class="ml-1">&rarr;</span>
                    </a>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-100">
                        <thead class="bg-gray-50/50">
                            <tr>
                                <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">ID Pesanan</th>
                                <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Pelanggan</th>
                                <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Template</th>
                                <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" class="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-50">
                            <!-- Row 1 -->
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#ORD-9021</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">AW</div>
                                        <div class="ml-3 text-sm font-medium text-gray-700">Ahmad Wijaya</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">Midnight Elegance Suite</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full bg-green-100 text-green-700">Lunas</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">Rp 450.000</td>
                            </tr>
                            <!-- Row 2 -->
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#ORD-9020</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-xs font-bold text-yellow-700">SL</div>
                                        <div class="ml-3 text-sm font-medium text-gray-700">Siska Larasati</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">Rustic Garden RSVP</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">Rp 125.000</td>
                            </tr>
                            <!-- Row 3 -->
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#ORD-9019</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">BR</div>
                                        <div class="ml-3 text-sm font-medium text-gray-700">Bambang Raharjo</div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">Minimalist Noir Bundle</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-3 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full bg-green-100 text-green-700">Lunas</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">Rp 890.000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Floating Action Button -->
            <button class="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 p-4 rounded-full shadow-lg transition-transform hover:scale-105">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            </button>
        </div>

        <!-- TAMPILAN UNTUK PELANGGAN (USER) -->
        <div v-else class="p-8 max-w-7xl mx-auto">
            
            <!-- Header Section -->
            <div class="mb-10 mt-4">
                <h1 class="text-3xl font-serif font-bold text-gray-900 tracking-tight mb-2">Selamat datang kembali, {{ $page.props.auth.user.name }}</h1>
                <p class="text-gray-600 text-sm max-w-2xl">Kelola desain stationery acara spesial Anda dengan mudah di dashboard eksklusif Luxe Stationery.</p>
            </div>

            <div class="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h2 class="text-xl font-bold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    Undangan Saya
                </h2>
                <button class="bg-[#111827] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition shadow-sm flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Beli Template Baru
                </button>
            </div>
            
            <!-- Projects Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                
                <!-- Project Card 1: Ready -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
                        <!-- Mock Image content -->
                        <div class="w-full h-full bg-[#fdfbf7] shadow-sm flex flex-col items-center justify-center border border-gray-200 font-serif text-center p-4">
                            <p class="text-[8px] text-gray-500 uppercase tracking-widest mb-2">Together with their families</p>
                            <h3 class="text-xl text-yellow-700 italic">Eleanor Rose Sterling</h3>
                            <span class="text-xs text-gray-400 my-1">&</span>
                            <h3 class="text-xl text-yellow-700 italic">Alexander James Vance</h3>
                        </div>
                        <span class="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200">SIAP DIGUNAKAN</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between border-t border-gray-100">
                        <div class="mb-4">
                            <h3 class="text-lg font-bold text-gray-900 mb-1">Wedding of Budi & Ani</h3>
                            <p class="text-xs text-gray-500">Template: Midnight Serenade Gold</p>
                        </div>
                        <div class="space-y-2">
                            <Link :href="route('customer.invitations.edit')" class="block text-center w-full bg-[#111827] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition">Edit Detail Undangan</Link>
                            <button class="w-full bg-white text-gray-700 border border-gray-300 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition">Lihat Preview</button>
                        </div>
                    </div>
                </div>

                <!-- Project Card 2: In Progress -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
                        <!-- Mock Image content -->
                        <div class="w-full h-full bg-white shadow-sm flex flex-col items-center justify-center border border-gray-200 text-center p-4">
                            <h3 class="text-2xl font-black text-red-500 uppercase tracking-tighter">You're Invited!</h3>
                            <h2 class="text-3xl font-black text-blue-600 uppercase">To Leo's</h2>
                            <h3 class="text-xl font-black text-yellow-500 uppercase">5th Birthday Bash!</h3>
                        </div>
                        <span class="absolute top-4 right-4 bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-200">SEDANG DIEDIT</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between border-t border-gray-100">
                        <div class="mb-4">
                            <h3 class="text-lg font-bold text-gray-900 mb-1">Kiara's 5th Birthday</h3>
                            <p class="text-xs text-gray-500">Template: Pastel Rainbow Confetti</p>
                        </div>
                        <div class="space-y-2">
                            <Link :href="route('customer.invitations.edit')" class="block text-center w-full bg-[#111827] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition">Edit Detail Undangan</Link>
                            <button class="w-full bg-white text-gray-700 border border-gray-300 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition">Lihat Preview</button>
                        </div>
                    </div>
                </div>

                <!-- Empty State Card (Create New) -->
                <div class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center p-8 min-h-[380px] group">
                    <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Buat Undangan Baru</h3>
                    <p class="text-sm text-gray-500 text-center max-w-[200px]">Mulai proyek stationery baru untuk momen spesial Anda.</p>
                </div>

            </div>

            <!-- Popular Templates Section -->
            <div class="flex justify-between items-center mb-6 pt-6 border-t border-gray-200">
                <div>
                    <h2 class="text-2xl font-serif font-bold text-gray-900">Template Populer</h2>
                    <p class="text-sm text-gray-500">Inspirasi terbaru untuk menyempurnakan hari bahagia Anda.</p>
                </div>
                <a href="#" class="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center">
                    Lihat Semua <span class="ml-1">&rarr;</span>
                </a>
            </div>
            
            <!-- Pop Templates placeholder blocks -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
                <div class="h-48 bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer">
                    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
                </div>
                <div class="h-48 bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer">
                    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
                </div>
                <div class="h-48 bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer">
                    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
                </div>
                <div class="h-48 bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer">
                    <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
                </div>
            </div>

        </div>

    </AuthenticatedLayout>
</template>
