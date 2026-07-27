<script setup>
import { ref, computed } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { 
    Heart, Calendar, MapPin, Clock, Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    UserCheck, Eye, Plus, ExternalLink, Share2, Users, CheckCircle2, ArrowRight, 
    Layers, Sliders, Smartphone, Shield, User, BarChart3, TrendingUp, Search,
    ChevronRight, MoreVertical, Filter, ArrowUpRight
} from 'lucide-vue-next';

const page = usePage();

// Role Switcher for Demo testing (Owner vs Customer)
const userRole = computed(() => page.props.auth?.user?.role || 'customer');
const currentRoleView = ref(userRole.value === 'owner' ? 'owner' : 'customer');

// Toast Feedback State
const toastMessage = ref('');
const showToast = ref(false);

const triggerToast = (msg) => {
    toastMessage.value = msg;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

// Copy Share Link Helper
const copyShareLink = (slug) => {
    const shareUrl = `${window.location.origin}/demo/invitation?to=NamaTamu`;
    navigator.clipboard.writeText(shareUrl);
    triggerToast('Link undangan WhatsApp berhasil disalin!');
};

// Customer Invitations Data
const customerInvitations = ref([
    {
        id: 1,
        title: 'Walimatul Ursy Arya & Sekar',
        templateId: 'midnight-gold',
        templateName: 'Midnight Serenade Gold',
        status: 'active',
        statusText: 'Aktif & Live',
        date: '24 Agustus 2026',
        venue: 'Gedung Serbaguna Senayan, Jakarta',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
        guestsCount: 128,
        attendingCount: 84,
        maybeCount: 22,
        declinedCount: 22,
        wishesCount: 42,
        slug: 'arya-sekar'
    },
    {
        id: 2,
        title: 'Kiara 5th Birthday Celebration',
        templateId: 'rose-romance',
        templateName: 'Floral Garden Romance',
        status: 'draft',
        statusText: 'Draft',
        date: '10 September 2026',
        venue: 'Bambini Playland, Jakarta',
        thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
        guestsCount: 45,
        attendingCount: 30,
        maybeCount: 8,
        declinedCount: 7,
        wishesCount: 15,
        slug: 'kiara-birthday'
    }
]);

// Admin/Owner Recent Orders Data
const recentOrders = [
    { id: '#ORD-9021', customer: 'Ahmad Wijaya', template: 'Midnight Serenade Gold', status: 'Lunas', date: '27 Jul 2026', amount: 'Rp 149.000' },
    { id: '#ORD-9020', customer: 'Siska Larasati', template: 'Floral Garden Romance', status: 'Menunggu', date: '27 Jul 2026', amount: 'Rp 129.000' },
    { id: '#ORD-9019', customer: 'Bambang Raharjo', template: 'Emerald Grace Botanical', status: 'Lunas', date: '26 Jul 2026', amount: 'Rp 139.000' },
    { id: '#ORD-9018', customer: 'Dina Kusuma', template: 'Minimalist Modern Slate', status: 'Lunas', date: '26 Jul 2026', amount: 'Rp 99.000' },
];

// Guestbook Wishes Snippet
const recentWishes = [
    { name: 'Budi Santoso & Keluarga', status: 'Hadir', time: '10 mnt lalu', text: 'Selamat untuk Arya & Sekar! Semoga sakinah, mawaddah, warahmah.' },
    { name: 'Siti Rahmawati', status: 'Hadir', time: '2 jam lalu', text: 'Barakallahu lakuma wa baraka alaikuma. Cantik dan ganteng banget!' },
    { name: 'Dion Amanda', status: 'Ragu', time: '5 jam lalu', text: 'Selamat ya! Nanti diusahakan banget bisa hadir.' }
];

// Template Catalog Snippet
const templateCatalog = [
    { id: 'midnight-gold', name: 'Midnight Serenade Gold', category: 'Luxury', price: 'Rp 149.000', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80' },
    { id: 'rose-romance', name: 'Floral Garden Romance', category: 'Romantic', price: 'Rp 129.000', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80' },
    { id: 'emerald-botanical', name: 'Emerald Grace Botanical', category: 'Botanical', price: 'Rp 139.000', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80' },
    { id: 'modern-slate', name: 'Minimalist Modern Slate', category: 'Minimalist', price: 'Rp 99.000', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80' }
];
</script>

<template>
    <Head title="Dashboard - Undangan Digital" />

    <AuthenticatedLayout>
        
        <!-- Toast Notification -->
        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="showToast" class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center space-x-2 border border-slate-700">
                <CheckCircle2 class="w-4 h-4 text-emerald-400" />
                <span>{{ toastMessage }}</span>
            </div>
        </transition>

        <div class="bg-slate-50 min-h-[calc(100vh-64px)] pb-16 font-sans">
            
            <!-- Professional Main Container -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                
                <!-- TOP HEADER BAR & DEMO SWITCHER -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                        <h1 class="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                            {{ currentRoleView === 'customer' ? `Selamat Datang, ${$page.props.auth?.user?.name || 'Pelanggan'}` : 'Dashboard Administrator' }}
                        </h1>
                        <p class="text-xs lg:text-sm text-slate-500 mt-1">
                            {{ currentRoleView === 'customer' ? 'Kelola desain undangan, komponen kustom, dan konfirmasi rsvp tamu Anda.' : 'Pantau performa penjualan, transaksi pelanggan, dan manajemen template.' }}
                        </p>
                    </div>

                    <!-- Clean Role Switcher (For Demo Testing) -->
                    <div class="flex items-center space-x-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
                        <span class="text-slate-400 font-medium px-2">Mode View:</span>
                        <button 
                            @click="currentRoleView = 'customer'" 
                            :class="[currentRoleView === 'customer' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900', 'px-3 py-1.5 rounded-lg transition']"
                        >
                            Pelanggan
                        </button>
                        <button 
                            @click="currentRoleView = 'owner'" 
                            :class="[currentRoleView === 'owner' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900', 'px-3 py-1.5 rounded-lg transition']"
                        >
                            Admin / Owner
                        </button>
                    </div>
                </div>

                <!-- ==================================================== -->
                <!-- 1. DASHBOARD MODE PELANGGAN (CLEAN & PROFESSIONAL)   -->
                <!-- ==================================================== -->
                <div v-if="currentRoleView === 'customer'" class="space-y-8">
                    
                    <!-- Quick Metrics Summary (3 Compact Cards) -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                        
                        <!-- Metric 1 -->
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div class="space-y-1">
                                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Undangan Saya</span>
                                <div class="text-2xl font-bold text-slate-900">2 Proyek</div>
                                <span class="text-[11px] text-emerald-600 font-semibold flex items-center">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> 1 Undangan Aktif
                                </span>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                                <Smartphone class="w-6 h-6" />
                            </div>
                        </div>

                        <!-- Metric 2 -->
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div class="space-y-1">
                                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Konfirmasi Tamu (RSVP)</span>
                                <div class="text-2xl font-bold text-slate-900">84 Hadir</div>
                                <span class="text-[11px] text-slate-500 font-medium">Dari total 128 Tamu diundang</span>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <UserCheck class="w-6 h-6" />
                            </div>
                        </div>

                        <!-- Metric 3 -->
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                            <div class="space-y-1">
                                <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pesan Buku Tamu</span>
                                <div class="text-2xl font-bold text-slate-900">42 Ucapan</div>
                                <span class="text-[11px] text-slate-500 font-medium">42 doa & harapan tersimpan</span>
                            </div>
                            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <MessageSquare class="w-6 h-6" />
                            </div>
                        </div>

                    </div>

                    <!-- ACTIVE INVITATIONS SECTION -->
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-lg font-bold text-slate-900">Kelola Undangan Digital</h2>
                                <p class="text-xs text-slate-500">Pilih undangan untuk mengubah isi, mengaktifkan komponen, atau menyebar link.</p>
                            </div>
                            <Link 
                                :href="route('customer.invitations.edit')" 
                                class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition flex items-center shadow-sm"
                            >
                                <Plus class="w-4 h-4 mr-1.5" /> Buat / Edit Undangan
                            </Link>
                        </div>

                        <!-- Cards Grid -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div v-for="inv in customerInvitations" :key="inv.id" class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5 hover:shadow-md transition">
                                <div class="flex items-start space-x-4">
                                    <img :src="inv.thumbnail" class="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0">
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center space-x-2 mb-1">
                                            <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-md', inv.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600']">
                                                {{ inv.statusText }}
                                            </span>
                                            <span class="text-[11px] text-slate-400">• {{ inv.templateName }}</span>
                                        </div>
                                        <h3 class="text-base font-bold text-slate-900 truncate">{{ inv.title }}</h3>
                                        <div class="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                                            <span class="flex items-center"><Calendar class="w-3.5 h-3.5 mr-1 text-slate-400" /> {{ inv.date }}</span>
                                            <span class="flex items-center"><Users class="w-3.5 h-3.5 mr-1 text-slate-400" /> {{ inv.attendingCount }} Tamu Hadir</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action Buttons Row -->
                                <div class="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                                    <Link 
                                        :href="`/customer/invitations/edit?template=${inv.templateId}&id=${inv.id}`" 
                                        class="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition text-center flex items-center justify-center shadow-sm"
                                    >
                                        <Sliders class="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Edit Komponen
                                    </Link>
                                    
                                    <a 
                                        href="/demo/invitation" 
                                        target="_blank"
                                        class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs transition flex items-center justify-center"
                                    >
                                        <Eye class="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Pratinjau
                                    </a>

                                    <button 
                                        @click="copyShareLink(inv.slug)"
                                        class="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold rounded-xl text-xs transition flex items-center justify-center"
                                    >
                                        <Share2 class="w-3.5 h-3.5 mr-1.5 text-amber-600" /> Bagikan Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- RSVP & GUESTBOOK WISHES SECTION -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <!-- Guestbook Recent Feed -->
                        <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-sm">
                            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 class="text-sm font-bold text-slate-900 flex items-center">
                                    <MessageSquare class="w-4 h-4 mr-2 text-slate-700" /> Ucapan & Doa Masuk
                                </h3>
                                <span class="text-xs text-slate-400 font-medium">Terbaru</span>
                            </div>

                            <div class="space-y-3">
                                <div v-for="(w, idx) in recentWishes" :key="idx" class="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center space-x-2">
                                            <span class="font-bold text-slate-900">{{ w.name }}</span>
                                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">{{ w.status }}</span>
                                        </div>
                                        <span class="text-[10px] text-slate-400">{{ w.time }}</span>
                                    </div>
                                    <p class="text-slate-600 italic">"{{ w.text }}"</p>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Share Callout Card -->
                        <div class="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
                            <div class="space-y-3">
                                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <Share2 class="w-5 h-5" />
                                </div>
                                <h3 class="text-lg font-bold text-white">Sebar Undangan via WhatsApp</h3>
                                <p class="text-xs text-slate-300 leading-relaxed">
                                    Salin link khusus undangan Anda dan bagikan ke grup atau kontak keluarga & sahabat secara instan.
                                </p>
                            </div>

                            <button 
                                @click="copyShareLink('arya-sekar')" 
                                class="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center shadow-lg"
                            >
                                <Copy class="w-4 h-4 mr-2" /> Salin Link Undangan
                            </button>
                        </div>

                    </div>

                    <!-- TEMPLATE CATALOG PREVIEW -->
                    <div class="space-y-4 pt-4 border-t border-slate-200">
                        <div class="flex justify-between items-center">
                            <div>
                                <h2 class="text-lg font-bold text-slate-900">Katalog Template Pilihan</h2>
                                <p class="text-xs text-slate-500">Jelajahi desain template undangan eksklusif lainnya.</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div v-for="t in templateCatalog" :key="t.id" class="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition">
                                <div class="h-36 relative overflow-hidden">
                                    <img :src="t.img" class="w-full h-full object-cover">
                                    <span class="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                                        {{ t.category }}
                                    </span>
                                </div>
                                <div class="p-3.5 flex justify-between items-center text-xs">
                                    <div>
                                        <h4 class="font-bold text-slate-900">{{ t.name }}</h4>
                                        <span class="text-slate-500 font-semibold">{{ t.price }}</span>
                                    </div>
                                    <Link :href="route('customer.invitations.edit')" class="p-2 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                                        <ArrowUpRight class="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- ==================================================== -->
                <!-- 2. DASHBOARD MODE OWNER / ADMIN (CLEAN & PROFESSIONAL) -->
                <!-- ==================================================== -->
                <div v-else class="space-y-8">
                    
                    <!-- Admin Metrics -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
                            <div class="text-2xl font-bold text-slate-900">Rp 45.200.000</div>
                            <span class="text-xs text-emerald-600 font-semibold">+12% dari bulan lalu</span>
                        </div>

                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pesanan Hari Ini</span>
                            <div class="text-2xl font-bold text-slate-900">124 Transaksi</div>
                            <span class="text-xs text-emerald-600 font-semibold">+8% dibanding kemarin</span>
                        </div>

                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Template Aktif</span>
                            <div class="text-2xl font-bold text-slate-900">56 Preset</div>
                            <span class="text-xs text-slate-500">Tersedia di katalog</span>
                        </div>

                        <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pelanggan</span>
                            <div class="text-2xl font-bold text-slate-900">1.840 Pengguna</div>
                            <span class="text-xs text-emerald-600 font-semibold">+24% pertumbuhan</span>
                        </div>
                    </div>

                    <!-- Recent Orders Table -->
                    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
                        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 class="text-base font-bold text-slate-900">Daftar Transaksi Pesanan Terbaru</h3>
                            <button class="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition">
                                Export Data CSV
                            </button>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-left text-xs text-slate-600">
                                <thead class="bg-slate-50 border-b border-slate-100 font-bold uppercase text-[10px] text-slate-400">
                                    <tr>
                                        <th class="px-6 py-3">ID Pesanan</th>
                                        <th class="px-6 py-3">Nama Pelanggan</th>
                                        <th class="px-6 py-3">Template</th>
                                        <th class="px-6 py-3">Tanggal</th>
                                        <th class="px-6 py-3">Status</th>
                                        <th class="px-6 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 font-medium">
                                    <tr v-for="ord in recentOrders" :key="ord.id" class="hover:bg-slate-50/80 transition">
                                        <td class="px-6 py-4 font-bold text-slate-900">{{ ord.id }}</td>
                                        <td class="px-6 py-4 font-semibold text-slate-800">{{ ord.customer }}</td>
                                        <td class="px-6 py-4 italic text-slate-500">{{ ord.template }}</td>
                                        <td class="px-6 py-4 text-slate-400">{{ ord.date }}</td>
                                        <td class="px-6 py-4">
                                            <span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold', ord.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800']">
                                                {{ ord.status }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-right font-bold text-slate-900">{{ ord.amount }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    </AuthenticatedLayout>
</template>
