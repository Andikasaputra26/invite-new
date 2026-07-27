<script setup>
import { ref, computed } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { 
    Heart, Calendar, MapPin, Clock, Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    UserCheck, Eye, Plus, ExternalLink, Share2, Users, CheckCircle2, ArrowRight, 
    Layers, Sliders, Smartphone, Shield, User, BarChart3, TrendingUp, Search,
    ChevronRight, MoreVertical, Filter, ArrowUpRight, CreditCard, FileText, Download
} from 'lucide-vue-next';

const page = usePage();

// Role Switcher for Demo testing (Owner vs Customer)
const userRole = computed(() => page.props.auth?.user?.role || 'customer');
const currentRoleView = ref(userRole.value === 'owner' ? 'owner' : 'customer');

// Customer Dashboard Menu Tabs: 'template' (Custom Template Terpilih) or 'transactions' (Riwayat Transaksi)
const customerTab = ref('template');

const customerTransactions = ref([
    {
        id: 'TRX-20260724-001',
        templateName: 'Midnight Serenade Gold',
        date: '24 Juli 2026, 14:32 WIB',
        amount: 'Rp 149.000',
        paymentMethod: 'QRIS (Instant Settlement)',
        status: 'Lunas',
        invitationId: 1
    },
    {
        id: 'TRX-20260615-002',
        templateName: 'Floral Garden Romance',
        date: '15 Juni 2026, 09:15 WIB',
        amount: 'Rp 129.000',
        paymentMethod: 'Transfer BCA',
        status: 'Lunas',
        invitationId: 2
    }
]);

