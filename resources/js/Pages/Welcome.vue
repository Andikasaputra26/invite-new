<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { 
    CheckCircle2, Users, MessageSquareHeart, 
    Gift, QrCode, Music, Menu, X, Eye, ChevronRight
} from 'lucide-vue-next';

defineProps({
    canLogin: Boolean,
    canRegister: Boolean,
});

const isMobileMenuOpen = ref(false);

const activeCategory = ref('All');
const categories = ['All', 'Minimalis', 'Rustik', 'Modern', 'Islamic'];

const templates = [
    {
        id: 1,
        slug: 'midnight-gold',
        name: 'Midnight Serenade Gold',
        tag: 'Royal Gold Luxury',
        category: 'Modern',
        price: 'Rp 149.000',
        originalPrice: 'Rp 249.000',
        discount: 'HEMAT 40%',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        borderColor: 'hover:border-amber-400/80',
        tagClass: 'text-amber-700 bg-amber-50 border-amber-200/60',
        priceColor: 'text-amber-600',
        btnClass: 'bg-amber-500 hover:bg-amber-600 text-slate-950',
        delay: 100,
    },
    {
        id: 2,
        slug: 'rose-romance',
        name: 'Floral Garden Romance',
        tag: 'Blush Rose & Pastel',
        category: 'Minimalis',
        price: 'Rp 99.000',
        originalPrice: 'Rp 189.000',
        discount: 'HEMAT 47%',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
        borderColor: 'hover:border-pink-400/80',
        tagClass: 'text-pink-700 bg-pink-50 border-pink-200/60',
        priceColor: 'text-pink-600',
        btnClass: 'bg-pink-500 hover:bg-pink-600 text-white',
        delay: 200,
    },
    {
        id: 3,
        slug: 'emerald-botanical',
        name: 'Emerald Botanical',
        tag: 'Nature & Mint Glass',
        category: 'Rustik',
        price: 'Rp 119.000',
        originalPrice: 'Rp 209.000',
        discount: 'HEMAT 43%',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
        borderColor: 'hover:border-emerald-400/80',
        tagClass: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
        priceColor: 'text-emerald-600',
        btnClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        delay: 300,
    },
    {
        id: 4,
        slug: 'royal-velvet',
        name: 'Royal Velvet Sapphire',
        tag: 'Regal Platinum Sapphire',
        category: 'Islamic',
        price: 'Rp 139.000',
        originalPrice: 'Rp 239.000',
        discount: 'HEMAT 42%',
        image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
        borderColor: 'hover:border-sky-400/80',
        tagClass: 'text-sky-700 bg-sky-50 border-sky-200/60',
        priceColor: 'text-sky-600',
        btnClass: 'bg-sky-500 hover:bg-sky-600 text-white',
        delay: 400,
    }
];

const filteredTemplates = computed(() => {
    if (activeCategory.value === 'All') return templates;
    return templates.filter(t => t.category === activeCategory.value);
});
</script>

