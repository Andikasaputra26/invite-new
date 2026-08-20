<script setup>
import { ref, computed, onMounted } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import { 
    Heart, Calendar, MapPin, Clock, Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    UserCheck, Eye, Plus, ExternalLink, Share2, Users, CheckCircle2, ArrowRight, 
    Layers, Sliders, Smartphone, Shield, User, BarChart3, TrendingUp, Search,
    ChevronRight, MoreVertical, Filter, ArrowUpRight, CreditCard, FileText, Download,
    Settings, X, Palette, Layout
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
        templateName: 'Serenade Green',
        date: '15 Juni 2026, 09:15 WIB',
        amount: 'Rp 129.000',
        paymentMethod: 'Transfer BCA',
        status: 'Lunas',
        invitationId: 2
    }
]);

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
        templateName: 'Serenade Green',
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
    }
]);

// Guest Name Link Generator State
const guestInputName = ref('Budi Santoso');
const selectedInvitation = ref(customerInvitations.value[0]);
const selectedSlug = computed(() => selectedInvitation.value?.slug || 'arya-sekar');
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
    const shareUrl = `${window.location.origin}/v/${inv.slug || 'arya-sekar'}`;
    navigator.clipboard.writeText(shareUrl);
    triggerToast(`Link undangan unik (${typeof inv === 'object' ? inv.templateName : 'Undangan'}) berhasil disalin!`);
};

// Admin/Owner Recent Orders Data
const recentOrders = [
    { id: '#ORD-9021', customer: 'Ahmad Wijaya', template: 'Midnight Serenade Gold', status: 'Lunas', date: '27 Jul 2026', amount: 'Rp 149.000' },
    { id: '#ORD-9020', customer: 'Siska Larasati', template: 'Serenade Green', status: 'Menunggu', date: '27 Jul 2026', amount: 'Rp 129.000' },
    { id: '#ORD-9019', customer: 'Rian Hidayat', template: 'Emerald Botanical Haven', status: 'Lunas', date: '26 Jul 2026', amount: 'Rp 139.000' }
];

// Guestbook Wishes Snippet
const recentWishes = [
    { name: 'Budi Santoso & Keluarga', status: 'Hadir', time: '10 mnt lalu', text: 'Selamat untuk Arya & Sekar! Semoga sakinah, mawaddah, warahmah.' },
    { name: 'Siti Rahmawati', status: 'Hadir', time: '2 jam lalu', text: 'Barakallahu lakuma wa baraka alaikuma. Cantik dan ganteng banget!' },
    { name: 'Dion Amanda', status: 'Ragu', time: '5 jam lalu', text: 'Selamat ya! Nanti diusahakan banget bisa hadir.' }
];

