<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { 
    Heart, Calendar, MapPin, Clock, Volume2, VolumeX, 
    Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    ChevronDown, UserCheck, Eye, Compass, Image as ImageIcon,
    Music, Palette, Layout, Settings, Plus, Trash2, Sliders, UploadCloud,
    Layers, RefreshCw, CheckCircle2, ArrowLeft, ExternalLink,
    Smartphone, Monitor, Sparkle, Share2, AlertCircle, ToggleLeft, ToggleRight
} from 'lucide-vue-next';

// --- Preset Templates ---
const templates = [
    {
        id: 'midnight-gold',
        name: 'Midnight Serenade Gold',
        category: 'Luxury & Royal',
        badge: 'Terpopuler',
        primaryColor: '#fbbf24',
        accentColor: '#f59e0b',
        paletteId: 'gold',
        previewImg: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'rose-romance',
        name: 'Floral Garden Romance',
        category: 'Romantic & Pastel',
        badge: 'Terbaru',
        primaryColor: '#f472b6',
        accentColor: '#fb7185',
        paletteId: 'rose',
        previewImg: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'emerald-botanical',
        name: 'Emerald Botanical Haven',
        category: 'Nature & Glassmorphism',
        badge: 'Unik & Mint',
        primaryColor: '#34d399',
        accentColor: '#10b981',
        paletteId: 'emerald',
        previewImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'royal-velvet',
        name: 'Royal Velvet Sapphire',
        category: 'Regal Sapphire & Silver',
        badge: 'Eksklusif',
        primaryColor: '#38bdf8',
        accentColor: '#818cf8',
        paletteId: 'sapphire',
        previewImg: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80'
    }
];

// --- Theme Palettes (High Contrast & Unique Styles) ---
const colorPalettes = [
    { id: 'gold', name: 'Royal Gold', main: '#fbbf24', sub: '#22c55e', bg: '#090d16', text: '#f4efe6', cardBg: '#051711', border: '#d4af37' },
    { id: 'rose', name: 'Rose Romance', main: '#f472b6', sub: '#fb7185', bg: '#1f1318', text: '#fff1f2', cardBg: '#2a1720', border: '#f472b6' },
    { id: 'emerald', name: 'Emerald Gem', main: '#34d399', sub: '#6ee7b7', bg: '#062c1e', text: '#ecfdf5', cardBg: '#0a422e', border: '#34d399' },
    { id: 'sapphire', name: 'Royal Sapphire', main: '#38bdf8', sub: '#818cf8', bg: '#09132b', text: '#f0f9ff', cardBg: '#0d1b3e', border: '#38bdf8' }
];

const fontStyles = [
    { id: 'serif', name: 'Classic Serif (Playfair)', fontClass: 'font-serif' },
    { id: 'sans', name: 'Modern Clean (Inter)', fontClass: 'font-sans' },
    { id: 'script', name: 'Romantic Calligraphy', fontClass: 'font-mono' }
];

// --- Quotes Presets ---
const quotePresets = [
    {
        title: 'QS. Ar-Rum: 21 (Islam)',
        text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.'
    },
    {
        title: '1 Korintus 13:4-7 (Kristen)',
        text: 'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri.'
    },
    {
        title: 'Kutipan Romantis Umum',
        text: 'Pernikahan bukan hanya sekadar menyatukan dua insan, melainkan menyatukan dua takdir untuk berjalan bersama dalam suka dan duka.'
    }
];

// --- Main State Customization ---
const config = reactive({
    templateId: 'midnight-gold',
    paletteId: 'gold',
    fontId: 'serif',
    
    // Component Toggles
    components: {
        music: true,
        quote: true,
        mempelai: true,
        acara: true,
        countdown: true,
        story: true,
        gallery: true,
        gift: true,
        rsvp: true
    },

    // Music Config
    music: {
        trackIndex: 0,
        autoplay: true
    },

    // Mempelai Pria
    groom: {
        name: 'Raden Arya Wijaya, S.T.',
        nickname: 'Arya',
        father: 'Bpk. Hj. Suryo Wijaya',
        mother: 'Ibu Hj. Endang Rahayu',
        orderText: 'Putra pertama dari',
        instagram: '@aryawijaya',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },

    // Mempelai Wanita
    bride: {
        name: 'Putri Sekar Arum, S.Ked',
        nickname: 'Sekar',
        father: 'Bpk. Dr. H. Bambang Subroto',
        mother: 'Ibu Hj. Dewi Lestari',
        orderText: 'Putri kedua dari',
        instagram: '@sekararum',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },

    // Quote Section
    quote: {
        selectedPresetIndex: 0,
        customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...'
    },

    // Event & Location
    event: {
        date: '2026-08-24',
        akadTime: '08:00 WIB - 10:00 WIB',
        akadVenue: 'Masjid Agung Trans Studio',
        resepsiTime: '11:00 WIB - 14:00 WIB',
        venueName: 'Gedung Serbaguna Senayan',
        locationCity: 'Jakarta Pusat',
        address: 'Jl. Jend. Gatot Subroto No.1, Gelora, Tanah Abang, Jakarta Pusat',
        mapsUrl: 'https://maps.google.com',
        liveStreamUrl: 'https://youtube.com/live'
    },

    // Love Story List
    loveStories: [
        { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan tidak sengaja saat kegiatan kampus di Universitas Indonesia.' },
        { year: '2023', title: 'Momen Lamaran', description: 'Arya secara resmi melamar Sekar di hadapan kedua keluarga besar.' },
        { year: '2026', title: 'Hari Pernikahan', description: 'Awal dari babak baru perjalanan kehidupan suci kami.' }
    ],

    // Photo Gallery
    gallery: {
        layout: 'grid',
        photos: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=500&q=80'
        ]
    },

    // Gift & Envelope
    gift: {
        bankName1: 'Bank BCA',
        accountNo1: '8830192834',
        accountName1: 'Raden Arya Wijaya',
        bankName2: 'Bank Mandiri',
        accountNo2: '1370009849201',
        accountName2: 'Putri Sekar Arum',
        qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=INVITATION_GIFT_QRIS',
        shippingAddress: 'Jl. Wijaya Kusuma No. 45, Kebayoran Baru, Jakarta Selatan (UP: Arya & Sekar)'
    },

    // Background Image Customization
    background: {
        useImage: true,
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
        overlayOpacity: 0.25
    }
});