<template>
    <Head title="Buat Undangan Digital Elegan" />
    
    <div class="min-h-screen bg-white font-sans text-slate-800">
        <!-- Navbar -->
        <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <Link href="/" class="text-2xl font-bold text-red-700 tracking-tighter">
                            Undangan<span class="text-slate-800">Ku</span>
                        </Link>
                    </div>
                    
                    <div class="hidden md:flex space-x-8">
                        <a href="#fitur" class="text-sm font-medium text-slate-600 hover:text-red-600 transition">Fitur</a>
                        <a href="#katalog" class="text-sm font-medium text-slate-600 hover:text-red-600 transition">Katalog</a>

                        <a href="#faq" class="text-sm font-medium text-slate-600 hover:text-red-600 transition">FAQ</a>
                    </div>
                    
                    <div class="hidden md:flex items-center space-x-4">
                        <Link v-if="!$page.props.auth?.user" :href="route('login')" class="text-sm font-medium text-slate-700 hover:text-red-600">Masuk</Link>
                        <Link v-else :href="route('dashboard')" class="text-sm font-medium text-slate-700 hover:text-red-600">Dashboard</Link>
                        
                        <Link :href="route('register')" class="px-5 py-2 text-sm font-medium text-white bg-red-700 rounded-full hover:bg-red-800 transition shadow-md hover:shadow-lg">
                            Mulai Sekarang
                        </Link>
                    </div>
                    
                    <!-- Mobile menu button -->
                    <div class="md:hidden flex items-center">
                        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-500 hover:text-red-600">
                            <Menu v-if="!isMobileMenuOpen" class="h-6 w-6" />
                            <X v-else class="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Mobile Menu -->
            <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-b border-gray-100 p-4 space-y-4 shadow-lg absolute w-full">
                <a href="#fitur" class="block text-base font-medium text-slate-700 hover:text-red-600" @click="isMobileMenuOpen = false">Fitur</a>
                <a href="#katalog" class="block text-base font-medium text-slate-700 hover:text-red-600" @click="isMobileMenuOpen = false">Katalog</a>

                <hr />
                <Link :href="route('login')" class="block text-base font-medium text-slate-700 hover:text-red-600">Masuk</Link>
                <Link :href="route('register')" class="block text-base font-medium text-red-700">Mulai Sekarang</Link>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    <div v-motion-slide-visible-bottom :delay="100">
                        <div class="inline-block px-4 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold tracking-wide uppercase mb-6 border border-red-100">
                            ✨ #1 Dipercaya Calon Pengantin
                        </div>
                        <h1 class="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                            Buat Undangan Digital <br/><span class="text-red-700 italic font-serif font-medium">Elegan</span> 1 Dalam Menit.
                        </h1>
                        <p class="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                            Pilih template favoritmu, bayar mudah via QRIS/Transfer, dan sebar ke ribuan tamu dengan link custom milikmu sendiri tanpa batas.
                        </p>
                        
                        <div class="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link :href="route('register')" class="px-8 py-3.5 text-base font-medium text-white bg-red-700 rounded-full hover:bg-red-800 transition shadow-lg hover:shadow-red-700/30 text-center flex items-center justify-center gap-2 group">
                                Coba Gratis Sekarang
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <a href="/demo/invitation" target="_blank" class="px-8 py-3.5 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition text-center flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Lihat Contoh Demo
                            </a>
                        </div>
                    </div>
                    
                    <!-- Realistic Smartphone Mockup Display -->
                    <div class="relative lg:ml-auto max-w-[340px] mx-auto" v-motion-slide-visible-right :delay="200">
                        <!-- Glowing Aura Backdrop -->
                        <div class="absolute -inset-4 bg-gradient-to-tr from-red-500/20 via-amber-400/20 to-pink-500/20 rounded-[3.5rem] blur-3xl opacity-70 -z-10 animate-pulse-slow"></div>

                        <!-- Smartphone Mockup Frame -->
                        <div class="relative bg-slate-950 border-[7px] border-slate-900 rounded-[3rem] shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden aspect-[9/17.5]">
                            <!-- Notch / Camera Pill -->
                            <div class="absolute top-3 inset-x-0 z-30 flex justify-center pointer-events-none">
                                <div class="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-end px-2">
                                    <div class="w-1.5 h-1.5 rounded-full bg-slate-800 border border-slate-700"></div>
                                </div>
                            </div>

                            <!-- Phone Display Screen Content (Live Invitation Preview) -->
                            <div class="relative w-full h-full bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
                                <!-- Background Cover Image -->
                                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" alt="Mockup Invitation Cover" class="absolute inset-0 w-full h-full object-cover opacity-80" />
                                
                                <!-- Dark Gradient Vignette Overlay -->
                                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60"></div>

                                <!-- Top Header Badge -->
                                <div class="relative z-10 pt-10 px-4 text-center">
                                    <span class="text-[9px] font-extrabold tracking-[0.25em] text-amber-400 uppercase bg-slate-950/60 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-md">THE WEDDING OF</span>
                                </div>

                                <!-- Center Names & Photo Card -->
                                <div class="relative z-10 px-4 text-center space-y-2 py-4">
                                    <h3 class="font-serif text-2xl font-bold text-white tracking-wide">Arya &amp; Sekar</h3>
                                    <p class="text-[10px] text-slate-300 font-mono">Sabtu, 24 Agustus 2026</p>
                                    <div class="inline-block bg-amber-400 text-slate-950 text-[10px] font-extrabold px-4 py-1.5 rounded-full shadow-lg">
                                        Buka Undangan 💌
                                    </div>
                                </div>

                                <!-- Bottom Floating Live RSVP Badge -->
                                <div class="relative z-10 p-3 bg-slate-950/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between">
                                    <div class="flex items-center space-x-2 text-[10px]">
                                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                        <span class="text-emerald-300 font-bold">142 Tamu RSVP Hadir</span>
                                    </div>
                                    <span class="text-[9px] text-amber-300 font-mono">LIVE PREVIEW</span>
                                </div>
                            </div>
                        </div>

                        <!-- Floating Badge 1: WhatsApp Invitation Sent -->
                        <div class="absolute -left-8 top-1/3 bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 flex items-center space-x-3 hidden sm:flex animate-bounce-slow">
                            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                <MessageSquareHeart class="w-5 h-5" />
                            </div>
                            <div class="text-xs text-left">
                                <strong class="text-slate-900 block font-bold">WhatsApp Shared</strong>
                                <span class="text-[10px] text-slate-500">Link personal terkirim</span>
                            </div>
                        </div>

                        <!-- Floating Badge 2: QR Check-in Success -->
                        <div class="absolute -right-8 bottom-1/4 bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center space-x-3 hidden sm:flex">
                            <div class="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                                <QrCode class="w-5 h-5" />
                            </div>
                            <div class="text-xs text-left">
                                <strong class="text-white block font-bold">QR Venue Check-In</strong>
                                <span class="text-[10px] text-amber-400 font-mono">Checked-In 100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Background wave/shape -->
            <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-none -z-10">
                <svg class="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.3,195.3,115.12,243.53,112,286.1,99.8,321.39,56.44Z" class="fill-slate-50"></path>
                </svg>
            </div>
        </section>

        <!-- Features Section -->
        <section id="fitur" class="py-20 bg-slate-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center max-w-2xl mx-auto mb-16" v-motion-slide-visible-bottom>
                    <h2 class="text-sm font-bold text-red-600 tracking-widest uppercase mb-2">Kelebihan Kami</h2>
                    <h3 class="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Fitur Lengkap Untuk Hari Spesialmu</h3>
                    <p class="text-slate-600 text-lg">Kami mengombinasikan keindahan desain dengan kemudahan teknologi untuk memastikan setiap detail pernikahanmu terabadikan sempurna.</p>
                </div>
                
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Feature 1 -->
                    <div class="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition duration-300 group" v-motion-slide-visible-bottom :delay="100">
                        <div class="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-3">Custom Domain</h4>
                        <p class="text-slate-600 leading-relaxed">Gunakan namamu sendiri sebagai link undangan (contoh: adidan-salma.com) agar lebih eksklusif.</p>
                    </div>
                    
                    <!-- Feature 2 -->
                    <div class="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition duration-300 group" v-motion-slide-visible-bottom :delay="200">
                        <div class="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                            <Users class="h-7 w-7" />
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-3">Tanpa Batas Tamu</h4>
                        <p class="text-slate-600 leading-relaxed">Sebarkan undangan ke ribuan tamu tanpa biaya tambahan per nama. Hemat dan efisien.</p>
                    </div>
                    
                    <!-- Feature 3 -->
                    <div class="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition duration-300 group" v-motion-slide-visible-bottom :delay="300">
                        <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                            <MessageSquareHeart class="h-7 w-7" />
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-3">Live RSVP & Ucapan</h4>
                        <p class="text-slate-600 leading-relaxed">Ucapkan doa, foto, dan konfirmasi kehadiran secara real-time melalui smartphone tamu.</p>
                    </div>
                    
                    <!-- Feature 4 -->
                    <div class="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition duration-300 group" v-motion-slide-visible-bottom :delay="400">
                        <div class="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all duration-300">
                            <Gift class="h-7 w-7" />
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-3">Amplop & Gift Digital</h4>
                        <p class="text-slate-600 leading-relaxed">Tamu bisa memberikan kado melalui QRIS, Transfer Bank, atau dompet digital favorit.</p>
                    </div>
                    
                    <!-- Feature 5 -->
                    <div class="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition duration-300 group" v-motion-slide-visible-bottom :delay="500">
                        <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <QrCode class="h-7 w-7" />
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-3">RSVP QR Code</h4>
                        <p class="text-slate-600 leading-relaxed">Pantau jumlah tamu yang akan hadir dengan scan QR di lokasi (Buku Tamu Digital).</p>
                    </div>
                    
                    <!-- Feature 6 -->
                    <div class="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-lg transition duration-300 group" v-motion-slide-visible-bottom :delay="600">
                        <div class="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                            <Music class="h-7 w-7" />
                        </div>
                        <h4 class="text-xl font-bold text-slate-900 mb-3">Musik & Galeri</h4>
                        <p class="text-slate-600 leading-relaxed">Lengkapi suasana dengan musik romantis dan galeri foto/video pre-wedding yang estetik.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Templates Section -->
        <section id="katalog" class="py-24">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row md:items-end justify-between mb-14" v-motion-slide-visible-bottom>
                    <div class="max-w-2xl mb-8 md:mb-0">
                        <h3 class="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Pilih Desain Impianmu</h3>
                        <p class="text-slate-600 text-lg">Berbagai pilihan tema mulai dari klasik hingga modern, disesuaikan dengan kepribadianmu dan pasangan.</p>
                    </div>
                    <div class="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
                        <button 
                            v-for="cat in categories" 
                            :key="cat"
                            @click="activeCategory = cat"
                            :class="[
                                activeCategory === cat 
                                    ? 'bg-red-700 text-white shadow-md shadow-red-700/20 font-semibold' 
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-medium'
                            ]"
                            class="whitespace-nowrap px-5 py-2.5 rounded-full text-sm transition"
                        >
                            {{ cat }}
                        </button>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-14">
                    <div 
                        v-for="item in filteredTemplates" 
                        :key="item.id"
                        :class="[item.borderColor]"
                        class="group bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between" 
                        v-motion-slide-visible-bottom 
                        :delay="item.delay"
                    >
                        <!-- Gambar Bersih Tanpa Teks Overlay -->
                        <div class="relative overflow-hidden aspect-[4/5] bg-slate-100">
                            <img 
                                :src="item.image" 
                                :alt="item.name" 
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>

                        <!-- Detil Teks & Akses Tombol di Bawah Gambar -->
                        <div class="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white space-y-4">
                            <div>
                                <div class="flex items-center justify-between mb-2 gap-2">
                                    <span :class="item.tagClass" class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border">
                                        {{ item.tag }}
                                    </span>
                                    <span class="bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                                        {{ item.discount }}
                                    </span>
                                </div>
                                <h4 class="text-lg font-bold text-slate-900 leading-snug">
                                    {{ item.name }}
                                </h4>
                            </div>

                            <div class="pt-3 border-t border-slate-100 space-y-3">
                                <div class="flex items-baseline justify-between">
                                    <span class="text-xs text-slate-400 line-through font-mono">{{ item.originalPrice }}</span>
                                    <span :class="item.priceColor" class="text-lg font-black font-mono">{{ item.price }}</span>
                                </div>

                                <div class="grid grid-cols-2 gap-2 pt-1">
                                    <a :href="`/demo/invitation/${item.id}`" target="_blank" class="w-full py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5 text-center">
                                        <Eye class="w-3.5 h-3.5" />
                                        <span>Preview</span>
                                    </a>
                                    <a :href="`/customer/invitations/edit?template=${item.slug}&id=${item.id}`" :class="item.btnClass" class="w-full py-2.5 px-2 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 text-center">
                                        <span>Pilih</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="text-center">
                    <Link href="/dashboard" class="inline-flex items-center gap-2 text-slate-700 font-semibold hover:text-red-700 transition border-b-2 border-slate-300 hover:border-red-700 pb-1 px-1">
                        Lihat Semua Katalog & Kelola Undangan
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                </div>
            </div>
        </section> 

        <section class="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div class="absolute inset-0 bg-[url('https://laravel.com/assets/img/welcome/background.svg')] bg-cover bg-center opacity-10"></div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="text-center max-w-2xl mx-auto mb-20" v-motion-slide-visible-bottom>
                    <h3 class="text-3xl md:text-5xl font-serif mb-6">Cara Mudah Buat Undanganmu</h3>
                    <p class="text-slate-400 text-lg md:text-xl">Hanya butuh 3 langkah sederhana untuk memiliki undangan digital impianmu.</p>
                </div>
                
                <div class="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
                    <div class="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-px bg-slate-700 -z-0"></div>
                    
                    <div class="text-center relative z-10 group" v-motion-slide-visible-bottom :delay="100">
                        <div class="w-20 h-20 bg-slate-800 text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-8 border-[6px] border-slate-900 group-hover:scale-110 group-hover:bg-red-900 transition-all duration-300">1</div>
                        <h4 class="text-2xl font-bold mb-4">Login & Pilih Template</h4>
                        <p class="text-slate-400 leading-relaxed px-4">Daftar akun gratis dan pilih dari puluhan template premium yang tersedia.</p>
                    </div>
                    
                    <div class="text-center relative z-10 group" v-motion-slide-visible-bottom :delay="300">
                        <div class="w-20 h-20 bg-slate-800 text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-8 border-[6px] border-slate-900 group-hover:scale-110 group-hover:bg-red-900 transition-all duration-300">2</div>
                        <h4 class="text-2xl font-bold mb-4">Sesuaikan Konten</h4>
                        <p class="text-slate-400 leading-relaxed px-4">Isi data, upload foto, dan atur fitur-fitur undangan sesuai kebutuhan.</p>
                    </div>
                    
                    <div class="text-center relative z-10 group" v-motion-slide-visible-bottom :delay="500">
                        <div class="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-3xl font-serif mx-auto mb-8 border-[6px] border-slate-900 shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all duration-300">3</div>
                        <h4 class="text-2xl font-bold mb-4">Sebar & Kelola</h4>
                        <p class="text-slate-400 leading-relaxed px-4">Sebarkan link dan pantau ucapan, RSVP, serta kado secara real-time.</p>
                    </div>
                </div>
            </div>
        </section>

        <footer class="bg-slate-950 pt-20 pb-10 border-t border-slate-900">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div class="col-span-2">
                        <Link href="/" class="text-3xl font-bold text-white tracking-tighter mb-6 block">
                            Undangan<span class="text-red-600">Ku</span>
                        </Link>
                        <p class="text-slate-400 mb-8 max-w-md text-lg leading-relaxed">Wujudkan undangan pernikahan digital elegan yang tak terlupakan dengan teknologi terkini kami.</p>
                        <div class="flex space-x-4">
                            <!-- Social icons -->
                            <a href="#" class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                <svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path></svg>
                            </a>
                            <a href="#" class="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                <svg fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path></svg>
                            </a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-white font-bold mb-6 text-lg">Navigasi</h4>
                        <ul class="space-y-4">
                            <li><a href="#fitur" class="text-slate-400 hover:text-white transition font-medium">Fitur Utama</a></li>
                            <li><a href="#katalog" class="text-slate-400 hover:text-white transition font-medium">Katalog Template</a></li>
                            <li><a href="#faq" class="text-slate-400 hover:text-white transition font-medium">Pertanyaan Umum</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="text-white font-bold mb-6 text-lg">Kebijakan</h4>
                        <ul class="space-y-4">
                            <li><a href="#" class="text-slate-400 hover:text-white transition font-medium">Kebijakan Privasi</a></li>
                            <li><a href="#" class="text-slate-400 hover:text-white transition font-medium">Syarat & Ketentuan</a></li>
                            <li><a href="#" class="text-slate-400 hover:text-white transition font-medium">Pusat Bantuan</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-slate-500 text-sm">© 2024 UndanganKu Digital Invitation SaaS. All rights reserved.</p>
                    <div class="text-slate-500 text-sm flex items-center gap-1.5">
                        Dibuat dengan <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg> di Indonesia
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<style>
/* Add smooth scrolling to the whole page */
html {
    scroll-behavior: smooth;
}

/* Custom animation utility */
.animate-bounce-slow {
    animation: bounce-slow 3s infinite;
}

.animate-pulse-slow {
    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce-slow {
    0%, 100% { transform: translateY(-50%) }
    50% { transform: translateY(calc(-50% - 15px)) }
}

@keyframes pulse-slow {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
}

/* Hide scrollbar for catalog tags */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
