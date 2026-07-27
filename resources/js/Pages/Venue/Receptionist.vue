<script setup>
import { ref, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import { 
    UserCheck, QrCode, Search, CheckCircle2, Users, Clock, 
    Sparkles, RefreshCw, Smartphone, Volume2, ShieldCheck 
} from 'lucide-vue-next';

const props = defineProps({
    invitationSlug: String,
    invitationTitle: String,
    customData: Object,
    guestLists: Array
});

const searchQuery = ref('');
const isScanning = ref(false);
const isCheckingIn = ref(false);
const activeWelcomeGuest = ref(null);
const localGuests = ref(props.guestLists || []);

const checkedInCount = computed(() => localGuests.value.filter(g => g.is_checked_in).length);
const totalPaxCheckedIn = computed(() => {
    return localGuests.value
        .filter(g => g.is_checked_in)
        .reduce((sum, g) => sum + (g.pax_count || 1), 0);
});

const filteredGuests = computed(() => {
    if (!searchQuery.value) return localGuests.value;
    const q = searchQuery.value.toLowerCase();
    return localGuests.value.filter(g => 
        g.guest_name.toLowerCase().includes(q) || 
        g.qr_code_slug.toLowerCase().includes(q)
    );
});

const handleCheckIn = (query) => {
    if (!query) return;
    isCheckingIn.value = true;

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    fetch(`/v/${props.invitationSlug}/checkin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ qr_code_slug_or_name: query })
    })
    .then(res => res.json())
    .then(data => {
        isCheckingIn.value = false;
        if (data.success) {
            // Update local guest state
            const index = localGuests.value.findIndex(g => g.guest_name === data.guest.name || g.qr_code_slug === query);
            if (index !== -1) {
                localGuests.value[index].is_checked_in = true;
                localGuests.value[index].checked_in_at = data.guest.checked_in_at;
            }

            activeWelcomeGuest.value = data.guest;
            searchQuery.value = '';
        } else {
            alert(data.message || 'Tamu tidak ditemukan.');
        }
    })
    .catch(err => {
        console.error('Check-in error:', err);
        isCheckingIn.value = false;
        alert('Terjadi kesalahan koneksi check-in.');
    });
};
</script>

<template>
    <Head :title="`Meja Resepsionis - ${invitationTitle || 'Undangan Digital'}`" />

    <div class="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
        
        <!-- HEADER BAR -->
        <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <UserCheck class="w-6 h-6" />
                </div>
                <div>
                    <span class="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase">VENUE RECEPTIONIST SCREEN</span>
                    <h1 class="text-base sm:text-lg font-bold text-white tracking-tight">{{ invitationTitle || 'Pernikahan Arya & Sekar' }}</h1>
                </div>
            </div>

            <!-- CHECK-IN COUNTER BADGES -->
            <div class="flex items-center space-x-4 text-xs font-bold">
                <div class="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center space-x-2 shadow">
                    <Users class="w-4 h-4 text-slate-400" />
                    <span>Tamu Checked-In: <strong class="text-emerald-400 text-sm ml-1">{{ checkedInCount }}</strong> / {{ localGuests.length }}</span>
                </div>
                <div class="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center space-x-2 shadow">
                    <Sparkles class="w-4 h-4 text-amber-400" />
                    <span>Total Pax: <strong class="text-amber-300 text-sm ml-1">{{ totalPaxCheckedIn }} Pax</strong></span>
                </div>
            </div>
        </header>

        <!-- MAIN CONTENT AREA -->
        <main class="flex-1 max-w-6xl w-full mx-auto p-6 grid lg:grid-cols-3 gap-8 items-start">
            
            <!-- LEFT COLUMN: SCANNER & SEARCH CONTROLLER -->
            <div class="lg:col-span-1 space-y-6">
                
                <!-- SCANNER CARD -->
                <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div class="flex items-center justify-between">
                        <h2 class="text-sm font-bold text-white flex items-center">
                            <QrCode class="w-4 h-4 mr-2 text-amber-400" /> QR Code Scanner / Manual Input
                        </h2>
                        <span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                            READY
                        </span>
                    </div>

                    <!-- Input Code or Name -->
                    <div class="space-y-3">
                        <div class="relative">
                            <input 
                                v-model="searchQuery"
                                @keyup.enter="handleCheckIn(searchQuery)"
                                type="text" 
                                placeholder="Scan QR Slug (misal: QR-BUDI-8821) atau ketik nama..." 
                                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                            />
                            <Search class="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5 pointer-events-none" />
                        </div>

                        <button 
                            @click="handleCheckIn(searchQuery)"
                            :disabled="isCheckingIn || !searchQuery"
                            class="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-xs transition flex items-center justify-center shadow-lg uppercase tracking-wider"
                        >
                            <UserCheck class="w-4 h-4 mr-2" />
                            <span>{{ isCheckingIn ? 'Memproses...' : 'Proses Check-In Tamu' }}</span>
                        </button>
                    </div>

                    <p class="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                        💡 <strong>Petunjuk Meja Resepsionis:</strong> Tempelkan Scanner QR pada kode yang dibawa tamu, atau ketik nama tamu lalu tekan Enter.
                    </p>
                </div>

                <!-- SAMPLE SIMULATION QUICK SCAN BUTTONS -->
                <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                    <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Simulasi Scan Cepat Tamu:</span>
                    <div class="space-y-2">
                        <button 
                            v-for="g in localGuests.slice(0, 3)" 
                            :key="g.id"
                            @click="handleCheckIn(g.qr_code_slug)"
                            class="w-full p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left text-xs transition flex justify-between items-center"
                        >
                            <div>
                                <strong class="text-white block">{{ g.guest_name }}</strong>
                                <span class="text-[10px] font-mono text-amber-400">{{ g.qr_code_slug }}</span>
                            </div>
                            <span :class="[g.is_checked_in ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300', 'text-[10px] font-bold px-2 py-0.5 rounded']">
                                {{ g.is_checked_in ? '✓ Checked-In' : 'Scan Test' }}
                            </span>
                        </button>
                    </div>
                </div>

            </div>

            <!-- RIGHT COLUMN: LIVE GUEST LIST TABLE -->
            <div class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h2 class="text-base font-bold text-white flex items-center">
                            <Users class="w-5 h-5 mr-2 text-slate-400" /> Daftar Tamu Undangan Venue
                        </h2>
                        <p class="text-xs text-slate-400">Pantau status kehadiran dan jam kedatangan tamu secara real-time.</p>
                    </div>
                    <span class="text-xs font-bold px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                        {{ filteredGuests.length }} Tamu Terdaftar
                    </span>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table class="w-full text-left text-xs text-slate-300">
                        <thead class="bg-slate-950 text-slate-400 uppercase font-extrabold text-[10px] tracking-wider sticky top-0">
                            <tr>
                                <th class="py-3 px-4">Nama Tamu</th>
                                <th class="py-3 px-4">QR Slug</th>
                                <th class="py-3 px-4 text-center">Jumlah Pax</th>
                                <th class="py-3 px-4 text-center">Status RSVP</th>
                                <th class="py-3 px-4 text-center">Status Venue</th>
                                <th class="py-3 px-4 text-right">Jam Check-In</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            <tr v-for="g in filteredGuests" :key="g.id" :class="[g.is_checked_in ? 'bg-emerald-950/20' : 'hover:bg-slate-950/50', 'transition']">
                                <td class="py-3.5 px-4 font-bold text-white">{{ g.guest_name }}</td>
                                <td class="py-3.5 px-4 font-mono text-amber-300 text-[11px]">{{ g.qr_code_slug }}</td>
                                <td class="py-3.5 px-4 text-center font-bold text-white">{{ g.pax_count || 1 }} Orang</td>
                                <td class="py-3.5 px-4 text-center">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                        {{ g.attendance_status }}
                                    </span>
                                </td>
                                <td class="py-3.5 px-4 text-center">
                                    <span :class="[g.is_checked_in ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-500 border-slate-700', 'px-2.5 py-1 rounded-full text-[10px] font-extrabold border']">
                                        {{ g.is_checked_in ? '✓ Checked-In' : 'Belum Masuk' }}
                                    </span>
                                </td>
                                <td class="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400">
                                    {{ g.checked_in_at || '-' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </main>

        <!-- WELCOME POP-UP MODAL (GLOWING VENUE DISPLAY) -->
        <transition enter-active-class="transition duration-500 ease-out" enter-from-class="transform scale-90 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-300 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="activeWelcomeGuest" @click="activeWelcomeGuest = null" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer">
                <div class="max-w-xl w-full bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-8 text-center space-y-6 shadow-[0_0_80px_rgba(245,158,11,0.3)] relative overflow-hidden">
                    <div class="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-2xl animate-bounce">
                        <Sparkles class="w-10 h-10" />
                    </div>

                    <div class="space-y-2">
                        <span class="text-amber-400 text-xs font-extrabold tracking-[0.3em] uppercase">SELAMAT DATANG DI ACARA KAMI</span>
                        <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide leading-tight">
                            {{ activeWelcomeGuest.name }}
                        </h2>
                        <p class="text-xs text-slate-300 pt-1">
                            Jumlah Pendamping: <strong class="text-amber-300 font-bold">{{ activeWelcomeGuest.pax }} Pax</strong>
                        </p>
                    </div>

                    <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-emerald-400 text-xs font-bold flex items-center justify-center space-x-2">
                        <CheckCircle2 class="w-5 h-5 text-emerald-400" />
                        <span>STATUS: CHECKED-IN VENUE SUCCESS ({{ activeWelcomeGuest.checked_in_at }})</span>
                    </div>

                    <p class="text-[11px] text-slate-400 italic">
                        Klik di mana saja untuk menutup layar sambutan.
                    </p>
                </div>
            </div>
        </transition>

        <!-- FOOTER -->
        <footer class="border-t border-slate-800 text-center py-4 text-xs text-slate-500">
            Venue Receptionist System Powered by <strong class="text-amber-400">Wevitation SaaS Platform</strong>
        </footer>
    </div>
</template>