// Editor Active Tab State
const activeTab = ref('components'); // 'template' | 'components' | 'content' | 'theme'
const activeContentSection = ref('mempelai'); // 'mempelai' | 'quote' | 'event' | 'story' | 'gallery' | 'gift'

// Responsive View Mode for Mobile/Tablet (< lg screens)
const mobileViewMode = ref('editor'); // 'editor' | 'preview'

// UI Live Preview States
const isSaved = ref(false);
const saveMessage = ref('');
const isEnvelopeOpened = ref(false);
const copiedBankState = ref(null);

// Dynamic Computed Palette
const activeTemplate = computed(() => {
    return templates.find(t => t.id === config.templateId) || templates[0];
});

const activePalette = computed(() => {
    return colorPalettes.find(p => p.id === config.paletteId) || colorPalettes[0];
});

// Add Story Item
const newStory = reactive({ year: '', title: '', description: '', bgImage: '' });
const addStory = () => {
    if (newStory.title && newStory.year) {
        config.loveStories.push({ 
            ...newStory,
            bgImage: newStory.bgImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
        });
        newStory.year = '';
        newStory.title = '';
        newStory.description = '';
        newStory.bgImage = '';
    }
};
const removeStory = (index) => {
    config.loveStories.splice(index, 1);
};

// Compress Image to prevent localStorage QuotaExceededError
const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.75) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = () => resolve(e.target.result);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

// Add Photo Link & File Upload Handler
const newPhotoUrl = ref('');
const galleryFileInput = ref(null);

const triggerGalleryUpload = () => {
    galleryFileInput.value?.click();
};

const handleGalleryFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        try {
            const compressed = await compressImage(file);
            config.gallery.photos.push(compressed);
        } catch (e) {
            console.error('Failed compressing photo:', e);
        }
    }
    saveCustomization();
    event.target.value = '';
};

const addPhoto = () => {
    if (newPhotoUrl.value) {
        config.gallery.photos.push(newPhotoUrl.value);
        newPhotoUrl.value = '';
        saveCustomization();
    }
};
const removePhoto = (index) => {
    config.gallery.photos.splice(index, 1);
    saveCustomization();
};

// Copy bank handler inside editor preview
const copyBank = (text, key) => {
    navigator.clipboard.writeText(text);
    copiedBankState.value = key;
    setTimeout(() => copiedBankState.value = null, 2000);
};

// Save changes to localStorage & trigger feedback (Isolated for Customer Instance)
const saveCustomization = () => {
    const params = new URLSearchParams(window.location.search);
    const invitationId = params.get('id') || '1';
    
    try {
        const jsonStr = JSON.stringify(config);
        
        // Save to specific customer invitation instance key
        localStorage.setItem(`customer_invitation_${invitationId}`, jsonStr);
        
        // Also update current active customInvitationData for live preview
        localStorage.setItem('customInvitationData', jsonStr);
        
        isSaved.value = true;
        saveMessage.value = 'Kustomisasi & foto berhasil disimpan secara otomatis!';
        setTimeout(() => {
            isSaved.value = false;
        }, 3500);
    } catch (e) {
        console.error('LocalStorage save error:', e);
        isSaved.value = true;
        saveMessage.value = 'Foto tersimpan di memori browser. Jika terlalu banyak foto, gunakan link foto online.';
        setTimeout(() => {
            isSaved.value = false;
        }, 4000);
    }
};

// Open final invitation preview page in new tab with unique template link
const openFinalPreview = () => {
    saveCustomization();
    const params = new URLSearchParams(window.location.search);
    const invitationId = params.get('id') || '1';
    window.open(`/demo/invitation/${config.templateId}?id=${invitationId}`, '_blank');
};

// Watch templateId to automatically sync default palette & theme style
watch(() => config.templateId, (newId) => {
    const found = templates.find(t => t.id === newId);
    if (found && found.paletteId) {
        config.paletteId = found.paletteId;
    }
}, { immediate: true });

const isTemplateLocked = ref(false);

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const chosenTemplate = params.get('template');
    const invitationId = params.get('id') || '1';

    if (chosenTemplate) {
        const found = templates.find(t => t.id === chosenTemplate);
        if (found) {
            config.templateId = chosenTemplate;
            isTemplateLocked.value = true;
        }
    }

    // Try loading specific customer invitation instance first
    const instanceKey = `customer_invitation_${invitationId}`;
    const storedInstance = localStorage.getItem(instanceKey) || localStorage.getItem('customInvitationData');
    
    if (storedInstance) {
        try {
            const parsed = JSON.parse(storedInstance);
            if (chosenTemplate) {
                parsed.templateId = chosenTemplate;
            }
            Object.assign(config, parsed);
        } catch (e) {
            console.error('Failed to load saved customer config:', e);
        }
    }
});
</script>