// Master Template Catalog (6 Unique Themes)
const templateCatalog = ref([
    { id: 'midnight-gold', name: 'Midnight Serenade Gold', category: 'Luxury & Royal', price: 'Rp 149.000', salesCount: 1204, status: 'Published', badge: 'Terpopuler', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80' },
    { id: 'rose-romance', name: 'Serenade Green', category: 'Sage Green & Nature', price: 'Rp 129.000', salesCount: 856, status: 'Published', badge: 'Terbaru', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&q=80' },
    { id: 'emerald-botanical', name: 'Emerald Botanical Haven', category: 'Nature & Glass', price: 'Rp 139.000', salesCount: 512, status: 'Published', badge: 'Unik & Mint', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80' },
    { id: 'royal-velvet', name: 'Royal Velvet Sapphire', category: 'Regal Sapphire', price: 'Rp 159.000', salesCount: 420, status: 'Published', badge: 'Eksklusif', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80' },
    { id: 'boho-terracotta', name: 'Terracotta Rustic Warmth', category: 'Warm Boho Amber', price: 'Rp 139.000', salesCount: 380, status: 'Published', badge: 'Boho Vintage', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80' },
    { id: 'minimalist-monochrome', name: 'Nordic Monochrome Minimalist', category: 'Modern B&W', price: 'Rp 119.000', salesCount: 290, status: 'Published', badge: 'Minimalis', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80' }
]);

const editingTemplate = ref(null);
const showEditTemplateModal = ref(false);

const openEditTemplateModal = (template) => {
    editingTemplate.value = { ...template };
    showEditTemplateModal.value = true;
};

const saveTemplateChanges = () => {
    if (!editingTemplate.value) return;
    const index = templateCatalog.value.findIndex(t => t.id === editingTemplate.value.id);
    if (index !== -1) {
        templateCatalog.value[index] = { ...editingTemplate.value };
    }
    showEditTemplateModal.value = false;
    triggerToast(`Pengaturan template "${editingTemplate.value.name}" berhasil diperbarui!`);
};

// Synchronize saved customizations from localStorage with Dashboard Cards
const syncSavedCustomizations = () => {
    try {
        customerInvitations.value = customerInvitations.value.map(inv => {
            const savedDataStr = localStorage.getItem(`customer_invitation_${inv.id}`) 
                || localStorage.getItem(`template_config_${inv.templateId}`);
            if (savedDataStr) {
                const saved = JSON.parse(savedDataStr);
                const brideNickname = saved.bride?.nickname || saved.bride?.name || '';
                const groomNickname = saved.groom?.nickname || saved.groom?.name || '';
                const title = (brideNickname && groomNickname) 
                    ? `Walimatul Ursy ${groomNickname} & ${brideNickname}` 
                    : inv.title;
                const venue = saved.event?.venueName || saved.event?.venue || inv.venue;
                const date = saved.event?.date || inv.date;
                const thumbnail = saved.bride?.photo || saved.gallery?.photos?.[0] || inv.thumbnail;
                return {
                    ...inv,
                    title,
                    venue,
                    date,
                    thumbnail,
                    templateId: saved.templateId || inv.templateId,
                    customData: saved
                };
            }
            return inv;
        });
    } catch (e) {
        console.error('Error syncing saved customizations:', e);
    }
};

onMounted(() => {
    syncSavedCustomizations();
    if (typeof window !== 'undefined') {
        window.addEventListener('invitation-config-updated', syncSavedCustomizations);
        window.addEventListener('storage', syncSavedCustomizations);
    }
});
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

        <div class="bg-[#FAF9F5] min-h-[calc(100vh-64px)] pb-16 font-sans">
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
                
                <!-- TOP HEADER BAR & ROLE SWITCHER -->
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                    <div>
                        <h1 class="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {{ currentRoleView === 'customer' ? `Selamat Datang, ${$page.props.auth?.user?.name || 'Pelanggan'}` : 'Dashboard Administrator' }}
                        </h1>
                        <p class="text-xs lg:text-sm text-slate-500 mt-1">
                            {{ currentRoleView === 'customer' ? 'Kelola desain undangan, komponen kustom, dan konfirmasi rsvp tamu Anda.' : 'Pantau performa penjualan, transaksi pelanggan, dan manajemen template.' }}
                        </p>
                    </div>

                    <!-- Role Switcher -->
                    <div class="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs">
                        <span class="text-slate-400 font-medium px-2">Mode View:</span>
                        <button 
                            @click="currentRoleView = 'customer'" 
                            :class="[currentRoleView === 'customer' ? 'bg-orange-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900', 'px-3.5 py-1.5 rounded-lg transition']"
                        >
                            Pelanggan
                        </button>
                        <button 
                            @click="currentRoleView = 'owner'" 
                            :class="[currentRoleView === 'owner' ? 'bg-orange-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900', 'px-3.5 py-1.5 rounded-lg transition']"
                        >
                            Admin / Owner
                        </button>
                    </div>
                </div>

                <!-- 1. DASHBOARD MODE PELANGGAN -->
                <div v-if="currentRoleView === 'customer'" class="space-y-6">
                    
                    <!-- CUSTOMER MENU TABS -->
                    <div class="flex border-b border-slate-200/80 space-x-6 text-sm font-bold pb-1">
                        <button 
                            @click="customerTab = 'template'" 
                            :class="[customerTab === 'template' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700', 'pb-3 border-b-2 transition flex items-center space-x-2']"
                        >
                            <Sliders class="w-4 h-4 text-orange-500" />
                            <span>Custom Template Terpilih</span>
                        </button>

                        <button 
                            @click="customerTab = 'transactions'" 
                            :class="[customerTab === 'transactions' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-700', 'pb-3 border-b-2 transition flex items-center space-x-2']"
                        >
                            <CreditCard class="w-4 h-4 text-emerald-600" />
                            <span>Riwayat Transaksi</span>
                        </button>
                    </div>

                    <!-- MENU 1: CUSTOM TEMPLATE TERPILIH VIEW -->
                    <div v-if="customerTab === 'template'" class="space-y-8">
                        
                        <!-- Quick Metrics Summary -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div class="space-y-1">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Undangan Saya</span>
                                    <div class="text-2xl font-extrabold text-slate-900">2 Proyek</div>
                                    <span class="text-[11px] text-emerald-600 font-semibold flex items-center">
                                        <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> 1 Undangan Aktif & Live
                                    </span>
                                </div>
                                <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <Smartphone class="w-6 h-6" />
                                </div>
                            </div>

                            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div class="space-y-1">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Konfirmasi Tamu (RSVP)</span>
                                    <div class="text-2xl font-extrabold text-slate-900">84 Hadir</div>
                                    <span class="text-[11px] text-slate-500 font-medium">Dari total 128 Tamu diundang</span>
                                </div>
                                <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <UserCheck class="w-6 h-6" />
                                </div>
                            </div>

                            <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                                <div class="space-y-1">
                                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pesan Buku Tamu</span>
                                    <div class="text-2xl font-extrabold text-slate-900">42 Ucapan</div>
                                    <span class="text-[11px] text-slate-500 font-medium">42 doa & harapan tersimpan</span>
                                </div>
                                <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
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
                                    class="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition flex items-center shadow-md shadow-orange-500/20"
                                >
                                    <Plus class="w-4 h-4 mr-1.5" /> Edit Template Undangan
                                </Link>
                            </div>

                            <!-- Cards Grid -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div v-for="inv in customerInvitations" :key="inv.id" class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 hover:shadow-md transition">
                                    <div class="flex items-start space-x-4">
                                        <img :src="inv.thumbnail" class="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0">
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center space-x-2 mb-1">
                                                <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-md', inv.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600']">
                                                    {{ inv.statusText }}
                                                </span>
                                                <span class="text-[11px] text-slate-400">• {{ inv.templateName }}</span>
                                            </div>
                                            <h3 class="text-base font-extrabold text-slate-900 truncate">{{ inv.title }}</h3>
                                            <div class="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                                                <span class="flex items-center"><Calendar class="w-3.5 h-3.5 mr-1 text-orange-500" /> {{ inv.date }}</span>
                                                <span class="flex items-center"><Users class="w-3.5 h-3.5 mr-1 text-slate-400" /> {{ inv.attendingCount }} Tamu Hadir</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Action Buttons Row -->
                                    <div class="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                                        <Link 
                                            :href="`/customer/invitations/edit?template=${inv.templateId}&id=${inv.id}`" 
                                            class="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition text-center flex items-center justify-center shadow-xs"
                                        >
                                            <Sliders class="w-3.5 h-3.5 mr-1.5" /> Edit Template
                                        </Link>
                                        
                                        <a 
                                            :href="`/demo/invitation/${inv.templateId}?id=${inv.id}`" 
                                            target="_blank"
                                            class="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition flex items-center justify-center"
                                        >
                                            <Eye class="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Pratinjau
                                        </a>

                                        <button 
                                            @click="copyShareLink(inv)"
                                            class="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold rounded-xl text-xs transition flex items-center justify-center"
                                        >
                                            <Share2 class="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Bagikan Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- MENU 2: RIWAYAT TRANSAKSI VIEW -->
                    <div v-else class="space-y-6">
                        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                            <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <h3 class="text-base font-extrabold text-slate-900 flex items-center">
                                        <FileText class="w-5 h-5 mr-2 text-orange-500" /> Riwayat Transaksi Pembelian Template
                                    </h3>
                                    <p class="text-xs text-slate-500 mt-0.5">Daftar transaksi pembayaran template yang pernah Anda lakukan.</p>
                                </div>
                                <span class="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                                    {{ customerTransactions.length }} Transaksi Terverifikasi
                                </span>
                            </div>

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
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    </AuthenticatedLayout>
</template>
