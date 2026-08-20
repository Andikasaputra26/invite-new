<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { 
    Heart, Calendar, MapPin, Clock, Copy, Check, Gift, MessageSquare, 
    Sparkles, Compass, Image as ImageIcon, Music, Palette, Settings, 
    Plus, Trash2, Sliders, UploadCloud, Layers, RefreshCw, CheckCircle2, 
    ArrowLeft, ArrowRight, ExternalLink, Smartphone, Share2, ShieldCheck, 
    Link2, Upload, QrCode, CheckCircle, Sparkle, Eye
} from 'lucide-vue-next';

const props = defineProps({
    invitation: {
        type: Object,
        default: () => null
    },
    templateSlug: {
        type: String,
        default: 'midnight-gold'
    }
});

// --- Stepper Wizard State (1, 2, 3, 4) ---
const currentStep = ref(1);

// Step details
const wizardSteps = [
    { number: 1, title: 'Informasi & Link', subtitle: 'Informasi dasar & tautan khusus' },
    { number: 2, title: 'Sakelar Modul', subtitle: 'Aktifkan modul undangan' },
    { number: 3, title: 'Isi Konten Data', subtitle: 'Mempelai, acara, foto & amplop' },
    { number: 4, title: 'Tampilan & Pratinjau', subtitle: 'Tema warna & pratinjau live' }
];

// --- Custom Slug State ---
const customSlug = ref(props.invitation?.slug || 'arya-sekar');
const isSaving = ref(false);

// --- Preset Templates Katalog ---
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
        name: 'Serenade Green',
        category: 'Sage Green & Nature',
        badge: 'Terbaru',
        primaryColor: '#637454',
        accentColor: '#4e5d41',
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
    },
    {
        id: 'boho-terracotta',
        name: 'Terracotta Rustic Warmth',
        category: 'Warm Boho & Earthy Amber',
        badge: 'Boho Vintage',
        primaryColor: '#d97706',
        accentColor: '#f59e0b',
        paletteId: 'terracotta',
        previewImg: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'minimalist-monochrome',
        name: 'Nordic Monochrome Minimalist',
        category: 'Modern Architectural Black & White',
        badge: 'Minimalis Modern',
        primaryColor: '#e4e4e7',
        accentColor: '#a1a1aa',
        paletteId: 'monochrome',
        previewImg: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80'
    }
];