<template>
    <Head title="Kustomisasi Undangan Digital" />

    <AuthenticatedLayout>
        <div class="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-950 text-white font-sans">
            
            <!-- MOBILE / TABLET STICKY VIEW SWITCHER BAR (< lg screens) -->
            <div class="lg:hidden bg-slate-900 border-b border-slate-800 p-2.5 flex justify-center space-x-2 z-40">
                <button 
                    @click="mobileViewMode = 'editor'" 
                    :class="[mobileViewMode === 'editor' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'bg-slate-800 text-slate-300 hover:text-white', 'px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2']"
                >
                    <Sliders class="w-4 h-4" />
                    <span>Form Editor</span>
                </button>
                <button 
                    @click="mobileViewMode = 'preview'" 
                    :class="[mobileViewMode === 'preview' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'bg-slate-800 text-slate-300 hover:text-white', 'px-5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2']"
                >
                    <Smartphone class="w-4 h-4 text-amber-500" />
                    <span>Live Smartphone Preview</span>
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>
            </div>

            <!-- LEFT CONTROL PANEL (55% width on desktop) -->
            <div 
                :class="[mobileViewMode === 'editor' ? 'flex' : 'hidden lg:flex', 'w-full lg:w-[55%] flex-col h-full border-r border-slate-800 bg-slate-950 z-10']"
            >
                
                <!-- Top Header Bar (High Contrast) -->
                <div class="px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <Link :href="route('dashboard')" class="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700">
                            <ArrowLeft class="w-5 h-5" />
                        </Link>
                        <div>
                            <div class="flex items-center space-x-2">
                                <h1 class="text-base lg:text-lg font-bold text-white tracking-tight">Kustomisasi Komponen</h1>
                                <span class="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                                    {{ activeTemplate.name }}
                                </span>
                            </div>
                            <p class="text-xs text-slate-400">Atur modul aktif, isi konten, & lihat live preview di kanan</p>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2">
                        <button 
                            @click="openFinalPreview"
                            class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-xs font-bold transition flex items-center shadow-sm"
                        >
                            <ExternalLink class="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                            Hasil Akhir
                        </button>
                        <button 
                            @click="saveCustomization"
                            class="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold rounded-lg text-xs shadow-lg shadow-amber-500/20 transition flex items-center"
                        >
                            <CheckCircle2 class="w-4 h-4 mr-1.5" />
                            Simpan
                        </button>
                    </div>
                </div>

                <!-- Toast Notification Banner -->
                <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <div v-if="isSaved" class="bg-emerald-500/20 border-b border-emerald-500/50 px-6 py-2.5 text-emerald-300 text-xs font-bold flex items-center justify-between">
                        <span class="flex items-center"><CheckCircle2 class="w-4 h-4 mr-2 text-emerald-400" /> {{ saveMessage }}</span>
                        <span class="text-[10px] text-slate-400">Tersimpan di local storage</span>
                    </div>
                </transition>

                <!-- Navigation Tabs (High Contrast) -->
                <div class="px-6 border-b border-slate-800 bg-slate-900/60 flex space-x-6 text-xs font-bold overflow-x-auto">
                    <button 
                        @click="activeTab = 'components'" 
                        :class="[activeTab === 'components' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200', 'py-3.5 border-b-2 transition flex items-center space-x-2 whitespace-nowrap']"
                    >
                        <Layers class="w-4 h-4" />
                        <span>1. Sakelar Komponen</span>
                        <span class="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] px-1.5 py-0.5 rounded font-extrabold">ON/OFF</span>
                    </button>

                    <button 
                        @click="activeTab = 'content'" 
                        :class="[activeTab === 'content' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200', 'py-3.5 border-b-2 transition flex items-center space-x-2 whitespace-nowrap']"
                    >
                        <Settings class="w-4 h-4" />
                        <span>2. Edit Konten Data</span>
                    </button>

                    <button 
                        @click="activeTab = 'theme'" 
                        :class="[activeTab === 'theme' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200', 'py-3.5 border-b-2 transition flex items-center space-x-2 whitespace-nowrap']"
                    >
                        <Palette class="w-4 h-4" />
                        <span>3. Tampilan & Warna</span>
                    </button>
                </div>

                <!-- TAB CONTENT AREA (High Contrast Inputs & Cards) -->
                <div class="flex-1 overflow-y-auto p-6 space-y-6">

                    <!-- TAB 1: COMPONENT TOGGLES -->
                    <div v-if="activeTab === 'components'" class="space-y-4">
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <h3 class="text-sm font-bold text-white flex items-center mb-1">
                                <Sparkles class="w-4 h-4 mr-2 text-amber-400" />
                                Modul & Komponen Undangan
                            </h3>
                            <p class="text-xs text-slate-300 leading-relaxed">Aktifkan atau matikan bagian undangan sesuai kebutuhan acara Anda.</p>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            
                            <!-- Music Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.music ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        <Music class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Musik Latar (Audio)</div>
                                        <div class="text-[11px] text-slate-400">BGM instrumen romantis</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.music" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- Quote Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.quote ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                        <Sparkle class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Ayat / Kutipan Suci</div>
                                        <div class="text-[11px] text-slate-400">Ayat suci & kata mutiara</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.quote" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- Mempelai Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.mempelai ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
                                        <Heart class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Profil Mempelai</div>
                                        <div class="text-[11px] text-slate-400">Info Pria & Wanita</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.mempelai" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- Acara Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.acara ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        <Calendar class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Detail Acara & Map</div>
                                        <div class="text-[11px] text-slate-400">Akad, Resepsi, Maps</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.acara" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- Countdown Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.countdown ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                        <Clock class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Hitung Mundur</div>
                                        <div class="text-[11px] text-slate-400">Timer hitung mundur</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.countdown" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- Love Story Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.story ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                        <Compass class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Kisah Cinta</div>
                                        <div class="text-[11px] text-slate-400">Timeline cerita cinta</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.story" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- Gallery Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.gallery ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                        <ImageIcon class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Galeri Foto</div>
                                        <div class="text-[11px] text-slate-400">Showcase foto prewedding</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.gallery" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- Gift Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.gift ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        <Gift class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Amplop Digital</div>
                                        <div class="text-[11px] text-slate-400">Rekening bank & QRIS</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.gift" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <!-- RSVP Toggle -->
                            <div :class="['p-4 rounded-xl border transition flex items-center justify-between', config.components.rsvp ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-md shadow-amber-500/5' : 'bg-slate-900 border-slate-800 text-slate-400']">
                                <div class="flex items-center space-x-3">
                                    <div class="p-2 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
                                        <MessageSquare class="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div class="text-sm font-bold text-white">Buku Tamu & RSVP</div>
                                        <div class="text-[11px] text-slate-400">Form ucapan & konfirmasi</div>
                                    </div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.components.rsvp" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                        </div>
                    </div>

                    <!-- TAB 2: CONTENT EDITOR -->
                    <div v-if="activeTab === 'content'" class="space-y-6">
                        <!-- Sub navigation for content editor -->
                        <div class="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
                            <button @click="activeContentSection = 'mempelai'" :class="[activeContentSection === 'mempelai' ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'bg-slate-900 text-slate-300 hover:text-white', 'px-3.5 py-2 rounded-lg transition whitespace-nowrap']">👨‍👩‍👧 Mempelai</button>
                            <button @click="activeContentSection = 'quote'" :class="[activeContentSection === 'quote' ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'bg-slate-900 text-slate-300 hover:text-white', 'px-3.5 py-2 rounded-lg transition whitespace-nowrap']">📜 Quote / Ayat</button>
                            <button @click="activeContentSection = 'event'" :class="[activeContentSection === 'event' ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'bg-slate-900 text-slate-300 hover:text-white', 'px-3.5 py-2 rounded-lg transition whitespace-nowrap']">🗓️ Acara & Waktu</button>
                            <button @click="activeContentSection = 'story'" :class="[activeContentSection === 'story' ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'bg-slate-900 text-slate-300 hover:text-white', 'px-3.5 py-2 rounded-lg transition whitespace-nowrap']">💖 Kisah Cinta</button>
                            <button @click="activeContentSection = 'gallery'" :class="[activeContentSection === 'gallery' ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'bg-slate-900 text-slate-300 hover:text-white', 'px-3.5 py-2 rounded-lg transition whitespace-nowrap']">📸 Galeri Foto</button>
                            <button @click="activeContentSection = 'gift'" :class="[activeContentSection === 'gift' ? 'bg-amber-400 text-slate-950 font-extrabold shadow' : 'bg-slate-900 text-slate-300 hover:text-white', 'px-3.5 py-2 rounded-lg transition whitespace-nowrap']">🎁 Amplop Digital</button>
                        </div>

                        <!-- Mempelai Form -->
                        <div v-if="activeContentSection === 'mempelai'" class="space-y-6">
                            <!-- Mempelai Pria -->
                            <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                                <h3 class="text-sm font-bold text-amber-400 flex items-center">👨 Mempelai Pria</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Lengkap & Gelar</label>
                                        <input type="text" v-model="config.groom.name" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                                    </div>
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Panggilan</label>
                                        <input type="text" v-model="config.groom.nickname" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                                    </div>
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Ayah</label>
                                        <input type="text" v-model="config.groom.father" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                                    </div>
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Ibu</label>
                                        <input type="text" v-model="config.groom.mother" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block font-bold text-slate-200 mb-1">URL Foto Mempelai Pria</label>
                                        <input type="text" v-model="config.groom.photo" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                                    </div>
                                </div>
                            </div>

                            <!-- Mempelai Wanita -->
                            <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                                <h3 class="text-sm font-bold text-pink-400 flex items-center">👩 Mempelai Wanita</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Lengkap & Gelar</label>
                                        <input type="text" v-model="config.bride.name" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-pink-400 focus:ring-1 focus:ring-pink-400">
                                    </div>
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Panggilan</label>
                                        <input type="text" v-model="config.bride.nickname" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-pink-400 focus:ring-1 focus:ring-pink-400">
                                    </div>
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Ayah</label>
                                        <input type="text" v-model="config.bride.father" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-pink-400 focus:ring-1 focus:ring-pink-400">
                                    </div>
                                    <div>
                                        <label class="block font-bold text-slate-200 mb-1">Nama Ibu</label>
                                        <input type="text" v-model="config.bride.mother" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-pink-400 focus:ring-1 focus:ring-pink-400">
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block font-bold text-slate-200 mb-1">URL Foto Mempelai Wanita</label>
                                        <input type="text" v-model="config.bride.photo" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-medium focus:border-pink-400 focus:ring-1 focus:ring-pink-400">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Quote Form -->
                        <div v-if="activeContentSection === 'quote'" class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                            <h3 class="text-sm font-bold text-amber-400">📜 Pilih Pilihan Ayat / Kutipan Suci</h3>
                            <div class="space-y-2">
                                <div v-for="(p, idx) in quotePresets" :key="idx" 
                                     @click="config.quote.selectedPresetIndex = idx; config.quote.customText = p.text"
                                     :class="['p-3 rounded-lg border cursor-pointer transition text-xs', config.quote.selectedPresetIndex === idx ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700']">
                                    <div class="font-bold text-white mb-1">{{ p.title }}</div>
                                    <div class="italic text-[11px] text-slate-300">"{{ p.text }}"</div>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-200 mb-1">Teks Kutipan Kustom</label>
                                <textarea rows="3" v-model="config.quote.customText" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400"></textarea>
                            </div>
                        </div>

                        <!-- Event & Location Form -->
                        <div v-if="activeContentSection === 'event'" class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                            <h3 class="text-sm font-bold text-emerald-400">🗓️ Tanggal, Waktu & Lokasi Acara</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Tanggal Utama Pernikahan</label>
                                    <input type="date" v-model="config.event.date" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Kota / Wilayah Acara</label>
                                    <input type="text" v-model="config.event.locationCity" placeholder="Cth: Jakarta Pusat / Bandung" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Lokasi Gedung / Tempat Akad</label>
                                    <input type="text" v-model="config.event.akadVenue" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Waktu Akad Nikah</label>
                                    <input type="text" v-model="config.event.akadTime" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Lokasi Gedung / Tempat Resepsi</label>
                                    <input type="text" v-model="config.event.venueName" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Waktu Resepsi Pernikahan</label>
                                    <input type="text" v-model="config.event.resepsiTime" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400">
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block font-bold text-slate-200 mb-1">Alamat Lengkap Lokasi Acara</label>
                                    <textarea rows="2" v-model="config.event.address" placeholder="Tuliskan nama jalan, no gedung, kecamatan, kota..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400"></textarea>
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block font-bold text-slate-200 mb-1">Link Petunjuk Lokasi Google Maps (Embed/Redirect)</label>
                                    <input type="text" v-model="config.event.mapsUrl" placeholder="https://maps.google.com/..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-amber-400">
                                </div>
                            </div>
                        </div>

                        <!-- Story Form -->
                        <div v-if="activeContentSection === 'story'" class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                            <h3 class="text-sm font-bold text-rose-400">💖 Kisah Cinta & Milestone (Foto Background Editable)</h3>
                            
                            <div class="space-y-4">
                                <div v-for="(story, idx) in config.loveStories" :key="idx" class="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center space-x-2">
                                            <span class="bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/30 px-2.5 py-0.5 rounded text-[10px]">{{ story.year }}</span>
                                            <span class="font-bold text-white text-xs">{{ story.title }}</span>
                                        </div>
                                        <button @click="removeStory(idx)" class="text-rose-400 hover:text-rose-300 p-1">
                                            <Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p class="text-slate-300 text-[11px] leading-relaxed">{{ story.description }}</p>
                                    
                                    <!-- Story Background Image Edit Input -->
                                    <div class="pt-1 flex items-center space-x-2">
                                        <img :src="story.bgImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=150&q=80'" class="w-10 h-10 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
                                        <input type="text" v-model="story.bgImage" placeholder="URL Foto Background Momen Cerita..." class="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-[11px] text-white">
                                    </div>
                                </div>
                            </div>

                            <div class="border-t border-slate-800 pt-4 space-y-2">
                                <div class="font-bold text-white">Tambah Momen Cerita Baru</div>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="Tahun (cth: 2022)" v-model="newStory.year" class="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white">
                                    <input type="text" placeholder="Judul Momen" v-model="newStory.title" class="col-span-2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white">
                                </div>
                                <textarea rows="2" placeholder="Deskripsi cerita singkat..." v-model="newStory.description" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"></textarea>
                                <input type="text" placeholder="URL Foto Background Cerita (Opsional)..." v-model="newStory.bgImage" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white">
                                <button @click="addStory" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition flex items-center justify-center border border-slate-700">
                                    <Plus class="w-4 h-4 mr-1" /> Tambah Milestone Cerita
                                </button>
                            </div>
                        </div>

                        <!-- Gallery Form -->
                        <div v-if="activeContentSection === 'gallery'" class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 text-xs">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-bold text-indigo-400 flex items-center">
                                    <ImageIcon class="w-4 h-4 mr-2" /> 📸 Galeri Foto & Prewedding
                                </h3>
                                <span class="text-[10px] text-slate-400 font-mono">{{ config.gallery.photos.length }} Foto Ter-upload</span>
                            </div>
                            
                            <div>
                                <label class="block font-bold text-slate-200 mb-2">Pilih Tampilan Layout Galeri</label>
                                <div class="grid grid-cols-2 gap-3">
                                    <button @click="config.gallery.layout = 'grid'" :class="['p-3 rounded-lg border text-center font-bold transition flex items-center justify-center space-x-2', config.gallery.layout === 'grid' ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-extrabold shadow' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700']">
                                        <span>Grid Masonry</span>
                                    </button>
                                    <button @click="config.gallery.layout = 'slider'" :class="['p-3 rounded-lg border text-center font-bold transition flex items-center justify-center space-x-2', config.gallery.layout === 'slider' ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-extrabold shadow' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700']">
                                        <span>Carousel Slider</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Direct File Upload Dropzone Box -->
                            <div class="space-y-3">
                                <label class="block font-bold text-slate-200">Upload Foto Langsung dari Device (HP / Laptop)</label>
                                
                                <input type="file" ref="galleryFileInput" @change="handleGalleryFileUpload" accept="image/*" multiple class="hidden" />

                                <div 
                                    @click="triggerGalleryUpload" 
                                    class="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 bg-slate-950/70 hover:bg-slate-900/90 rounded-2xl p-6 text-center cursor-pointer transition group flex flex-col items-center justify-center space-y-2 shadow-inner"
                                >
                                    <div class="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition duration-300">
                                        <UploadCloud class="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span class="text-xs font-bold text-white block">Klik di sini untuk Upload Foto (Bisa Banyak Foto)</span>
                                        <span class="text-[10px] text-slate-400">Mendukung format JPG, PNG, WEBP dari Galeri HP atau Komputer</span>
                                    </div>
                                    <button type="button" class="mt-1 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] rounded-lg shadow transition">
                                        Pilih File Foto 📁
                                    </button>
                                </div>
                            </div>

                            <!-- Photo Grid List -->
                            <div class="space-y-2">
                                <label class="block font-bold text-slate-200">Daftar Koleksi Foto ({{ config.gallery.photos.length }})</label>
                                <div class="grid grid-cols-4 gap-2.5">
                                    <div v-for="(photo, idx) in config.gallery.photos" :key="idx" class="relative group rounded-xl overflow-hidden border border-slate-800 aspect-square shadow bg-slate-950">
                                        <img :src="photo" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                                        <button @click="removePhoto(idx)" title="Hapus foto ini" class="absolute top-1.5 right-1.5 bg-rose-600/90 hover:bg-rose-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                                            <Trash2 class="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Alternative URL Input Fallback -->
                            <div class="border-t border-slate-800/80 pt-3">
                                <label class="block font-bold text-slate-400 mb-1.5 text-[11px]">Atau Tambahkan via Link/URL Foto</label>
                                <div class="flex space-x-2">
                                    <input type="text" v-model="newPhotoUrl" placeholder="https://..." class="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white">
                                    <button @click="addPhoto" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold rounded-lg text-xs transition">Tambah URL</button>
                                </div>
                            </div>
                        </div>

                        <!-- Gift Form -->
                        <div v-if="activeContentSection === 'gift'" class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
                            <h3 class="text-sm font-bold text-amber-400">🎁 Rekening Bank & Kirim Kado</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Nama Bank 1</label>
                                    <input type="text" v-model="config.gift.bankName1" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-200 mb-1">Nomor Rekening 1</label>
                                    <input type="text" v-model="config.gift.accountNo1" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium">
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block font-bold text-slate-200 mb-1">Atas Nama 1</label>
                                    <input type="text" v-model="config.gift.accountName1" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium">
                                </div>
                                <div class="md:col-span-2">
                                    <label class="block font-bold text-slate-200 mb-1">Alamat Pengiriman Kado Fisik</label>
                                    <textarea rows="2" v-model="config.gift.shippingAddress" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-medium"></textarea>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- TAB 3: THEME & COLOR -->
                    <div v-if="activeTab === 'theme'" class="space-y-6">
                        <!-- Color Palette Picker -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                            <h3 class="text-sm font-bold text-white flex items-center">
                                <Palette class="w-4 h-4 mr-2 text-amber-400" /> Skema Warna Utama (High Contrast)
                            </h3>
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div v-for="p in colorPalettes" :key="p.id"
                                     @click="config.paletteId = p.id"
                                     :class="['p-3.5 rounded-xl border cursor-pointer transition text-center', config.paletteId === p.id ? 'border-amber-400 bg-amber-500/10 font-bold' : 'border-slate-800 bg-slate-950 hover:border-slate-700']">
                                    <div class="flex justify-center space-x-1.5 mb-2">
                                        <span class="w-4 h-4 rounded-full border border-slate-700 shadow-sm" :style="{ backgroundColor: p.main }"></span>
                                        <span class="w-4 h-4 rounded-full border border-slate-700 shadow-sm" :style="{ backgroundColor: p.sub }"></span>
                                        <span class="w-4 h-4 rounded-full border border-slate-700 shadow-sm" :style="{ backgroundColor: p.bg }"></span>
                                    </div>
                                    <div class="text-xs font-bold text-white">{{ p.name }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Typography Selector -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                            <h3 class="text-sm font-bold text-white flex items-center">
                                <Sparkles class="w-4 h-4 mr-2 text-amber-400" /> Gaya Typography / Font
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div v-for="f in fontStyles" :key="f.id"
                                     @click="config.fontId = f.id"
                                     :class="['p-4 rounded-xl border cursor-pointer transition text-center', config.fontId === f.id ? 'border-amber-400 bg-amber-500/10 font-bold' : 'border-slate-800 bg-slate-950 hover:border-slate-700']">
                                    <div :class="[f.fontClass, 'text-xl font-bold text-amber-300 mb-1']">Arya & Sekar</div>
                                    <div class="text-xs text-slate-300">{{ f.name }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Background Customization (Image vs Solid Color) -->
                        <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h3 class="text-sm font-bold text-white flex items-center">
                                        <ImageIcon class="w-4 h-4 mr-2 text-amber-400" /> Gambar Latar (Background Image)
                                    </h3>
                                    <p class="text-xs text-slate-400 mt-0.5">Pilih apakah ingin menggunakan foto sebagai latar belakang atau warna polos/gradien tema.</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="config.background.useImage" class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-800 border border-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <div v-if="config.background.useImage" class="space-y-3 pt-3 border-t border-slate-800">
                                <div>
                                    <label class="block text-xs font-bold text-slate-200 mb-1">URL Foto Background (Cover & Hero)</label>
                                    <input type="text" v-model="config.background.imageUrl" placeholder="Masukkan URL Foto Background..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-400">
                                </div>
                            </div>
                            <div v-else class="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex items-center">
                                <span>✓ Background aktif menggunakan warna polos/gradien tema (Tanpa foto overlay).</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <!-- RIGHT LIVE PREVIEW PANEL (45% width on desktop, responsive full height on mobile toggle) -->
            <div 
                :class="[mobileViewMode === 'preview' ? 'flex' : 'hidden lg:flex', 'w-full lg:w-[45%] bg-slate-950 flex-col items-center justify-center relative overflow-hidden border-l border-slate-800 p-4 lg:p-0']"
            >
                
                <!-- Ambient Glow Behind Phone Mockup -->
                <div class="absolute top-1/4 left-1/4 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-25 transition duration-700" :style="{ backgroundColor: activePalette.main }"></div>
                <div class="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full mix-blend-screen filter blur-3xl opacity-25 transition duration-700" :style="{ backgroundColor: activePalette.sub }"></div>

                <!-- Preview Status Header -->
                <div class="mb-4 z-10 flex items-center space-x-3 bg-slate-900/90 backdrop-blur px-4 py-2 rounded-full border border-slate-700 text-xs font-bold text-white shadow-xl">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live Smartphone Preview Active</span>
                </div>

                <!-- SMARTPHONE IPHONE MOCKUP FRAME (High Contrast) -->
                <div class="relative w-full max-w-[340px] h-[640px] lg:h-[680px] bg-slate-950 rounded-[44px] shadow-2xl border-[10px] border-slate-800 z-10 overflow-hidden flex flex-col ring-1 ring-slate-700">
                    
                    <!-- iPhone Dynamic Island / Top Notch -->
                    <div class="absolute top-0 inset-x-0 h-6 flex justify-center z-30 pointer-events-none">
                        <div class="w-28 h-5 bg-slate-950 rounded-b-xl flex items-center justify-center border-b border-x border-slate-800">
                            <div class="w-3 h-3 rounded-full bg-slate-900 mr-2"></div>
                            <div class="w-2 h-2 rounded-full bg-blue-900"></div>
                        </div>
                    </div>

                    <!-- PREVIEW CANVAS CONTENT CONTAINER -->
                    <div class="flex-1 w-full h-full relative overflow-y-auto bg-slate-950 text-white font-sans scrollbar-none">

                        <!-- Template Cover Overlay (If unopened) -->
                        <div v-if="!isEnvelopeOpened" class="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden"
                             :style="{ background: `radial-gradient(circle, ${activePalette.bg} 0%, #090d16 100%)` }">
                            <div v-if="config.background.useImage" class="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay pointer-events-none" :style="{ backgroundImage: `url(${config.background.imageUrl})` }"></div>
                            
                            <p class="text-[10px] tracking-[0.3em] uppercase mb-4 text-amber-400 font-extrabold z-10">THE WEDDING OF</p>
                            <h2 class="text-3xl font-serif font-bold italic mb-1 text-white z-10">{{ config.groom.nickname }}</h2>
                            <span class="text-amber-400 text-2xl font-serif italic z-10">&</span>
                            <h2 class="text-3xl font-serif font-bold italic mt-1 mb-6 text-white z-10">{{ config.bride.nickname }}</h2>
                            
                            <div class="bg-slate-900/90 backdrop-blur border border-slate-700 p-3.5 rounded-xl w-full mb-6 text-xs text-white z-10">
                                <p class="font-bold text-amber-300">{{ config.event.date }}</p>
                                <p class="text-[10px] text-slate-300 mt-0.5">{{ config.event.venueName }}</p>
                            </div>

                            <button @click="isEnvelopeOpened = true" class="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs rounded-full shadow-lg hover:scale-105 transition flex items-center z-10">
                                <Heart class="w-3.5 h-3.5 mr-1.5 fill-slate-950" /> Buka Undangan
                            </button>
                        </div>

                        <!-- INNER INVITATION COMPONENT PREVIEW (High Contrast Cards) -->
                        <div class="p-6 space-y-6 pb-20 relative" :style="{ background: `linear-gradient(to bottom, ${activePalette.bg}, #090d16)` }">
                            <div v-if="config.background.useImage" class="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none" :style="{ backgroundImage: `url(${config.background.imageUrl})` }"></div>

                            <!-- BGM Status -->
                            <div v-if="config.components.music" class="flex justify-between items-center bg-slate-900/90 border border-slate-700 p-2.5 rounded-xl text-[10px] text-amber-300 font-semibold shadow">
                                <span class="flex items-center"><Music class="w-3.5 h-3.5 mr-1.5 animate-spin text-amber-400" /> Playing Audio BGM</span>
                                <span class="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[9px] font-bold">Active</span>
                            </div>

                            <!-- Header Section -->
                            <div class="text-center space-y-2 pt-2">
                                <span class="text-[9px] uppercase tracking-[0.3em] text-amber-400 font-extrabold">Walimatul Ursy</span>
                                <h1 class="text-2xl font-serif font-bold italic text-white">{{ config.groom.nickname }} & {{ config.bride.nickname }}</h1>
                                <p class="text-xs text-slate-300 font-medium">{{ config.event.date }}</p>
                            </div>

                            <!-- COMPONENT: QUOTE -->
                            <div v-if="config.components.quote" class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl text-center space-y-2 shadow-md">
                                <Sparkles class="w-4 h-4 mx-auto text-amber-400" />
                                <p class="text-[11px] italic text-slate-200 leading-relaxed font-serif">"{{ config.quote.customText }}"</p>
                            </div>

                            <!-- COMPONENT: MEMPELAI -->
                            <div v-if="config.components.mempelai" class="space-y-3">
                                <!-- Groom -->
                                <div class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl text-center space-y-2 shadow-md">
                                    <img :src="config.groom.photo" class="w-16 h-16 rounded-full mx-auto object-cover border-2 border-amber-400 shadow-md">
                                    <h3 class="text-sm font-bold text-white">{{ config.groom.name }}</h3>
                                    <p class="text-[10px] text-slate-300">{{ config.groom.orderText }} {{ config.groom.father }} & {{ config.groom.mother }}</p>
                                    <span class="inline-block text-[10px] text-amber-400 font-bold">{{ config.groom.instagram }}</span>
                                </div>
                                <!-- Bride -->
                                <div class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl text-center space-y-2 shadow-md">
                                    <img :src="config.bride.photo" class="w-16 h-16 rounded-full mx-auto object-cover border-2 border-pink-400 shadow-md">
                                    <h3 class="text-sm font-bold text-white">{{ config.bride.name }}</h3>
                                    <p class="text-[10px] text-slate-300">{{ config.bride.orderText }} {{ config.bride.father }} & {{ config.bride.mother }}</p>
                                    <span class="inline-block text-[10px] text-pink-400 font-bold">{{ config.bride.instagram }}</span>
                                </div>
                            </div>

                            <!-- COMPONENT: COUNTDOWN -->
                            <div v-if="config.components.countdown" class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl text-center shadow-md">
                                <p class="text-[10px] uppercase tracking-wider text-amber-400 mb-2 font-extrabold">Hitung Mundur Acara</p>
                                <div class="grid grid-cols-4 gap-2 text-center">
                                    <div class="bg-slate-800 p-2 rounded-lg border border-slate-700"><div class="text-xs font-bold text-white">28</div><div class="text-[8px] text-slate-300">Hari</div></div>
                                    <div class="bg-slate-800 p-2 rounded-lg border border-slate-700"><div class="text-xs font-bold text-white">04</div><div class="text-[8px] text-slate-300">Jam</div></div>
                                    <div class="bg-slate-800 p-2 rounded-lg border border-slate-700"><div class="text-xs font-bold text-white">15</div><div class="text-[8px] text-slate-300">Menit</div></div>
                                    <div class="bg-slate-800 p-2 rounded-lg border border-slate-700"><div class="text-xs font-bold text-white">42</div><div class="text-[8px] text-slate-300">Detik</div></div>
                                </div>
                            </div>

                            <!-- COMPONENT: ACARA & MAPS -->
                            <div v-if="config.components.acara" class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-3 shadow-md">
                                <div class="text-center">
                                    <span class="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">Rangkaian Acara</span>
                                    <h4 class="text-xs font-bold text-white mt-1">{{ config.event.venueName }}</h4>
                                </div>
                                <div class="space-y-2 text-[10px] text-slate-200">
                                    <div class="bg-slate-950 p-2 rounded-lg flex justify-between border border-slate-800">
                                        <span class="font-bold text-amber-300">Akad Nikah:</span>
                                        <span>{{ config.event.akadTime }}</span>
                                    </div>
                                    <div class="bg-slate-950 p-2 rounded-lg flex justify-between border border-slate-800">
                                        <span class="font-bold text-amber-300">Resepsi:</span>
                                        <span>{{ config.event.resepsiTime }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- COMPONENT: LOVE STORY -->
                            <div v-if="config.components.story" class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-3 shadow-md">
                                <div class="text-center font-extrabold text-xs text-rose-400 uppercase tracking-wider">Kisah Cinta Kami</div>
                                <div class="space-y-2 border-l-2 border-amber-400 pl-3">
                                    <div v-for="(story, idx) in config.loveStories" :key="idx" class="text-[10px] space-y-0.5">
                                        <span class="text-amber-300 font-bold">{{ story.year }} - {{ story.title }}</span>
                                        <p class="text-slate-300 italic">{{ story.description }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- COMPONENT: GALLERY -->
                            <div v-if="config.components.gallery" class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-2 shadow-md">
                                <div class="text-center font-extrabold text-xs text-indigo-400 uppercase tracking-wider">Galeri Foto</div>
                                <div class="grid grid-cols-2 gap-2">
                                    <img v-for="(img, idx) in config.gallery.photos.slice(0, 4)" :key="idx" :src="img" class="w-full h-20 object-cover rounded-lg border border-slate-800">
                                </div>
                            </div>

                            <!-- COMPONENT: GIFT -->
                            <div v-if="config.components.gift" class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl text-center space-y-3 shadow-md">
                                <div class="font-extrabold text-xs text-amber-400 uppercase tracking-wider">Amplop Digital</div>
                                <div class="bg-slate-950 p-3 rounded-lg border border-slate-800 text-left space-y-1">
                                    <div class="text-[10px] font-bold text-amber-300">{{ config.gift.bankName1 }}</div>
                                    <div class="text-xs font-mono font-bold text-white tracking-wider flex justify-between items-center">
                                        <span>{{ config.gift.accountNo1 }}</span>
                                        <button @click="copyBank(config.gift.accountNo1, 'bca')" class="text-[9px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-extrabold">Salin</button>
                                    </div>
                                    <div class="text-[9px] text-slate-400">a.n {{ config.gift.accountName1 }}</div>
                                </div>
                            </div>

                            <!-- COMPONENT: RSVP -->
                            <div v-if="config.components.rsvp" class="bg-slate-900/90 border border-slate-700 p-4 rounded-xl space-y-2 text-center shadow-md">
                                <div class="font-extrabold text-xs text-teal-400 uppercase tracking-wider">Buku Tamu & RSVP</div>
                                <input type="text" placeholder="Nama Anda..." class="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-white">
                                <textarea rows="2" placeholder="Ucapan & Doa..." class="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-white"></textarea>
                                <button class="w-full py-1.5 bg-amber-400 text-slate-950 font-extrabold rounded text-[10px]">Kirim Ucapan</button>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>
    </AuthenticatedLayout>
</template>

<style scoped>
/* Custom scrollbar styling for preview container */
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
