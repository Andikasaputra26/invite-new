<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Editor Undangan" />

    <AuthenticatedLayout>
        <div class="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white">
            
            <div class="w-full lg:w-[55%] flex flex-col h-full border-r border-gray-200">
                
                <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <Link :href="route('dashboard')" class="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            Kembali ke Dashboard
                        </Link>
                        <h1 class="text-2xl font-bold text-gray-900">Kustomisasi Undangan</h1>
                        <p class="text-sm text-gray-500 font-medium">Midnight Serenade Gold</p>
                    </div>
                    <div class="flex space-x-3">
                        <a href="/demo/invitation" target="_blank" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center">
                            Lihat Hasil Akhir
                        </a>
                        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition">
                            Simpan Perubahan
                        </button>
                    </div>
                </div>

                <div class="px-8 border-b border-gray-200">
                    <nav class="-mb-px flex space-x-8">
                        <a href="#" class="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm">
                            Data Mempelai
                        </a>
                        <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Acara
                        </a>
                        <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                            Galeri Foto
                        </a>
                    </nav>
                </div>

                <div class="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                    
                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 class="text-lg font-bold text-gray-900 flex items-center">
                                <span class="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">👨</span>
                                Mempelai Pria
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                <input type="text" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border" value="Ahmad Wijaya Kusuma">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Panggilan</label>
                                <input type="text" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border" value="Ahmad">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Orang Tua</label>
                                <textarea rows="2" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border">Putra pertama dari Bpk. Budi Santoso & Ibu Ratna</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-100 bg-pink-50/50">
                            <h3 class="text-lg font-bold text-gray-900 flex items-center">
                                <span class="bg-pink-100 text-pink-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">👩</span>
                                Mempelai Wanita
                            </h3>
                        </div>
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                                <input type="text" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 border" value="Siti Aminah">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Panggilan</label>
                                <input type="text" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 border" value="Aminah">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-1">Nama Orang Tua</label>
                                <textarea rows="2" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm p-2.5 border">Putri kedua dari Bpk. Supardi & Ibu Yuliana</textarea>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div class="hidden lg:flex w-[45%] bg-[#E8F0FE] flex-col items-center justify-center relative overflow-hidden">
                <div class="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
                <div class="absolute bottom-10 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

                <div class="mb-4 z-10 flex items-center space-x-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-bold text-gray-700">
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Live Preview Aktif</span>
                </div>

                <div class="relative w-[340px] h-[680px] bg-black rounded-[40px] shadow-2xl border-[8px] border-black z-10 overflow-hidden flex flex-col">
                    <div class="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
                        <div class="w-32 h-6 bg-black rounded-b-2xl"></div>
                    </div>
                    
                    <div class="flex-1 bg-[#1a1a2e] w-full h-full relative overflow-hidden flex flex-col items-center justify-center text-center p-8">
                        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                        
                        <p class="text-[#e9c46a] text-xs uppercase tracking-[0.3em] mb-6 z-10">The Wedding Of</p>
                        
                        <h2 class="text-5xl font-serif text-white italic mb-4 z-10 drop-shadow-md">Ahmad</h2>
                        <span class="text-[#e9c46a] font-serif text-2xl italic z-10">&</span>
                        <h2 class="text-5xl font-serif text-white italic mt-4 mb-12 z-10 drop-shadow-md">Aminah</h2>
                        
                        <div class="z-10 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl w-full">
                            <p class="text-white text-sm font-light mb-1">Sabtu, 24 Agustus 2024</p>
                            <p class="text-white text-xs opacity-70">Gedung Serbaguna Senayan</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </AuthenticatedLayout>
</template>