// --- Theme Palettes ---
const colorPalettes = [
    { id: 'gold', name: 'Royal Gold', main: '#fbbf24', sub: '#22c55e', bg: '#090d16', text: '#f4efe6' },
    { id: 'rose', name: 'Rose Romance', main: '#f472b6', sub: '#fb7185', bg: '#1f1318', text: '#fff1f2' },
    { id: 'emerald', name: 'Emerald Gem', main: '#34d399', sub: '#6ee7b7', bg: '#062c1e', text: '#ecfdf5' },
    { id: 'sapphire', name: 'Royal Sapphire', main: '#38bdf8', sub: '#818cf8', bg: '#09132b', text: '#f0f9ff' },
    { id: 'terracotta', name: 'Terracotta Warmth', main: '#d97706', sub: '#f59e0b', bg: '#1c0f0a', text: '#fbf4ee' },
    { id: 'monochrome', name: 'Nordic Monochrome', main: '#fafafa', sub: '#a1a1aa', bg: '#0a0a0a', text: '#f4f4f5' }
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

// --- DEFAULT TEMPLATE PRESETS DICTIONARY (SETIAP TEMPLATE MEMILIKI DATA PRESET UNIK) ---
const defaultPresets = {
    'midnight-gold': {
        templateId: 'midnight-gold',
        paletteId: 'gold',
        fontId: 'serif',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: { name: 'Raden Arya Wijaya, S.T.', nickname: 'Arya', father: 'Bpk. Hj. Suryo Wijaya', mother: 'Ibu Hj. Endang Rahayu', orderText: 'Putra pertama dari', instagram: '@aryawijaya', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        bride: { name: 'Putri Sekar Arum, S.Ked', nickname: 'Sekar', father: 'Bpk. Dr. H. Bambang Subroto', mother: 'Ibu Hj. Dewi Lestari', orderText: 'Putri kedua dari', instagram: '@sekararum', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
        quote: { selectedPresetIndex: 0, customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...' },
        event: { date: '2026-08-24', akadTime: '08:00 WIB - 10:00 WIB', akadVenue: 'Masjid Agung Trans Studio', resepsiTime: '11:00 WIB - 14:00 WIB', venueName: 'Gedung Serbaguna Senayan', locationCity: 'Jakarta Pusat', address: 'Jl. Jend. Gatot Subroto No.1, Jakarta Pusat', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan tidak sengaja saat kegiatan kampus di Universitas Indonesia.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
            { year: '2023', title: 'Momen Lamaran', description: 'Arya secara resmi melamar Sekar di hadapan kedua keluarga besar.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Hari Pernikahan', description: 'Awal dari babak baru perjalanan kehidupan suci kami.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=80', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=500&q=80'] },
        gift: { bankName1: 'Bank BCA', accountNo1: '8830192834', accountName1: 'Raden Arya Wijaya', qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=INVITATION_GIFT_QRIS', shippingAddress: 'Jl. Wijaya Kusuma No. 45, Jakarta Selatan' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80' }
    },
    'rose-romance': {
        templateId: 'rose-romance',
        monogram: 'GP',
        paletteId: 'rose',
        fontId: 'script',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: { name: 'Aria Galuh Arandaka', nickname: 'Galuh', father: 'Bpk. (Alm)', mother: 'Ibu Sri Rahayu Intan Bayduri', orderText: 'Putra Tunggal dari', instagram: '@aria_galuh', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        bride: { name: 'Puspa Rema', nickname: 'Puspa', father: 'Bapak Andi Sugandi', mother: 'Ibu Rosiah (Alm)', orderText: 'Putri Keempat dari', instagram: '@pusparema', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
        quote: { selectedPresetIndex: 1, customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...' },
        event: { date: '2026-09-15', akadTime: '09:00 WIB - 11:00 WIB', akadVenue: 'Masjid & Serenade Green Garden', resepsiTime: '12:00 WIB - 15:00 WIB', venueName: 'Serenade Green Ballroom & Resort', locationCity: 'Jakarta Selatan', address: 'Jl. H.R. Rasuna Said Kav. C-22, Jakarta Selatan', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2022', title: 'Pertama Bertemu', description: 'Pertama kali bertukar pandang di pameran seni rupa modern.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: '2024', title: 'Janji Kasih', description: 'Galuh secara resmi mengutarakan niat melamar Puspa.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=500&q=80', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80'] },
        gift: { bankName1: 'Bank Mandiri', accountNo1: '1370009849201', accountName1: 'Aria Galuh Arandaka', qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ROSE_QRIS', shippingAddress: 'Jl. Senopati No. 88, Jakarta Selatan' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1920&q=80' }
    },
    'emerald-botanical': {
        templateId: 'emerald-botanical',
        paletteId: 'emerald',
        fontId: 'sans',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: { name: 'Farhan Ramadhan, S.T.', nickname: 'Farhan', father: 'Bpk. Hj. Mansyur Ramadhan', mother: 'Ibu Hj. Rosita Farida', orderText: 'Putra bungsu dari', instagram: '@farhanrmd', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80' },
        bride: { name: 'Nadia Salsabila, S.T.', nickname: 'Nadia', father: 'Bpk. Dr. Eng. Hermawan', mother: 'Ibu Hj. Yulia Anita', orderText: 'Putri pertama dari', instagram: '@nadiasalsa', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
        quote: { selectedPresetIndex: 2, customText: 'Seperti dedaunan zamrud yang tumbuh rindang bersama, demikianlah cinta kami berakar dalam keharmonisan alam.' },
        event: { date: '2026-10-18', akadTime: '08:30 WIB - 10:30 WIB', akadVenue: 'Hutan Kota by Plataran', resepsiTime: '11:30 WIB - 14:30 WIB', venueName: 'Plataran Senayan Glasshouse', locationCity: 'Jakarta Pusat', address: 'Kawasan GBK, Jl. Jend. Sudirman No. 54, Jakarta Pusat', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2020', title: 'Sahabat Arsitek', description: 'Menyelesaikan tugas akhir arsitektur hijau bersama di perpustakaan.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Pernikahan Botanical', description: 'Mengikat janji nikah di tengah sejuknya keasrian kaca dan pepohonan.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=500&q=80', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80'] },
        gift: { bankName1: 'Bank BNI', accountNo1: '0981237465', accountName1: 'Farhan Ramadhan', qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOTANICAL_QRIS', shippingAddress: 'Jl. Menteng Raya No. 12, Jakarta Pusat' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80' }
    },
    'royal-velvet': {
        templateId: 'royal-velvet',
        paletteId: 'sapphire',
        fontId: 'serif',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: { name: 'Bramantyo Satria, S.E.', nickname: 'Bram', father: 'Bpk. Mayjen (Purn) Satria', mother: 'Ibu Hj. Nindya Satria', orderText: 'Putra pertama dari', instagram: '@bramantyo', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
        bride: { name: 'Valensia Clarissa, B.A.', nickname: 'Valen', father: 'Bpk. Robertus Winata', mother: 'Ibu Angela Winata', orderText: 'Putri kedua dari', instagram: '@valensiaclarissa', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
        quote: { selectedPresetIndex: 0, customText: 'Di bawah naungan kemegahan kasih dan ketetapan Takdir, kami menyatukan dua ikatan keluarga besar.' },
        event: { date: '2026-11-20', akadTime: '10:00 WIB - 12:00 WIB', akadVenue: 'Grand Hyatt Hotel Ballroom', resepsiTime: '18:30 WIB - 21:30 WIB', venueName: 'The Ritz-Carlton Pacific Place', locationCity: 'Jakarta Selatan', address: 'SCBD Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2021', title: 'Royal Encounter', description: 'Pertemuan perdana dalam acara gala dinner diplomatik internasional.', bgImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=80'] },
        gift: { bankName1: 'Bank CIMB Niaga', accountNo1: '700192837465', accountName1: 'Bramantyo Satria', qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ROYAL_QRIS', shippingAddress: 'Jl. Pondok Indah Utama No. 10, Jakarta Selatan' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80' }
    },
    'boho-terracotta': {
        templateId: 'boho-terracotta',
        paletteId: 'terracotta',
        fontId: 'serif',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: { name: 'Raka Alamsyah, S.Sn', nickname: 'Raka', father: 'Bpk. Gunawan Alamsyah', mother: 'Ibu Ratmi Alamsyah', orderText: 'Putra pertama dari', instagram: '@rakaalamsyah', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
        bride: { name: 'Alya Maharani, S.Ds', nickname: 'Alya', father: 'Bpk. Mahfud Hendarto', mother: 'Ibu Endah Hendarto', orderText: 'Putri kedua dari', instagram: '@alyamaharani', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
        quote: { selectedPresetIndex: 2, customText: 'Hangatnya warna terakota dan hembusan angin bohemian menjadi saksi bisu Janji Suci kita di bawah rimbunnya ilalang.' },
        event: { date: '2026-12-05', akadTime: '15:30 WIB - 17:00 WIB', akadVenue: 'Pine Hill Organic Farm', resepsiTime: '17:30 WIB - 21:00 WIB', venueName: 'Pine Hill Outdoor Lembang', locationCity: 'Bandung Barat', address: 'Jl. Maribaya No. 120, Lembang, Bandung Barat', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2022', title: 'Senja di Lembang', description: 'Pertama kali berdiskusi desain interior studio dengan nuansa rustic hangat.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=500&q=80'] },
        gift: { bankName1: 'Bank BCA', accountNo1: '5420192837', accountName1: 'Raka Alamsyah', qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BOHO_QRIS', shippingAddress: 'Jl. Dago Asri No. 45, Coblong, Bandung' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80' }
    },
    'minimalist-monochrome': {
        templateId: 'minimalist-monochrome',
        paletteId: 'monochrome',
        fontId: 'sans',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: { name: 'Reza Mahendra, B.Arch', nickname: 'Reza', father: 'Bpk. Ir. Lukman Mahendra', mother: 'Ibu Sylvia Mahendra', orderText: 'Putra pertama dari', instagram: '@rezamahendra', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
        bride: { name: 'Fiona Adeline, M.A.', nickname: 'Fiona', father: 'Bpk. Henry Adeline', mother: 'Ibu Clarissa Adeline', orderText: 'Putri pertama dari', instagram: '@fionaadeline', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
        quote: { selectedPresetIndex: 0, customText: 'Simplicity is the ultimate sophistication. Dua jiwa, satu estetika minimalis modern dalam komitmen abadi.' },
        event: { date: '2027-01-16', akadTime: '10:00 WIB - 12:00 WIB', akadVenue: 'Museum Macan Gallery Space', resepsiTime: '18:00 WIB - 21:00 WIB', venueName: 'Alila SCBD Event Gallery', locationCity: 'Jakarta Selatan', address: 'SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2022', title: 'Studio Architecture', description: 'Kolaborasi pameran seni kontemporer hitam putih di Tokyo.', bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=500&q=80'] },
        gift: { bankName1: 'Bank BCA', accountNo1: '0019283746', accountName1: 'Reza Mahendra', qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MONO_QRIS', shippingAddress: 'Jl. Gunawarman No. 22, Jakarta Selatan' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=80' }
    }
};

// --- Main Config State ---
const config = reactive({
    templateId: props.invitation?.template_slug || props.templateSlug || 'midnight-gold',
    paletteId: 'gold',
    fontId: 'serif',
    
    components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
    groom: { name: 'Raden Arya Wijaya, S.T.', nickname: 'Arya', father: 'Bpk. Hj. Suryo Wijaya', mother: 'Ibu Hj. Endang Rahayu', orderText: 'Putra pertama dari', instagram: '@aryawijaya', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    bride: { name: 'Putri Sekar Arum, S.Ked', nickname: 'Sekar', father: 'Bpk. Dr. H. Bambang Subroto', mother: 'Ibu Hj. Dewi Lestari', orderText: 'Putri kedua dari', instagram: '@sekararum', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
    quote: { selectedPresetIndex: 0, customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...' },
    event: { date: '2026-08-24', akadTime: '08:00 WIB - 10:00 WIB', akadVenue: 'Masjid Agung Trans Studio', resepsiTime: '11:00 WIB - 14:00 WIB', venueName: 'Gedung Serbaguna Senayan', locationCity: 'Jakarta Pusat', address: 'Jl. Jend. Gatot Subroto No.1, Gelora, Tanah Abang, Jakarta Pusat', mapsUrl: 'https://maps.google.com' },
    loveStories: [
        { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan tidak sengaja saat kegiatan kampus di Universitas Indonesia.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' }
    ],
    gallery: { layout: 'grid', photos: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80'] },
    gift: { bankName1: 'Bank BCA', accountNo1: '8830192834', accountName1: 'Raden Arya Wijaya', qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=INVITATION_GIFT_QRIS', shippingAddress: 'Jl. Wijaya Kusuma No. 45, Kebayoran Baru, Jakarta Selatan' },
    background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80' }
});

// Active Sub-section for Step 3 (Content Editor)
const activeContentSubSection = ref('mempelai');

// UI Live Preview Drawer State
const showLivePreviewModal = ref(false);
const isEnvelopeOpened = ref(false);
const isSlugCopied = ref(false);
const isSaved = ref(false);
const saveMessage = ref('');

const windowLocationOrigin = computed(() => typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8000');

const activeTemplate = computed(() => templates.find(t => t.id === config.templateId) || templates[0]);
const activePalette = computed(() => colorPalettes.find(p => p.id === config.paletteId) || colorPalettes[0]);

// Image Compressor Helper
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

// File Input References
const groomFileInput = ref(null);
const brideFileInput = ref(null);
const qrisFileInput = ref(null);
const bgFileInput = ref(null);
const galleryFileInput = ref(null);
const newPhotoUrl = ref('');

// Trigger Upload Handlers
const triggerGroomUpload = () => groomFileInput.value?.click();
const handleGroomUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
        config.groom.photo = await compressImage(file, 600, 600);
        saveCustomization();
    }
};

const triggerBrideUpload = () => brideFileInput.value?.click();
const handleBrideUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
        config.bride.photo = await compressImage(file, 600, 600);
        saveCustomization();
    }
};

const triggerQrisUpload = () => qrisFileInput.value?.click();
const handleQrisUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
        config.gift.qrisImage = await compressImage(file, 600, 600);
        saveCustomization();
    }
};

const triggerBgUpload = () => bgFileInput.value?.click();
const handleBgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
        config.background.imageUrl = await compressImage(file, 1200, 1200);
        saveCustomization();
    }
};

const triggerGalleryUpload = () => galleryFileInput.value?.click();
const handleGalleryFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        try {
            const compressed = await compressImage(file);
            config.gallery.photos.push(compressed);
        } catch (err) {
            console.error('Failed compressing photo:', err);
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

// Story Management
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
        saveCustomization();
    }
};
const removeStory = (index) => {
    config.loveStories.splice(index, 1);
    saveCustomization();
};

// Copy Public Link
const copyPublicLink = () => {
    const url = `${windowLocationOrigin.value}/v/${customSlug.value}`;
    navigator.clipboard.writeText(url);
    isSlugCopied.value = true;
    setTimeout(() => isSlugCopied.value = false, 2500);
};

// Save changes to localStorage & Database (TERISOLASI DENGAN template_config_{id})
const saveCustomization = () => {
    isSaving.value = true;
    const params = new URLSearchParams(window.location.search);
    const invitationId = props.invitation?.id || params.get('id');
    
    try {
        const jsonStr = JSON.stringify(config);
        if (invitationId) {
            localStorage.setItem(`customer_invitation_${invitationId}`, jsonStr);
        }
        if (config.templateId) {
            localStorage.setItem(`template_config_${config.templateId}`, jsonStr);
        }

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('invitation-config-updated'));
        }
    } catch (e) {
        console.error('LocalStorage save error:', e);
    }

    // Save to Database if invitation model exists
    if (props.invitation?.id) {
        router.post(route('customer.invitations.update', props.invitation.id), {
            slug: customSlug.value,
            custom_data: config
        }, {
            preserveScroll: true,
            onSuccess: () => {
                isSaving.value = false;
                isSaved.value = true;
                saveMessage.value = 'Kustomisasi template berhasil disimpan ke server!';
                setTimeout(() => isSaved.value = false, 3500);
            },
            onError: () => {
                isSaving.value = false;
                isSaved.value = true;
                saveMessage.value = 'Tersimpan di browser lokal. Periksa format isian form.';
                setTimeout(() => isSaved.value = false, 3500);
            }
        });
    } else {
        isSaving.value = false;
        isSaved.value = true;
        saveMessage.value = `Kustomisasi ${activeTemplate.value.name} berhasil disimpan!`;
        setTimeout(() => isSaved.value = false, 3500);
    }
};

// Open final invitation preview page in new tab
const openFinalPreview = () => {
    saveCustomization();
    const url = props.invitation?.slug ? `/v/${customSlug.value}` : `/demo/invitation/${config.templateId}`;
    window.open(url, '_blank');
};

// Watch templateId to sync default palette
watch(() => config.templateId, (newId) => {
    const found = templates.find(t => t.id === newId);
    if (found && found.paletteId) {
        config.paletteId = found.paletteId;
    }
}, { immediate: true });

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const chosenTemplate = params.get('template') || props.invitation?.template_slug || props.templateSlug || 'midnight-gold';
    const invitationId = props.invitation?.id || params.get('id');

    // 1. Terapkan data preset asli khusus untuk template yang dipilih
    if (defaultPresets[chosenTemplate]) {
        Object.assign(config, JSON.parse(JSON.stringify(defaultPresets[chosenTemplate])));
    }
    config.templateId = chosenTemplate;

    // 2. Jika ada data kustomisasi dari database (User Invitation)
    if (props.invitation?.custom_data) {
        try {
            Object.assign(config, props.invitation.custom_data);
        } catch (e) {
            console.error('Failed parsing props invitation data:', e);
        }
    } 
    // 3. Jika ada simpanan khusus per invitationId
    else if (invitationId && localStorage.getItem(`customer_invitation_${invitationId}`)) {
        try {
            const parsed = JSON.parse(localStorage.getItem(`customer_invitation_${invitationId}`));
            Object.assign(config, parsed);
        } catch (e) {
            console.error('Failed loading local stored customer config:', e);
        }
    }
    // 4. Jika ada simpanan khusus per templateId
    else if (localStorage.getItem(`template_config_${chosenTemplate}`)) {
        try {
            const parsed = JSON.parse(localStorage.getItem(`template_config_${chosenTemplate}`));
            Object.assign(config, parsed);
        } catch (e) {
            console.error('Failed loading template config:', e);
        }
    }
});
</script>

<template>
    <Head title="Edit Template Undangan" />

    <AuthenticatedLayout>
        <div class="max-w-5xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
            
            <!-- Page Header -->
            <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Kustomisasi Template Undangan</h1>
                    <p class="text-sm text-slate-500 mt-1">Lengkapi rincian informasi untuk mempublikasikan undangan digital Anda</p>
                </div>
                <div class="flex items-center space-x-3">
                    <button 
                        @click="showLivePreviewModal = true"
                        class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2"
                    >
                        <Smartphone class="w-4 h-4 text-orange-500" />
                        <span>Pratinjau Live HP</span>
                    </button>
                    <button 
                        @click="openFinalPreview"
                        class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs shadow-xs transition flex items-center space-x-2"
                    >
                        <ExternalLink class="w-4 h-4 text-slate-500" />
                        <span>Pratinjau Publik</span>
                    </button>
                </div>
            </div>

            <!-- STEPPER PROGRESS BAR WIZARD -->
            <div class="mb-10 px-2 sm:px-6">
                <div class="relative flex items-center justify-between">
                    
                    <!-- Progress Connecting Bar -->
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 z-0"></div>
                    <div 
                        class="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-orange-500 transition-all duration-500 z-0"
                        :style="{ width: `${((currentStep - 1) / 3) * 100}%` }"
                    ></div>

                    <!-- Step Number Circles -->
                    <div 
                        v-for="step in wizardSteps" 
                        :key="step.number"
                        @click="currentStep = step.number"
                        class="relative z-10 flex flex-col items-center cursor-pointer group"
                    >
                        <div 
                            :class="[
                                currentStep === step.number 
                                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110 ring-4 ring-orange-100 font-extrabold' 
                                    : (currentStep > step.number 
                                        ? 'bg-orange-500 text-white font-bold' 
                                        : 'bg-white text-slate-400 border-2 border-slate-200 hover:border-slate-300 font-bold'),
                                'w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-300'
                            ]"
                        >
                            <Check v-if="currentStep > step.number" class="w-5 h-5 stroke-[3]" />
                            <span v-else>{{ step.number }}</span>
                        </div>
                        <span 
                            :class="[
                                currentStep === step.number ? 'text-orange-600 font-bold' : 'text-slate-500 font-medium',
                                'text-xs mt-2 hidden sm:block text-center'
                            ]"
                        >
                            {{ step.title }}
                        </span>
                    </div>

                </div>
            </div>

            <!-- Toast Save Feedback Banner -->
            <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform -translate-y-2 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="isSaved" class="mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
                    <span class="flex items-center"><CheckCircle2 class="w-4 h-4 mr-2 text-emerald-600" /> {{ saveMessage }}</span>
                    <span class="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">Status: Synchronized</span>
                </div>
            </transition>

            <!-- MAIN STEP CONTENT CARD -->
            <div class="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">

                <!-- STEP 1: INFORMASI UTAMA & LINK -->
                <div v-if="currentStep === 1" class="space-y-6">
                    <div>
                        <h2 class="text-xl font-extrabold text-slate-900">Informasi Utama & Link Undangan</h2>
                        <p class="text-xs text-slate-500 mt-1">Lengkapi rincian informasi dan buat link tautan khusus undangan Anda</p>
                    </div>

                    <!-- Template Terpilih Badge Card -->
                    <div class="bg-gradient-to-r from-orange-50 via-white to-amber-50 border border-orange-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center space-x-3.5">
                            <img :src="activeTemplate.previewImg" class="w-14 h-14 rounded-xl object-cover border border-orange-300 shadow-xs flex-shrink-0" />
                            <div>
                                <div class="flex items-center space-x-2">
                                    <span class="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Template Terpilih</span>
                                    <span class="text-xs text-orange-600 font-bold">{{ activeTemplate.category }}</span>
                                </div>
                                <h3 class="text-sm font-bold text-slate-900 mt-0.5">{{ activeTemplate.name }}</h3>
                            </div>
                        </div>
                        <div class="bg-white border border-slate-200 px-3 py-2 rounded-lg text-right sm:text-right">
                            <span class="text-[10px] text-slate-400 block font-bold uppercase">Status Lisensi</span>
                            <span class="text-xs font-extrabold text-emerald-600 flex items-center justify-end">
                                <ShieldCheck class="w-3.5 h-3.5 mr-1" /> AKTIF & LUNAS
                            </span>
                        </div>
                    </div>

                    <!-- Custom Slug Field -->
                    <div class="space-y-2">
                        <label class="block text-xs font-extrabold text-slate-900">
                            Custom Slug / Tautan Unik <span class="text-red-500">*</span>
                        </label>
                        <div class="flex flex-col sm:flex-row items-stretch gap-2">
                            <div class="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 flex-1 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
                                <span class="font-mono text-orange-600 font-bold select-none mr-1">{{ windowLocationOrigin ? windowLocationOrigin + '/v/' : '/v/' }}</span>
                                <input 
                                    type="text" 
                                    v-model="customSlug" 
                                    placeholder="arya-sekar" 
                                    class="bg-transparent border-none p-0 text-slate-900 font-bold focus:ring-0 text-xs w-full"
                                >
                            </div>
                            <button 
                                @click="copyPublicLink" 
                                class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-xs"
                            >
                                <Check v-if="isSlugCopied" class="w-4 h-4 text-emerald-400" />
                                <Copy v-else class="w-4 h-4 text-orange-400" />
                                <span>{{ isSlugCopied ? 'Tersalin!' : 'Salin Link' }}</span>
                            </button>
                        </div>
                        <p class="text-[11px] text-slate-400">Tautan ini akan digunakan tamu untuk membuka undangan digital Anda</p>
                    </div>

                    <!-- City & Primary Date Fields -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-extrabold text-slate-900 mb-1.5">Tanggal Utama Pernikahan <span class="text-red-500">*</span></label>
                            <input 
                                type="date" 
                                v-model="config.event.date" 
                                class="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            >
                        </div>
                        <div>
                            <label class="block text-xs font-extrabold text-slate-900 mb-1.5">Kota / Lokasi Utama <span class="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                v-model="config.event.locationCity" 
                                placeholder="e.g... Jakarta Pusat / Bandung" 
                                class="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            >
                        </div>
                    </div>
                </div>

                <!-- STEP 2: SAKELAR MODUL & KOMPONEN -->
                <div v-if="currentStep === 2" class="space-y-6">
                    <div>
                        <h2 class="text-xl font-extrabold text-slate-900">Sakelar Modul & Komponen</h2>
                        <p class="text-xs text-slate-500 mt-1">Pilih modul yang ingin diaktifkan atau disembunyikan dalam undangan Anda</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        
                        <!-- Component Toggles -->
                        <div v-for="(val, key) in config.components" :key="key" 
                             :class="[config.components[key] ? 'bg-orange-50/50 border-orange-300 text-slate-900 shadow-xs' : 'bg-slate-50/50 border-slate-200 text-slate-400', 'p-4 rounded-xl border transition flex items-center justify-between']">
                            <div class="flex items-center space-x-3">
                                <div :class="[config.components[key] ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500', 'p-2 rounded-lg transition']">
                                    <Sparkles class="w-4 h-4" />
                                </div>
                                <div>
                                    <div class="text-xs font-extrabold capitalize">{{ key === 'mempelai' ? 'Profil Mempelai Pria & Wanita' : key === 'acara' ? 'Detail Acara & Google Maps' : key === 'story' ? 'Timeline Kisah Cinta' : key === 'gallery' ? 'Galeri Foto Prewedding' : key === 'gift' ? 'Amplop Digital & QRIS' : key === 'rsvp' ? 'Buku Tamu & Ucapan Tamu' : key }}</div>
                                    <div class="text-[10px] text-slate-500">Tampilkan modul ini di undangan</div>
                                </div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" v-model="config.components[key]" class="sr-only peer">
                                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </label>
                        </div>

                    </div>
                </div>

                <!-- STEP 3: ISI KONTEN DATA UNDANGAN -->
                <div v-if="currentStep === 3" class="space-y-6">
                    <div>
                        <h2 class="text-xl font-extrabold text-slate-900">Pengisian Konten Data Undangan</h2>
                        <p class="text-xs text-slate-500 mt-1">Lengkapi data mempelai, acara, cerita cinta, galeri foto, dan amplop digital</p>
                    </div>

                    <!-- Sub navigation tab bar -->
                    <div class="flex space-x-2 border-b border-slate-100 pb-3 overflow-x-auto text-xs font-bold">
                        <button @click="activeContentSubSection = 'mempelai'" :class="[activeContentSubSection === 'mempelai' ? 'bg-orange-500 text-white font-extrabold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200', 'px-4 py-2 rounded-lg transition whitespace-nowrap']">👨‍👩‍👧 Mempelai</button>
                        <button @click="activeContentSubSection = 'quote'" :class="[activeContentSubSection === 'quote' ? 'bg-orange-500 text-white font-extrabold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200', 'px-4 py-2 rounded-lg transition whitespace-nowrap']">📜 Quote / Ayat</button>
                        <button @click="activeContentSubSection = 'event'" :class="[activeContentSubSection === 'event' ? 'bg-orange-500 text-white font-extrabold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200', 'px-4 py-2 rounded-lg transition whitespace-nowrap']">🗓️ Acara & Maps</button>
                        <button @click="activeContentSubSection = 'story'" :class="[activeContentSubSection === 'story' ? 'bg-orange-500 text-white font-extrabold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200', 'px-4 py-2 rounded-lg transition whitespace-nowrap']">💖 Kisah Cinta</button>
                        <button @click="activeContentSubSection = 'gallery'" :class="[activeContentSubSection === 'gallery' ? 'bg-orange-500 text-white font-extrabold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200', 'px-4 py-2 rounded-lg transition whitespace-nowrap']">📸 Galeri Foto</button>
                        <button @click="activeContentSubSection = 'gift'" :class="[activeContentSubSection === 'gift' ? 'bg-orange-500 text-white font-extrabold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200', 'px-4 py-2 rounded-lg transition whitespace-nowrap']">🎁 Amplop Digital</button>
                    </div>

                    <!-- Mempelai Sub-Section -->
                    <div v-if="activeContentSubSection === 'mempelai'" class="space-y-6">
                        <!-- Mempelai Pria Card -->
                        <div class="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-extrabold text-slate-900">👨 Data Mempelai Pria</h3>
                                <input type="file" ref="groomFileInput" @change="handleGroomUpload" accept="image/*" class="hidden" />
                                <button @click="triggerGroomUpload" class="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition flex items-center shadow-xs">
                                    <Upload class="w-3.5 h-3.5 mr-1" /> Upload Foto Pria
                                </button>
                            </div>

                            <div class="flex items-center space-x-4">
                                <img :src="config.groom.photo" class="w-16 h-16 rounded-full object-cover border-2 border-orange-500 shadow-xs" />
                                <div class="text-xs text-slate-500">
                                    <span class="text-slate-900 font-bold block">Foto Profil Mempelai Pria</span>
                                    Klik tombol upload untuk memilih foto langsung dari perangkat Anda.
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Lengkap & Gelar <span class="text-red-500">*</span></label>
                                    <input type="text" v-model="config.groom.name" placeholder="e.g... Raden Arya Wijaya, S.T." class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Panggilan <span class="text-red-500">*</span></label>
                                    <input type="text" v-model="config.groom.nickname" placeholder="e.g... Arya" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Ayah Kandung</label>
                                    <input type="text" v-model="config.groom.father" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Ibu Kandung</label>
                                    <input type="text" v-model="config.groom.mother" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                            </div>
                        </div>

                        <!-- Mempelai Wanita Card -->
                        <div class="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-extrabold text-slate-900">👩 Data Mempelai Wanita</h3>
                                <input type="file" ref="brideFileInput" @change="handleBrideUpload" accept="image/*" class="hidden" />
                                <button @click="triggerBrideUpload" class="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition flex items-center shadow-xs">
                                    <Upload class="w-3.5 h-3.5 mr-1" /> Upload Foto Wanita
                                </button>
                            </div>

                            <div class="flex items-center space-x-4">
                                <img :src="config.bride.photo" class="w-16 h-16 rounded-full object-cover border-2 border-pink-400 shadow-xs" />
                                <div class="text-xs text-slate-500">
                                    <span class="text-slate-900 font-bold block">Foto Profil Mempelai Wanita</span>
                                    Klik tombol upload untuk memilih foto langsung dari perangkat Anda.
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Lengkap & Gelar <span class="text-red-500">*</span></label>
                                    <input type="text" v-model="config.bride.name" placeholder="e.g... Putri Sekar Arum, S.Ked" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Panggilan <span class="text-red-500">*</span></label>
                                    <input type="text" v-model="config.bride.nickname" placeholder="e.g... Sekar" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Ayah Kandung</label>
                                    <input type="text" v-model="config.bride.father" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                                <div>
                                    <label class="block font-bold text-slate-800 mb-1">Nama Ibu Kandung</label>
                                    <input type="text" v-model="config.bride.mother" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Quote Sub-Section -->
                    <div v-if="activeContentSubSection === 'quote'" class="space-y-4">
                        <h3 class="text-sm font-extrabold text-slate-900">📜 Pilihan Ayat / Monogram / Kutipan Suci Pernikahan</h3>
                        
                        <!-- Input Inisial Monogram Emblem -->
                        <div class="bg-orange-50/60 border border-orange-200 rounded-xl p-4 space-y-2">
                            <label class="block text-xs font-extrabold text-slate-900">Inisial Monogram Emblem (e.g. GP, A&P, M&R)</label>
                            <input 
                                type="text" 
                                v-model="config.monogram" 
                                placeholder="GP" 
                                class="w-full sm:w-48 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-extrabold tracking-widest uppercase focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            >
                            <p class="text-[11px] text-slate-500">Inisial ini akan tampil di lingkaran emblem monogram (seperti GP) pada bagian atas kutipan ayat suci.</p>
                        </div>

                        <div class="space-y-2">
                            <div v-for="(p, idx) in quotePresets" :key="idx" 
                                 @click="config.quote.selectedPresetIndex = idx; config.quote.customText = p.text"
                                 :class="['p-4 rounded-xl border cursor-pointer transition text-xs', config.quote.selectedPresetIndex === idx ? 'bg-orange-50/80 border-orange-500 text-slate-900 font-semibold shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300']">
                                <div class="font-extrabold text-orange-600 mb-1">{{ p.title }}</div>
                                <div class="italic text-[11px] text-slate-600">"{{ p.text }}"</div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-slate-800 mb-1">Teks Kutipan Kustom</label>
                            <textarea rows="3" v-model="config.quote.customText" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"></textarea>
                        </div>
                    </div>

                    <!-- Event Sub-Section -->
                    <div v-if="activeContentSubSection === 'event'" class="space-y-4 text-xs">
                        <h3 class="text-sm font-extrabold text-slate-900">🗓️ Tanggal, Waktu & Lokasi Acara</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-bold text-slate-800 mb-1">Tempat Akad Nikah</label>
                                <input type="text" v-model="config.event.akadVenue" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-orange-500">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-800 mb-1">Waktu Akad Nikah</label>
                                <input type="text" v-model="config.event.akadTime" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-orange-500">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-800 mb-1">Gedung / Tempat Resepsi</label>
                                <input type="text" v-model="config.event.venueName" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-orange-500">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-800 mb-1">Waktu Resepsi Pernikahan</label>
                                <input type="text" v-model="config.event.resepsiTime" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-orange-500">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block font-bold text-slate-800 mb-1">Alamat Lengkap Gedung/Lokasi</label>
                                <textarea rows="2" v-model="config.event.address" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-orange-500"></textarea>
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block font-bold text-slate-800 mb-1">Link Tautan Google Maps</label>
                                <input type="text" v-model="config.event.mapsUrl" placeholder="https://maps.google.com/..." class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-orange-500">
                            </div>
                        </div>
                    </div>

                    <!-- Story Sub-Section -->
                    <div v-if="activeContentSubSection === 'story'" class="space-y-4 text-xs">
                        <h3 class="text-sm font-extrabold text-slate-900">💖 Kisah Cinta & Timeline Momen</h3>
                        <div class="space-y-3">
                            <div v-for="(story, idx) in config.loveStories" :key="idx" class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center space-x-2">
                                        <span class="bg-orange-500 text-white font-extrabold px-2.5 py-0.5 rounded text-[10px]">{{ story.year }}</span>
                                        <span class="font-extrabold text-slate-900 text-xs">{{ story.title }}</span>
                                    </div>
                                    <button @click="removeStory(idx)" class="text-rose-500 hover:text-rose-700 p-1">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                                <p class="text-slate-600 text-[11px] leading-relaxed">{{ story.description }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Gallery Sub-Section -->
                    <div v-if="activeContentSubSection === 'gallery'" class="space-y-4 text-xs">
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-extrabold text-slate-900">📸 Galeri Foto Prewedding</h3>
                            <span class="text-xs text-slate-500 font-mono">{{ config.gallery.photos.length }} Foto Ter-upload</span>
                        </div>

                        <!-- Dropzone Box -->
                        <input type="file" ref="galleryFileInput" @change="handleGalleryFileUpload" accept="image/*" multiple class="hidden" />
                        <div 
                            @click="triggerGalleryUpload" 
                            class="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/30 hover:bg-orange-50/70 rounded-2xl p-6 text-center cursor-pointer transition group flex flex-col items-center justify-center space-y-2"
                        >
                            <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition duration-300">
                                <UploadCloud class="w-6 h-6" />
                            </div>
                            <div>
                                <span class="text-xs font-extrabold text-slate-900 block">Klik di sini untuk Upload Foto Galeri (Bisa Banyak Foto)</span>
                                <span class="text-[10px] text-slate-500">Format JPG, PNG, WEBP dari komputer atau smartphone</span>
                            </div>
                        </div>

                        <!-- Photo Grid -->
                        <div class="grid grid-cols-4 gap-2.5">
                            <div v-for="(photo, idx) in config.gallery.photos" :key="idx" class="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                                <img :src="photo" class="w-full h-full object-cover">
                                <button @click="removePhoto(idx)" class="absolute top-1.5 right-1.5 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
                                    <Trash2 class="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Gift Sub-Section -->
                    <div v-if="activeContentSubSection === 'gift'" class="space-y-4 text-xs">
                        <h3 class="text-sm font-extrabold text-slate-900">🎁 Rekening Amplop Digital & QRIS</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block font-bold text-slate-800 mb-1">Nama Bank 1</label>
                                <input type="text" v-model="config.gift.bankName1" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900">
                            </div>
                            <div>
                                <label class="block font-bold text-slate-800 mb-1">Nomor Rekening 1</label>
                                <input type="text" v-model="config.gift.accountNo1" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900">
                            </div>
                            <div class="sm:col-span-2">
                                <label class="block font-bold text-slate-800 mb-1">Atas Nama 1</label>
                                <input type="text" v-model="config.gift.accountName1" class="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900">
                            </div>
                            
                            <!-- QRIS Upload -->
                            <div class="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100">
                                <div class="flex justify-between items-center">
                                    <label class="block font-bold text-slate-800">Foto Gambar QRIS Pembayaran</label>
                                    <input type="file" ref="qrisFileInput" @change="handleQrisUpload" accept="image/*" class="hidden" />
                                    <button @click="triggerQrisUpload" class="px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold transition flex items-center">
                                        <QrCode class="w-3.5 h-3.5 mr-1" /> Upload QRIS
                                    </button>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <img :src="config.gift.qrisImage" class="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-white p-1" />
                                    <input type="text" v-model="config.gift.qrisImage" placeholder="Atau paste link URL QRIS..." class="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-slate-900">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STEP 4: TAMPILAN, WARNA & PRATINJAU -->
                <div v-if="currentStep === 4" class="space-y-6">
                    <div>
                        <h2 class="text-xl font-extrabold text-slate-900">Tampilan, Warna & Pratinjau Live</h2>
                        <p class="text-xs text-slate-500 mt-1">Sesuaikan warna tema, font typography, dan pratinjau live sebelum dibagikan</p>
                    </div>

                    <!-- Palette Selector Grid -->
                    <div class="space-y-3">
                        <label class="block text-xs font-extrabold text-slate-900">Pilih Skema Warna Utama</label>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div v-for="p in colorPalettes" :key="p.id"
                                 @click="config.paletteId = p.id"
                                 :class="['p-3.5 rounded-xl border cursor-pointer transition text-center', config.paletteId === p.id ? 'border-orange-500 bg-orange-50/60 font-bold shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300']">
                                <div class="flex justify-center space-x-1.5 mb-2">
                                    <span class="w-4 h-4 rounded-full border border-slate-200 shadow-xs" :style="{ backgroundColor: p.main }"></span>
                                    <span class="w-4 h-4 rounded-full border border-slate-200 shadow-xs" :style="{ backgroundColor: p.sub }"></span>
                                    <span class="w-4 h-4 rounded-full border border-slate-200 shadow-xs" :style="{ backgroundColor: p.bg }"></span>
                                </div>
                                <div class="text-xs font-bold text-slate-900">{{ p.name }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Typography Selector -->
                    <div class="space-y-3">
                        <label class="block text-xs font-extrabold text-slate-900">Pilih Gaya Font Typography</label>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div v-for="f in fontStyles" :key="f.id"
                                 @click="config.fontId = f.id"
                                 :class="['p-4 rounded-xl border cursor-pointer transition text-center', config.fontId === f.id ? 'border-orange-500 bg-orange-50/60 font-bold shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300']">
                                <div :class="[f.fontClass, 'text-lg font-bold text-orange-600 mb-1']">{{ config.groom.nickname }} & {{ config.bride.nickname }}</div>
                                <div class="text-xs text-slate-600">{{ f.name }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Background Image Uploader -->
                    <div class="space-y-3 pt-3 border-t border-slate-100">
                        <div class="flex justify-between items-center">
                            <label class="block text-xs font-extrabold text-slate-900">Gambar Latar Belakang (Cover Background)</label>
                            <input type="file" ref="bgFileInput" @change="handleBgUpload" accept="image/*" class="hidden" />
                            <button @click="triggerBgUpload" class="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition flex items-center shadow-xs">
                                <Upload class="w-3.5 h-3.5 mr-1" /> Upload Background
                            </button>
                        </div>
                        <input type="text" v-model="config.background.imageUrl" placeholder="Masukkan URL Foto Background..." class="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:border-orange-500">
                    </div>
                </div>

                <!-- BOTTOM NAVIGATION CONTROL BUTTONS -->
                <div class="pt-6 border-t border-slate-100 flex items-center justify-between">
                    
                    <!-- Previous Button -->
                    <div>
                        <button 
                            v-if="currentStep > 1" 
                            @click="currentStep--" 
                            class="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition flex items-center space-x-2 shadow-xs"
                        >
                            <ArrowLeft class="w-4 h-4" />
                            <span>Kembali</span>
                        </button>
                    </div>

                    <!-- Next or Submit Button -->
                    <div class="flex items-center space-x-3">
                        <button 
                            v-if="currentStep < 4" 
                            @click="currentStep++" 
                            class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition flex items-center space-x-2"
                        >
                            <span>Lanjut</span>
                            <ArrowRight class="w-4 h-4" />
                        </button>
                        
                        <button 
                            v-if="currentStep === 4" 
                            @click="saveCustomization"
                            :disabled="isSaving"
                            class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 transition flex items-center space-x-2 disabled:opacity-50"
                        >
                            <CheckCircle2 v-if="!isSaving" class="w-4 h-4" />
                            <RefreshCw v-else class="w-4 h-4 animate-spin" />
                            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan & Publikasikan' }}</span>
                        </button>
                    </div>

                </div>

            </div>

        </div>

        <!-- LIVE SMARTPHONE PREVIEW MODAL DRAWER -->
        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showLivePreviewModal" class="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-slate-950 w-full max-w-sm rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh]">
                    
                    <!-- Close Bar -->
                    <div class="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-white text-xs font-bold z-30">
                        <span class="flex items-center"><Smartphone class="w-4 h-4 mr-1.5 text-orange-400" /> Pratinjau HP ({{ activeTemplate.name }})</span>
                        <button @click="showLivePreviewModal = false" class="text-slate-400 hover:text-white font-bold text-sm px-2">✕ Tutup</button>
                    </div>

                    <!-- Inner Phone Screen Canvas -->
                    <div class="flex-1 w-full h-[600px] overflow-y-auto bg-slate-950 text-white font-sans scrollbar-none relative p-6 space-y-6">
                        
                        <!-- Header -->
                        <div class="text-center space-y-2 pt-2">
                            <span class="text-[9px] uppercase tracking-[0.3em] text-amber-400 font-extrabold">Walimatul Ursy</span>
                            <h1 class="text-2xl font-serif font-bold italic text-white">{{ config.groom.nickname }} & {{ config.bride.nickname }}</h1>
                            <p class="text-xs text-slate-300 font-medium">{{ config.event.date }}</p>
                        </div>

                        <!-- Quote -->
                        <div v-if="config.components.quote" class="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2 shadow-xs">
                            <p class="text-[11px] italic text-slate-200 leading-relaxed font-serif">"{{ config.quote.customText }}"</p>
                        </div>

                        <!-- Groom & Bride -->
                        <div v-if="config.components.mempelai" class="space-y-3">
                            <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2">
                                <img :src="config.groom.photo" class="w-16 h-16 rounded-full mx-auto object-cover border-2 border-orange-400">
                                <h3 class="text-xs font-bold text-white">{{ config.groom.name }}</h3>
                            </div>
                            <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center space-y-2">
                                <img :src="config.bride.photo" class="w-16 h-16 rounded-full mx-auto object-cover border-2 border-pink-400">
                                <h3 class="text-xs font-bold text-white">{{ config.bride.name }}</h3>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </transition>
    </AuthenticatedLayout>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
    display: none;
}
.scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
