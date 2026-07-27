<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
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

            <!-- Templates Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <!-- Template 1: Floral -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#fdfbf7] shadow-sm flex flex-col items-center justify-center border border-gray-200">
                            <h3 class="text-xl text-yellow-700 italic font-serif">Floral Suite</h3>
                        </div>
                        <span class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">FLORAL</span>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div class="mb-4">
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">Peony Blossom Suite</h3>
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                                </button>
                            </div>
                            <p class="text-sm text-gray-500">Complete wedding stationery set</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-4">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                                    <p class="text-lg font-bold text-gray-900">Rp 150.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Sold</p>
                                    <p class="text-lg font-bold text-gray-900">1,204</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    <span class="text-xs font-bold text-green-700 uppercase tracking-wider">PUBLISHED</span>
                                </div>
                                <a href="#" class="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center group-hover:underline">
                                    Edit Details <span class="ml-1">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template 2: Modern -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-56 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-gray-50 shadow-sm flex flex-col items-center justify-center border border-gray-200">
                            <h3 class="text-xl text-gray-900 font-bold uppercase tracking-widest font-sans">The Minimal</h3>
                        </div>
                        <span class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">MODERN</span>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div class="mb-4">
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">The Bauhaus Minimal</h3>
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                                </button>
                            </div>
                            <p class="text-sm text-gray-500">Editorial style event flyer</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-4">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                                    <p class="text-lg font-bold text-gray-900">Rp 100.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Sold</p>
                                    <p class="text-lg font-bold text-gray-900">856</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    <span class="text-xs font-bold text-green-700 uppercase tracking-wider">PUBLISHED</span>
                                </div>
                                <a href="#" class="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center group-hover:underline">
                                    Edit Details <span class="ml-1">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Template 3: Traditional -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                    <div class="h-56 bg-[#2A2A2A] relative overflow-hidden flex items-center justify-center p-4">
                        <div class="w-full h-full bg-[#1A1A1A] shadow-sm flex flex-col items-center justify-center border border-gray-700">
                            <h3 class="text-xl text-yellow-500 font-serif font-bold tracking-widest text-center px-4">Damask<br>Gold</h3>
                        </div>
                        <div class="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span class="bg-white/90 text-gray-900 font-bold px-4 py-2 rounded shadow-lg tracking-wider text-sm">IN PROGRESS</span>
                        </div>
                        <span class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider z-10">TRADITIONAL</span>
                    </div>
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div class="mb-4">
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">Regal Damask Gold</h3>
                                <button class="text-gray-400 hover:text-gray-600">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                                </button>
                            </div>
                            <p class="text-sm text-gray-500">Classic wedding gala set</p>
                        </div>
                        <div>
                            <div class="flex justify-between items-end mb-4">
                                <div>
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                                    <p class="text-lg font-bold text-gray-900">Rp 250.000</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Sold</p>
                                    <p class="text-lg font-bold text-gray-900">0</p>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                                    <span class="text-xs font-bold text-yellow-700 uppercase tracking-wider">DRAFT</span>
                                </div>
                                <a href="#" class="text-sm font-semibold text-gray-900 hover:text-blue-600 flex items-center group-hover:underline">
                                    Complete Setup <span class="ml-1">&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </AuthenticatedLayout>
</template>