// Guest Name Link Generator State
const guestInputName = ref('Budi Santoso');
const selectedInvitation = ref(customerInvitations.value[0]);
const selectedSlug = computed(() => selectedInvitation.value?.slug || 'romeo-juliet');
const windowLocationOrigin = computed(() => typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

const copyPersonalizedLink = () => {
    const name = guestInputName.value.trim() || 'Tamu Undangan';
    const slug = selectedSlug.value;
    const link = `${windowLocationOrigin.value}/v/${slug}?to=${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(link);
    triggerToast(`Link khusus "${name}" (${selectedInvitation.value?.templateName || 'Undangan'}) berhasil disalin!`);
};

const sendWhatsAppMessage = () => {
    const name = guestInputName.value.trim() || 'Tamu Undangan';
    const slug = selectedSlug.value;
    const link = `${windowLocationOrigin.value}/v/${slug}?to=${encodeURIComponent(name)}`;
    const text = `Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i *${name}* untuk menghadiri acara pernikahan kami melalui link undangan digital berikut:\n\n${link}\n\nTerima kasih atas doa & restu Anda.`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
};

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
const copyShareLink = (inv) => {
    const templatePath = typeof inv === 'object' ? inv.templateId : 'midnight-gold';
    const invId = typeof inv === 'object' ? inv.id : '1';
    const shareUrl = `${window.location.origin}/demo/invitation/${templatePath}?id=${invId}&to=NamaTamu`;
    navigator.clipboard.writeText(shareUrl);
    triggerToast(`Link undangan unik (${typeof inv === 'object' ? inv.templateName : 'Undangan'}) berhasil disalin!`);
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
        title: 'Floral Wedding Kiara & Dimas',
        templateId: 'rose-romance',
        templateName: 'Floral Garden Romance',
        status: 'draft',
        statusText: 'Draft',
        date: '10 September 2026',
        venue: 'Bambini Garden, Jakarta',
        thumbnail: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80',
        guestsCount: 45,
        attendingCount: 30,
        maybeCount: 8,
        declinedCount: 7,
        wishesCount: 15,
        slug: 'kiara-dimas'
    },
    {
        id: 3,
        title: 'Botanical Marriage Rian & Maya',
        templateId: 'emerald-botanical',
        templateName: 'Emerald Botanical Haven',
        status: 'active',
        statusText: 'Aktif & Live',
        date: '15 Oktober 2026',
        venue: 'Botanica Hall, Bandung',
        thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
        guestsCount: 95,
        attendingCount: 65,
        maybeCount: 15,
        declinedCount: 15,
        wishesCount: 28,
        slug: 'rian-maya'
    },
    {
        id: 4,
        title: 'Royal Sapphire Reception Andre & Bella',
        templateId: 'royal-velvet',
        templateName: 'Royal Velvet Sapphire',
        status: 'draft',
        statusText: 'Draft',
        date: '20 November 2026',
        venue: 'Sapphire Ballroom, Surabaya',
        thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
        guestsCount: 200,
        attendingCount: 140,
        maybeCount: 40,
        declinedCount: 20,
        wishesCount: 50,
        slug: 'andre-bella'
    }
]);

// Admin/Owner Recent Orders Data
const recentOrders = [
    { id: '#ORD-9021', customer: 'Ahmad Wijaya', template: 'Midnight Serenade Gold', status: 'Lunas', date: '27 Jul 2026', amount: 'Rp 149.000' },
    { id: '#ORD-9020', customer: 'Siska Larasati', template: 'Floral Garden Romance', status: 'Menunggu', date: '27 Jul 2026', amount: 'Rp 129.000' },
    { id: '#ORD-9019', customer: 'Rian Hidayat', template: 'Emerald Botanical Haven', status: 'Lunas', date: '26 Jul 2026', amount: 'Rp 139.000' },
    { id: '#ORD-9018', customer: 'Andre Kurniawan', template: 'Royal Velvet Sapphire', status: 'Lunas', date: '26 Jul 2026', amount: 'Rp 169.000' },
];

// Guestbook Wishes Snippet
const recentWishes = [
    { name: 'Budi Santoso & Keluarga', status: 'Hadir', time: '10 mnt lalu', text: 'Selamat untuk Arya & Sekar! Semoga sakinah, mawaddah, warahmah.' },
    { name: 'Siti Rahmawati', status: 'Hadir', time: '2 jam lalu', text: 'Barakallahu lakuma wa baraka alaikuma. Cantik dan ganteng banget!' },
    { name: 'Dion Amanda', status: 'Ragu', time: '5 jam lalu', text: 'Selamat ya! Nanti diusahakan banget bisa hadir.' }
];

// Template Catalog Snippet
const templateCatalog = [
    { id: 'midnight-gold', name: 'Midnight Serenade Gold', category: 'Luxury & Royal', price: 'Rp 149.000', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80' },
    { id: 'rose-romance', name: 'Floral Garden Romance', category: 'Romantic & Pastel', price: 'Rp 129.000', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80' },
    { id: 'emerald-botanical', name: 'Emerald Botanical Haven', category: 'Nature & Glass', price: 'Rp 139.000', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80' },
    { id: 'royal-velvet', name: 'Royal Velvet Sapphire', category: 'Regal & Platinum', price: 'Rp 169.000', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' }
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
                <!-- 1. DASHBOARD MODE PELANGGAN (2 EXCLUSIVE MENUS)      -->
                <!-- ==================================================== -->
                <div v-if="currentRoleView === 'customer'" class="space-y-6">
                    
                    <!-- CUSTOMER MENU NAVIGATION TABS (2 EXCLUSIVE MENUS) -->
                    <div class="flex border-b border-slate-200 space-x-6 text-sm font-bold pb-1">
                        <button 
                            @click="customerTab = 'template'" 
                            :class="[customerTab === 'template' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700', 'pb-3 border-b-2 transition flex items-center space-x-2']"
                        >
                            <Sliders class="w-4 h-4 text-amber-500" />
                            <span>Custom Template Terpilih</span>
                        </button>

                        <button 
                            @click="customerTab = 'transactions'" 
                            :class="[customerTab === 'transactions' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-700', 'pb-3 border-b-2 transition flex items-center space-x-2']"
                        >
                            <CreditCard class="w-4 h-4 text-emerald-500" />
                            <span>Riwayat Transaksi</span>
                        </button>
                    </div>

                    <!-- MENU 1: CUSTOM TEMPLATE TERPILIH VIEW -->
                    <div v-if="customerTab === 'template'" class="space-y-8">
                        
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
                                            :href="`/demo/invitation/${inv.templateId}?id=${inv.id}`" 
                                            target="_blank"
                                            class="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-xl text-xs transition flex items-center justify-center"
                                        >
                                            <Eye class="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Pratinjau
                                        </a>

                                        <button 
                                            @click="copyShareLink(inv)"
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

                            <!-- Generator Link Undangan Personal Tamu -->
                            <div class="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
                                <div class="space-y-2">
                                    <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                        <Share2 class="w-5 h-5" />
                                    </div>
                                    <h3 class="text-base font-bold text-white">Generator Link Nama Tamu</h3>
                                    <p class="text-xs text-slate-300 leading-relaxed">
                                        Ketik nama tamu yang ingin Anda undang untuk menghasilkan link personalisasi otomatis.
                                    </p>
                                </div>

                                <!-- Input Nama Tamu -->
                                <div class="space-y-3 pt-1">
                                    <div>
                                        <label class="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Nama Tamu Yang Diundang</label>
                                        <input 
                                            v-model="guestInputName" 
                                            type="text" 
                                            placeholder="Contoh: Budi Santoso / Keluarga Budi" 
                                            class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                                        />
                                    </div>

                                    <!-- Live Generated URL Preview -->
                                    <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-[11px] space-y-1">
                                        <span class="text-slate-400 font-semibold block">Link Personal Terbentuk:</span>
                                        <span class="text-amber-400 font-mono truncate block text-[10px]">
                                            {{ windowLocationOrigin }}/v/{{ selectedSlug }}?to={{ encodeURIComponent(guestInputName || 'Tamu Undangan') }}
                                        </span>
                                    </div>

                                    <!-- Action Buttons: Copy Link & Send WhatsApp -->
                                    <div class="grid grid-cols-2 gap-2 pt-1">
                                        <button 
                                            @click="copyPersonalizedLink" 
                                            class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center shadow"
                                        >
                                            <Copy class="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Salin Link
                                        </button>

                                        <button 
                                            @click="sendWhatsAppMessage" 
                                            class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center shadow-lg"
                                        >
                                            <Send class="w-3.5 h-3.5 mr-1.5" /> Kirim WA
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- MENU 2: RIWAYAT TRANSAKSI VIEW -->
                    <div v-else class="space-y-6">
                        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 class="text-base font-bold text-slate-900 flex items-center">
                                        <FileText class="w-5 h-5 mr-2 text-slate-700" /> Riwayat Transaksi Pembelian Template
                                    </h3>
                                    <p class="text-xs text-slate-500 mt-0.5">Daftar transaksi pembayaran template yang pernah Anda lakukan.</p>
                                </div>
                                <span class="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                                    {{ customerTransactions.length }} Transaksi Terverifikasi
                                </span>
                            </div>

                            <!-- Transactions Table -->
                            <div class="overflow-x-auto">
                                <table class="w-full text-left text-xs text-slate-600">
                                    <thead class="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th class="py-3 px-4">No. Transaksi</th>
                                            <th class="py-3 px-4">Template Terpilih</th>
                                            <th class="py-3 px-4">Tanggal Pembayaran</th>
                                            <th class="py-3 px-4">Metode Bayar</th>
                                            <th class="py-3 px-4">Total</th>
                                            <th class="py-3 px-4 text-center">Status</th>
                                            <th class="py-3 px-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        <tr v-for="trx in customerTransactions" :key="trx.id" class="hover:bg-slate-50/80 transition">
                                            <td class="py-3.5 px-4 font-mono font-bold text-slate-900">{{ trx.id }}</td>
                                            <td class="py-3.5 px-4 font-bold text-slate-900">{{ trx.templateName }}</td>
                                            <td class="py-3.5 px-4 text-slate-500">{{ trx.date }}</td>
                                            <td class="py-3.5 px-4 text-slate-700 font-medium">{{ trx.paymentMethod }}</td>
                                            <td class="py-3.5 px-4 font-extrabold text-slate-900">{{ trx.amount }}</td>
                                            <td class="py-3.5 px-4 text-center">
                                                <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    ✓ {{ trx.status }}
                                                </span>
                                            </td>
                                            <td class="py-3.5 px-4 text-right">
                                                <button @click="triggerToast(`Invoice ${trx.id} berhasil diunduh!`)" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition inline-flex items-center space-x-1">
                                                    <Download class="w-3.5 h-3.5" />
                                                    <span>Invoice</span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
