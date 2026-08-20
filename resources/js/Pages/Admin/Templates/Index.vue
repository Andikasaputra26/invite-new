<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { Sliders, Eye, Plus } from 'lucide-vue-next';
</script>

<template>
    <Head title="Template Management" />

    <AuthenticatedLayout>
        <div class="p-8 max-w-7xl mx-auto">
            
            <!-- Header Section -->
            <div class="flex justify-between items-start mb-8">
                <div>
                    <h1 class="text-3xl font-serif font-bold text-gray-900 tracking-tight">Template Management</h1>
                    <p class="mt-1 text-gray-500 text-sm">Curate and manage your event invitation collection.</p>
                </div>
                <button class="bg-[#111827] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition shadow-md flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    Tambah Template Baru
                </button>
            </div>

            <!-- Filter & Sort Bar -->
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex justify-between items-center mb-8">
                <div class="flex items-center space-x-4">
                    <span class="text-sm font-medium text-gray-500 flex items-center ml-2">
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        Filter by Category
                    </span>
                    <div class="flex space-x-2">
                        <button class="bg-[#111827] text-white px-4 py-1.5 rounded-md text-sm font-semibold shadow-sm">All</button>
                        <button class="text-gray-600 hover:bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium transition">Floral</button>
                        <button class="text-gray-600 hover:bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium transition">Modern</button>
                        <button class="text-gray-600 hover:bg-gray-100 px-4 py-1.5 rounded-md text-sm font-medium transition">Traditional</button>
                    </div>
                </div>
                <div class="flex items-center text-sm mr-2">
                    <span class="text-gray-500 mr-2">Sort by:</span>
                    <button class="font-bold text-gray-900 flex items-center">
                        Most Recent
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                </div>
            </div>

            <!-- Templates Grid (4 Unique Master Templates) -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <!-- Template 1: Midnight Gold -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-48 bg-[#090d16] relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#051711] shadow-sm flex flex-col items-center justify-center border border-amber-500/40 rounded-xl p-3 text-center">
                            <h3 class="text-lg text-amber-400 font-serif font-bold italic">Midnight Gold</h3>
                            <span class="text-[10px] text-slate-300">Royal Emerald & Gold</span>
                        </div>
                        <span class="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow uppercase">LUXURY</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="mb-3">
                            <h3 class="text-base font-bold text-gray-900 leading-tight mb-1">Midnight Serenade Gold</h3>
                            <p class="text-xs text-gray-500">Royal Emerald & Gold Luxury Suite</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-3">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                    <p class="text-base font-bold text-gray-900">Rp 149.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Terjual</p>
                                    <p class="text-base font-bold text-gray-900">1,204</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span class="text-xs font-bold text-green-700 uppercase flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> PUBLISHED
                                </span>
                                <Link href="/customer/invitations/edit?template=midnight-gold" class="text-xs font-bold text-slate-900 hover:text-amber-600 transition flex items-center">
                                    <Sliders class="w-3.5 h-3.5 mr-1 text-amber-500" /> Edit Master &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template 2: Floral Rose -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-48 bg-[#1f1318] relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#2a1720] shadow-sm flex flex-col items-center justify-center border border-pink-400/40 rounded-xl p-3 text-center">
                            <h3 class="text-lg text-pink-300 font-serif font-bold italic">Floral Garden</h3>
                            <span class="text-[10px] text-pink-200">Blush Rose & Pastel</span>
                        </div>
                        <span class="absolute top-3 right-3 bg-pink-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow uppercase">ROMANTIC</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="mb-3">
                            <h3 class="text-base font-bold text-gray-900 leading-tight mb-1">Floral Garden Romance</h3>
                            <p class="text-xs text-gray-500">Sweet Soft Rose & Cream Suite</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-3">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                    <p class="text-base font-bold text-gray-900">Rp 129.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Terjual</p>
                                    <p class="text-base font-bold text-gray-900">856</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span class="text-xs font-bold text-green-700 uppercase flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> PUBLISHED
                                </span>
                                <Link href="/customer/invitations/edit?template=rose-romance" class="text-xs font-bold text-slate-900 hover:text-pink-600 transition flex items-center">
                                    <Sliders class="w-3.5 h-3.5 mr-1 text-pink-500" /> Edit Master &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template 3: Emerald Botanical -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-48 bg-[#062c1e] relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#0a422e] shadow-sm flex flex-col items-center justify-center border border-emerald-400/40 rounded-xl p-3 text-center">
                            <h3 class="text-lg text-emerald-300 font-serif font-bold italic">Emerald Botanical</h3>
                            <span class="text-[10px] text-emerald-200">Mint Glassmorphism</span>
                        </div>
                        <span class="absolute top-3 right-3 bg-emerald-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow uppercase">BOTANICAL</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="mb-3">
                            <h3 class="text-base font-bold text-gray-900 leading-tight mb-1">Emerald Botanical Haven</h3>
                            <p class="text-xs text-gray-500">Nature Glassmorphism & Mint</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-3">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                    <p class="text-base font-bold text-gray-900">Rp 139.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Terjual</p>
                                    <p class="text-base font-bold text-gray-900">512</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span class="text-xs font-bold text-green-700 uppercase flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> PUBLISHED
                                </span>
                                <Link href="/customer/invitations/edit?template=emerald-botanical" class="text-xs font-bold text-slate-900 hover:text-emerald-600 transition flex items-center">
                                    <Sliders class="w-3.5 h-3.5 mr-1 text-emerald-500" /> Edit Master &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template 4: Royal Velvet Sapphire -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-48 bg-[#09132b] relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#0d1b3e] shadow-sm flex flex-col items-center justify-center border border-sky-400/40 rounded-xl p-3 text-center">
                            <h3 class="text-lg text-sky-300 font-serif font-bold italic">Royal Sapphire</h3>
                            <span class="text-[10px] text-sky-200">Platinum & Ice Blue</span>
                        </div>
                        <span class="absolute top-3 right-3 bg-sky-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow uppercase">SAPPHIRE</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="mb-3">
                            <h3 class="text-base font-bold text-gray-900 leading-tight mb-1">Royal Velvet Sapphire</h3>
                            <p class="text-xs text-gray-500">Regal Sapphire & Silver Platinum</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-3">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                    <p class="text-base font-bold text-gray-900">Rp 169.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Terjual</p>
                                    <p class="text-base font-bold text-gray-900">420</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span class="text-xs font-bold text-green-700 uppercase flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> PUBLISHED
                                </span>
                                <Link href="/customer/invitations/edit?template=royal-velvet" class="text-xs font-bold text-slate-900 hover:text-sky-600 transition flex items-center">
                                    <Sliders class="w-3.5 h-3.5 mr-1 text-sky-500" /> Edit Master &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template 5: Terracotta Rustic Warmth -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-48 bg-[#1c0f0a] relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#291710] shadow-sm flex flex-col items-center justify-center border border-amber-600/40 rounded-xl p-3 text-center">
                            <h3 class="text-lg text-amber-400 font-serif font-bold italic">Terracotta Boho</h3>
                            <span class="text-[10px] text-amber-200">Clay Amber & Pampas</span>
                        </div>
                        <span class="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow uppercase">VINTAGE</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="mb-3">
                            <h3 class="text-base font-bold text-gray-900 leading-tight mb-1">Terracotta Rustic Warmth</h3>
                            <p class="text-xs text-gray-500">Boho Earthy Clay & Amber Warmth</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-3">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                    <p class="text-base font-bold text-gray-900">Rp 159.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Terjual</p>
                                    <p class="text-base font-bold text-gray-900">630</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span class="text-xs font-bold text-green-700 uppercase flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> PUBLISHED
                                </span>
                                <Link href="/customer/invitations/edit?template=boho-terracotta" class="text-xs font-bold text-slate-900 hover:text-amber-700 transition flex items-center">
                                    <Sliders class="w-3.5 h-3.5 mr-1 text-amber-600" /> Edit Master &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template 6: Nordic Monochrome Minimalist -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-48 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#18181b] shadow-sm flex flex-col items-center justify-center border border-zinc-500/40 rounded-xl p-3 text-center">
                            <h3 class="text-lg text-zinc-100 font-sans font-light uppercase tracking-widest">Nordic Monochrome</h3>
                            <span class="text-[10px] text-zinc-400">Architectural B&W</span>
                        </div>
                        <span class="absolute top-3 right-3 bg-zinc-100 text-zinc-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow uppercase">MINIMALIST</span>
                    </div>
                    <div class="p-5 flex-1 flex flex-col justify-between">
                        <div class="mb-3">
                            <h3 class="text-base font-bold text-gray-900 leading-tight mb-1">Nordic Monochrome Minimalist</h3>
                            <p class="text-xs text-gray-500">High-Fashion Black & Pure Off-White</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-3">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</p>
                                    <p class="text-base font-bold text-gray-900">Rp 179.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Terjual</p>
                                    <p class="text-base font-bold text-gray-900">789</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span class="text-xs font-bold text-green-700 uppercase flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span> PUBLISHED
                                </span>
                                <Link href="/customer/invitations/edit?template=minimalist-monochrome" class="text-xs font-bold text-slate-900 hover:text-zinc-600 transition flex items-center">
                                    <Sliders class="w-3.5 h-3.5 mr-1 text-zinc-700" /> Edit Master &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </AuthenticatedLayout>
</template>
