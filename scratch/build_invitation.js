import fs from 'fs';

const code = `<script setup>
import { ref, onMounted, onUnmounted, reactive, computed, nextTick, watch } from 'vue';
import { Head } from '@inertiajs/vue3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Heart, Calendar, MapPin, Clock, Volume2, VolumeX, 
    Copy, Check, Gift as GiftIcon, Gift, MessageSquare, Send, Sparkles, 
    ChevronDown, ChevronLeft, ChevronRight, UserCheck, Eye, Compass, Image as ImageIcon,
    Flower2, Shield, Leaf, Diamond, Crown, Star, Mail, ExternalLink, ShieldCheck,
    Facebook, Instagram, User
} from 'lucide-vue-next';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
    templateSlug: String,
    guestName: String,
    invitationSlug: String,
    invitationId: [Number, String],
    invitationTitle: String,
    packageType: String,
    customData: Object,
    wishes: Array,
    giftWishlists: Array,
});

// --- State ---
const isOpen = ref(false);
const isPlayingMusic = ref(false);
const audioRef = ref(null);
const copiedBank = ref(null);
const activeLightbox = ref(null);
const activeTabNav = ref('hero');

// Active Template Mapping
const templateMap = {
    '1': 'midnight-gold',
    '2': 'serenade-green',
    'rose-romance': 'serenade-green',
    '3': 'emerald-botanical',
    '4': 'royal-velvet',
    '5': 'boho-terracotta',
    '6': 'minimalist-monochrome'
};

const activeTemplateId = computed(() => {
    const raw = props.templateSlug || customConfig.value?.templateId || 'midnight-gold';
    return templateMap[raw] || raw;
});

// Template Presets Dictionary (Pure Default State for Each Template)
const templatePresets = {
    'midnight-gold': {
        templateId: 'midnight-gold',
        groom: { name: 'Raden Arya Wijaya, S.T.', nickname: 'Arya', father: 'Bpk. Hj. Suryo Wijaya', mother: 'Ibu Hj. Endang Rahayu', orderText: 'Putra pertama dari', instagram: '@aryawijaya', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
        bride: { name: 'Putri Sekar Arum, S.Ked', nickname: 'Sekar', father: 'Bpk. Dr. H. Bambang Subroto', mother: 'Ibu Hj. Dewi Lestari', orderText: 'Putri kedua dari', instagram: '@sekararum', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
        quote: { selectedPresetIndex: 0, customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.' },
        event: { date: '2026-08-24', akadTime: '08.00 WIB - SELESAI', akadVenue: 'Masjid Agung Trans Studio', resepsiTime: '11.00 - 14.00 WIB', venueName: 'Gedung Serbaguna Senayan', locationCity: 'Jakarta Pusat', address: 'Jl. Jend. Gatot Subroto No.1, Gelora, Tanah Abang, Jakarta Pusat', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan tidak sengaja saat kegiatan kampus di Universitas Indonesia.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
            { year: '2023', title: 'Momen Lamaran', description: 'Arya secara resmi melamar Sekar di hadapan kedua keluarga besar.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Hari Pernikahan', description: 'Awal dari babak baru perjalanan kehidupan suci kami.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'] },
        gift: { bankName1: 'Bank Central Asia (BCA)', accountNo1: '8830192834', accountName1: 'Raden Arya Wijaya', shippingAddress: 'Jl. Wijaya Kusuma No. 45, Kebayoran Baru, Jakarta Selatan' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80' }
    },
    'serenade-green': {
        templateId: 'serenade-green',
        monogram: 'GP',
        groom: { name: 'Aria Galuh Arandaka', nickname: 'Galuh', father: 'Bpk. (Alm)', mother: 'Ibu Sri Rahayu Intan Bayduri', orderText: 'Putra Tunggal dari', instagram: '@aria_galuh', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
        bride: { name: 'Puspa Rema', nickname: 'Puspa', father: 'Bapak Andi Sugandi', mother: 'Ibu Rosiah (Alm)', orderText: 'Putri Keempat dari', instagram: '@pusparema', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
        quote: { selectedPresetIndex: 1, customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.' },
        event: { date: 'Minggu, 21 Januari 2024', akadTime: 'Pukul 10.00 s.d 12.00 WIB', akadVenue: 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)', resepsiTime: 'Pukul 12.00 s.d 21.00 WIB', venueName: 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)', locationCity: 'Jakarta Pusat', address: 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2016', description: 'Kita dipertemukan setelah lulus dari SMA dan menjalin komitmen untuk masa depan.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
            { year: 'Januari 2023', description: 'Dengan izin Allah SWT dan restu dari kedua keluarga. Saya berniat untuk melamar dan memintanya untuk menikah dengan saya.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: 'Januari 2024', title: 'Akad Nikah', description: 'Hingga diputuskanlah Akad nikah pada tanggal 3 Juni 2023.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'] },
        gift: { bankName1: 'Bank BCA', accountNo1: '0123456789', accountName1: 'Puspa Rema', bankName2: 'DANA', accountNo2: '081234567890', accountName2: 'Puspa Rema', shippingAddress: 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)' },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80' }
    },
    'emerald-botanical': {
        templateId: 'emerald-botanical',
        groom: { name: 'Farhan Ramadhan, S.T.', nickname: 'Farhan', father: 'Bpk. Hj. Mansyur Ramadhan', mother: 'Ibu Hj. Rosita Farida', orderText: 'Putra bungsu dari', instagram: '@farhanrmd', photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80' },
        bride: { name: 'Nadia Salsabila, S.T.', nickname: 'Nadia', father: 'Bpk. Dr. Eng. Hermawan', mother: 'Ibu Hj. Yulia Anita', orderText: 'Putri pertama dari', instagram: '@nadiasalsa', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
        quote: { selectedPresetIndex: 2, customText: 'Seperti dedaunan zamrud yang tumbuh rindang bersama, demikianlah cinta kami berakar dalam keharmonisan alam.' },
        event: { date: '2026-10-10', akadTime: '08:30 WIB - 10:30 WIB', akadVenue: 'Masjid Raya Bogor', resepsiTime: '11:00 WIB - 14:00 WIB', venueName: 'Botanical Garden Conservatory', locationCity: 'Bogor', address: 'Jl. Ir. H. Juanda No. 13, Bogor', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan dalam riset keanekaragaman hayati perkotaan.', bgImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80'] },
        gift: { bankName1: 'Bank Mandiri', accountNo1: '133001928374', accountName1: 'Farhan Ramadhan', shippingAddress: 'Jl. Pajajaran No. 12, Bogor' }
    },
    'royal-velvet': {
        templateId: 'royal-velvet',
        groom: { name: 'Bramantyo Satria, S.E.', nickname: 'Bram', father: 'Bpk. H. Satria Kusuma', mother: 'Ibu Hj. Ratna Satria', orderText: 'Putra sulung dari', instagram: '@bramantyo', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
        bride: { name: 'Valerie Anindita, B.A.', nickname: 'Valen', father: 'Bpk. Prof. Dr. Anindito', mother: 'Ibu Hj. Eleanor Anindito', orderText: 'Putri bungsu dari', instagram: '@valerieanindita', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
        quote: { selectedPresetIndex: 0, customText: 'Keanggunan beludru safir menjadi latar abadi saat dua takdir keluarga disatukan dalam kehormatan cinta.' },
        event: { date: '2026-11-20', akadTime: '09:00 WIB - 11:00 WIB', akadVenue: 'Grand Ballroom Hotel Mulia', resepsiTime: '18:30 WIB - 21:30 WIB', venueName: 'The Ritz-Carlton Ballroom', locationCity: 'Jakarta Selatan', address: 'Jl. Dr. Ide Anak Agung Gde Agung, Jakarta', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2021', title: 'Diplomatic Gala', description: 'Pertemuan perdana dalam malam kebudayaan internasional.', bgImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80'] },
        gift: { bankName1: 'Bank CIMB Niaga', accountNo1: '700192837465', accountName1: 'Bramantyo Satria', shippingAddress: 'Jl. Pondok Indah Utama No. 10, Jakarta Selatan' }
    },
    'boho-terracotta': {
        templateId: 'boho-terracotta',
        groom: { name: 'Raka Alamsyah, S.Sn', nickname: 'Raka', father: 'Bpk. Gunawan Alamsyah', mother: 'Ibu Ratmi Alamsyah', orderText: 'Putra pertama dari', instagram: '@rakaalamsyah', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80' },
        bride: { name: 'Alya Maharani, S.Ds', nickname: 'Alya', father: 'Bpk. Mahfud Hendarto', mother: 'Ibu Endah Hendarto', orderText: 'Putri kedua dari', instagram: '@alyamaharani', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
        quote: { selectedPresetIndex: 2, customText: 'Hangatnya warna terakota dan hembusan angin bohemian menjadi saksi bisu Janji Suci kita di bawah rimbunnya ilalang.' },
        event: { date: '2026-12-05', akadTime: '15:30 WIB - 17:00 WIB', akadVenue: 'Pine Hill Organic Farm', resepsiTime: '17:30 WIB - 21:00 WIB', venueName: 'Pine Hill Outdoor Lembang', locationCity: 'Bandung Barat', address: 'Jl. Maribaya No. 120, Lembang, Bandung Barat', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2022', title: 'Senja di Lembang', description: 'Pertama kali berdiskusi desain interior studio dengan nuansa rustic hangat.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'] },
        gift: { bankName1: 'Bank BCA', accountNo1: '5420192837', accountName1: 'Raka Alamsyah', shippingAddress: 'Jl. Dago Asri No. 45, Coblong, Bandung' }
    },
    'minimalist-monochrome': {
        templateId: 'minimalist-monochrome',
        groom: { name: 'Reza Mahendra, B.Arch', nickname: 'Reza', father: 'Bpk. Ir. Lukman Mahendra', mother: 'Ibu Sylvia Mahendra', orderText: 'Putra pertama dari', instagram: '@rezamahendra', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
        bride: { name: 'Fiona Adeline, M.A.', nickname: 'Fiona', father: 'Bpk. Henry Adeline', mother: 'Ibu Clarissa Adeline', orderText: 'Putri pertama dari', instagram: '@fionaadeline', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
        quote: { selectedPresetIndex: 0, customText: 'Simplicity is the ultimate sophistication. Dua jiwa, satu estetika minimalis modern dalam komitmen abadi.' },
        event: { date: '2027-01-16', akadTime: '10:00 WIB - 12:00 WIB', akadVenue: 'Museum Macan Gallery Space', resepsiTime: '18:00 WIB - 21:00 WIB', venueName: 'Alila SCBD Event Gallery', locationCity: 'Jakarta Selatan', address: 'SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan', mapsUrl: 'https://maps.google.com' },
        loveStories: [
            { year: '2022', title: 'Studio Architecture', description: 'Kolaborasi pameran seni kontemporer hitam putih di Tokyo.', bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: { photos: ['https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'] },
        gift: { bankName1: 'Bank BCA', accountNo1: '0019283746', accountName1: 'Reza Mahendra', shippingAddress: 'Jl. Gunawarman No. 22, Jakarta Selatan' }
    }
};

const customConfig = ref(null);

// Dynamic Styling Config per Template
const templateStyle = computed(() => {
    const tId = activeTemplateId.value;
    if (tId === 'serenade-green' || tId === 'rose-romance') {
        return {
            id: 'serenade-green',
            name: 'Serenade Green',
            defaultGroom: 'Galuh',
            defaultBride: 'Puspa',
            bgClass: 'bg-[#637454] text-white',
            cardBg: 'bg-[#e2e8db] text-slate-800 border border-white/60 rounded-2xl shadow-xl',
            accentText: 'text-amber-100',
            accentBorder: 'border-amber-100/40',
            buttonBg: 'bg-[#4e5d41] hover:bg-[#3d4a32] text-white font-bold',
            badgeBg: 'bg-[#637454] text-white',
            photoFrameClass: 'rounded-2xl border-2 border-[#637454]'
        };
    } else if (tId === 'emerald-botanical') {
        return {
            id: 'emerald-botanical',
            name: 'Emerald Botanical Haven',
            defaultGroom: 'Farhan',
            defaultBride: 'Nadia',
            bgClass: 'bg-[#062c1e] text-[#ecfdf5]',
            cardBg: 'bg-[#0a422e]/80 backdrop-blur-xl border border-[#34d399]/40 rounded-3xl shadow-[0_20px_50px_rgba(52,211,153,0.15)]',
            accentText: 'text-[#34d399]',
            accentBorder: 'border-[#34d399]/40',
            buttonBg: 'bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669] text-[#042015] font-extrabold shadow-lg',
            badgeBg: 'bg-[#34d399] text-[#042015]',
            photoFrameClass: 'rounded-[40px] border-2 border-[#34d399] p-2 bg-[#0a422e]'
        };
    } else if (tId === 'royal-velvet') {
        return {
            id: 'royal-velvet',
            name: 'Royal Velvet Sapphire',
            defaultGroom: 'Bram',
            defaultBride: 'Valen',
            bgClass: 'bg-[#09132b] text-[#f0f9ff]',
            cardBg: 'bg-[#0d1b3e]/95 border-2 border-[#38bdf8]/40 rounded-2xl shadow-[0_15px_40px_rgba(56,189,248,0.2)]',
            accentText: 'text-[#38bdf8]',
            accentBorder: 'border-[#38bdf8]/40',
            buttonBg: 'bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#6366f1] text-white font-extrabold shadow-lg',
            badgeBg: 'bg-[#38bdf8] text-slate-950',
            photoFrameClass: 'rounded-2xl border-2 border-[#38bdf8] p-2 bg-[#0d1b3e]'
        };
    } else if (tId === 'boho-terracotta') {
        return {
            id: 'boho-terracotta',
            name: 'Terracotta Rustic Warmth',
            defaultGroom: 'Raka',
            defaultBride: 'Alya',
            bgClass: 'bg-[#1c0f0a] text-[#fbf4ee]',
            cardBg: 'bg-[#291710]/95 border-2 border-[#d97706]/40 rounded-3xl shadow-[0_15px_40px_rgba(217,119,6,0.18)]',
            accentText: 'text-[#f59e0b]',
            accentBorder: 'border-[#d97706]/40',
            buttonBg: 'bg-gradient-to-r from-[#d97706] via-[#b45309] to-[#92400e] text-white font-extrabold shadow-lg',
            badgeBg: 'bg-[#d97706] text-white',
            photoFrameClass: 'rounded-2xl border-4 border-[#d97706]/50 p-2 bg-[#291710]'
        };
    } else if (tId === 'minimalist-monochrome') {
        return {
            id: 'minimalist-monochrome',
            name: 'Nordic Monochrome Minimalist',
            defaultGroom: 'Reza',
            defaultBride: 'Fiona',
            bgClass: 'bg-[#0a0a0a] text-[#f4f4f5]',
            cardBg: 'bg-[#18181b]/95 border border-[#3f3f46] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
            accentText: 'text-[#fafafa]',
            accentBorder: 'border-zinc-700',
            buttonBg: 'bg-zinc-100 text-zinc-950 font-extrabold shadow-lg',
            badgeBg: 'bg-zinc-100 text-zinc-950',
            photoFrameClass: 'rounded-none border border-zinc-500 p-1 bg-zinc-900'
        };
    } else {
        // Default Template 1: midnight-gold
        return {
            id: 'midnight-gold',
            name: 'Midnight Serenade Gold',
            defaultGroom: 'Arya',
            defaultBride: 'Sekar',
            bgClass: 'bg-[#f7f5f0] text-[#2c3746]',
            cardBg: 'bg-white border border-[#2c3746]/20 rounded-2xl shadow-xl',
            accentText: 'text-[#2c3746]',
            accentBorder: 'border-[#2c3746]/30',
            buttonBg: 'bg-[#2c3746] hover:bg-[#1b232e] text-white font-bold',
            badgeBg: 'bg-[#2c3746] text-white',
            photoFrameClass: 'rounded-2xl border-4 border-[#2c3746]'
        };
    }
});

// Google Calendar Generator
const googleCalendarUrl = computed(() => {
    const rawDate = customConfig.value?.event?.date || '2026-08-24';
    const groomName = customConfig.value?.groom?.nickname || templateStyle.value.defaultGroom;
    const brideName = customConfig.value?.bride?.nickname || templateStyle.value.defaultBride;
    const title = encodeURIComponent(\`\${groomName} & \${brideName} Wedding\`);
    const venue = encodeURIComponent(customConfig.value?.event?.venueName || customConfig.value?.event?.akadVenue || 'Gedung Acara');
    const details = encodeURIComponent('Undangan Pernikahan Digital');
    const startDate = rawDate.replace(/[^0-9]/g, '').slice(0, 8) + 'T080000Z';
    const endDate = rawDate.replace(/[^0-9]/g, '').slice(0, 8) + 'T120000Z';
    return \`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${title}&dates=\${startDate}/\${endDate}&details=\${details}&location=\${venue}\`;
});

// Hero Photos Carousel State
const heroSlideIndex = ref(0);
let heroSlideTimer = null;

const heroPhotos = computed(() => {
    if (customConfig.value?.gallery?.photos?.length) {
        return customConfig.value.gallery.photos;
    }
    return [
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'
    ];
});

const nextHeroSlide = () => {
    if (heroPhotos.value.length > 0) {
        heroSlideIndex.value = (heroSlideIndex.value + 1) % heroPhotos.value.length;
    }
};

const activeGalleryIndex = ref(0);
const showBankModal = ref(true);

const allGalleryPhotos = computed(() => heroPhotos.value);

const prevGalleryPhoto = () => {
    const total = allGalleryPhotos.value.length;
    if (total <= 0) return;
    activeGalleryIndex.value = (activeGalleryIndex.value - 1 + total) % total;
};

const nextGalleryPhoto = () => {
    const total = allGalleryPhotos.value.length;
    if (total <= 0) return;
    activeGalleryIndex.value = (activeGalleryIndex.value + 1) % total;
};

// Form RSVP
const rsvpForm = reactive({
    name: props.guestName || '',
    status: 'hadir',
    guests: '1',
    message: ''
});

const isSubmittingRSVP = ref(false);
const rsvpSubmitted = ref(false);

const wishesList = ref(
    props.wishes && props.wishes.length
        ? props.wishes
        : [
            { name: 'Budi & Keluarga', status: 'Hadir', message: 'Selamat untuk kebahagiaan kalian berdua! Semoga menjadi keluarga sakinah, mawaddah, warahmah. Aamiin.', date: '2 jam yang lalu' },
            { name: 'Siti Rahmawati', status: 'Hadir', message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Cantik dan ganteng banget!', date: '5 jam yang lalu' },
            { name: 'Dion & Amanda', status: 'Hadir', message: 'Happy wedding brother! Lancar-lancar terus acaranya yaa 🎉🎉', date: '1 hari yang lalu' }
        ]
);

// Countdown state
const countdown = reactive({ days: '00', hours: '00', minutes: '00', seconds: '00' });
let timerInterval = null;

const updateCountdown = () => {
    const rawDate = customConfig.value?.event?.date || '2026-08-24';
    const cleanDateStr = rawDate.match(/\\d{4}-\\d{2}-\\d{2}/) ? rawDate.match(/\\d{4}-\\d{2}-\\d{2}/)[0] : '2026-08-24';
    const targetDate = new Date(\`\${cleanDateStr}T08:00:00+07:00\`).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        countdown.days = d < 10 ? \`0\${d}\` : \`\${d}\`;
        countdown.hours = h < 10 ? \`0\${h}\` : \`\${h}\`;
        countdown.minutes = m < 10 ? \`0\${m}\` : \`\${m}\`;
        countdown.seconds = s < 10 ? \`0\${s}\` : \`\${s}\`;
    } else {
        countdown.days = '00';
        countdown.hours = '00';
        countdown.minutes = '00';
        countdown.seconds = '00';
    }
};

const openInvitation = () => {
    isOpen.value = true;
    playAudio();

    const tl = gsap.timeline();
    tl.to('#envelope-cover', {
        yPercent: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        onComplete: () => {
            document.getElementById('envelope-cover')?.classList.add('hidden');
            initScrollAnimations();
        }
    });

    tl.from('.hero-content > *', {
        y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power2.out'
    }, '-=0.5');
};

const playAudio = () => {
    if (audioRef.value && (!customConfig.value || customConfig.value.components?.music !== false)) {
        audioRef.value.play().then(() => {
            isPlayingMusic.value = true;
        }).catch(err => {
            console.log('Audio autoplay prevented:', err);
            isPlayingMusic.value = false;
        });
    }
};

const toggleMusic = () => {
    if (audioRef.value) {
        if (isPlayingMusic.value) {
            audioRef.value.pause();
            isPlayingMusic.value = false;
        } else {
            audioRef.value.play();
            isPlayingMusic.value = true;
        }
    }
};

const copyToClipboard = (text, bankKey) => {
    navigator.clipboard.writeText(text);
    copiedBank.value = bankKey;
    setTimeout(() => copiedBank.value = null, 2500);
};

const submitRSVP = () => {
    if (!rsvpForm.name || !rsvpForm.message) return;
    isSubmittingRSVP.value = true;

    setTimeout(() => {
        wishesList.value.unshift({
            name: rsvpForm.name,
            status: rsvpForm.status === 'hadir' ? 'Hadir' : 'Ragu-ragu',
            message: rsvpForm.message,
            date: 'Baru saja'
        });
        rsvpForm.name = '';
        rsvpForm.message = '';
        isSubmittingRSVP.value = false;
        rsvpSubmitted.value = true;
        setTimeout(() => rsvpSubmitted.value = false, 4000);
    }, 600);
};

const scrollToSection = (id) => {
    activeTabNav.value = id;
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
};

const initScrollAnimations = () => {
    nextTick(() => {
        ScrollTrigger.refresh();

        gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
            gsap.fromTo(el, 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
                    y: 0, opacity: 1, duration: 1, ease: 'power3.out'
                }
            );
        });

        gsap.utils.toArray('.gsap-slide-left').forEach((el) => {
            gsap.fromTo(el, 
                { x: -50, opacity: 0 },
                {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out'
                }
            );
        });

        gsap.utils.toArray('.gsap-slide-right').forEach((el) => {
            gsap.fromTo(el, 
                { x: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out'
                }
            );
        });

        gsap.utils.toArray('.gsap-scale-up').forEach((el) => {
            gsap.fromTo(el, 
                { scale: 0.88, opacity: 0 },
                {
                    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
                    scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)'
                }
            );
        });
    });
};

const loadConfig = () => {
    const params = new URLSearchParams(window.location.search);
    const invitationId = props.invitationId || params.get('id');
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    let routeTemplate = props.templateSlug || params.get('template');
    
    if (!routeTemplate && pathSegments.length >= 3 && pathSegments[0] === 'demo' && pathSegments[1] === 'invitation') {
        routeTemplate = pathSegments[2];
    }
    
    const tKey = templateMap[routeTemplate] || routeTemplate || 'midnight-gold';
    
    let stored = null;
    if (invitationId && localStorage.getItem(\`customer_invitation_\${invitationId}\`)) {
        stored = localStorage.getItem(\`customer_invitation_\${invitationId}\`);
    } else if (localStorage.getItem(\`template_config_\${tKey}\`)) {
        stored = localStorage.getItem(\`template_config_\${tKey}\`);
    }

    if (stored) {
        try {
            customConfig.value = JSON.parse(stored);
        } catch(e) {
            customConfig.value = JSON.parse(JSON.stringify(templatePresets[tKey] || templatePresets['midnight-gold']));
        }
    } else {
        customConfig.value = JSON.parse(JSON.stringify(templatePresets[tKey] || templatePresets['midnight-gold']));
    }

    if (customConfig.value) {
        customConfig.value.templateId = tKey;
    }
};

onMounted(() => {
    loadConfig();
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
    heroSlideTimer = setInterval(nextHeroSlide, 3500);

    if (typeof window !== 'undefined') {
        window.addEventListener('invitation-config-updated', loadConfig);
    }
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (typeof window !== 'undefined') {
        window.removeEventListener('invitation-config-updated', loadConfig);
    }
});
</script>

<template>
    <Head :title="\`Undangan Pernikahan (\${templateStyle.name}) - \${customConfig?.groom?.nickname || templateStyle.defaultGroom} & \${customConfig?.bride?.nickname || templateStyle.defaultBride}\`" />

    <audio ref="audioRef" loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113064.mp3" type="audio/mpeg" />
    </audio>

    <div :class="[templateStyle.bgClass, {'h-screen overflow-hidden': !isOpen}]" class="font-sans min-h-screen relative overflow-x-hidden transition-colors duration-700">
        
        <!-- COVER ENVELOPE -->
        <div id="envelope-cover" class="fixed inset-0 z-50 flex flex-col justify-between items-center px-6 py-10 md:py-14 text-center shadow-2xl overflow-hidden bg-slate-100">
            <img :src="customConfig?.background?.imageUrl || customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'" 
                 class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.97] contrast-[1.02] transition duration-700" />

            <div class="absolute inset-0 bg-gradient-to-b from-slate-200/80 via-transparent to-slate-900/65 pointer-events-none"></div>

            <div class="relative z-10 pt-4 md:pt-8 space-y-3 max-w-lg mx-auto">
                <p class="font-serif text-[#3f4b59] text-2xl md:text-3xl font-normal tracking-wide drop-shadow-sm">Wedding Invitation</p>
                
                <h1 class="font-serif text-4xl md:text-6xl font-extrabold text-[#2b3545] tracking-[0.08em] uppercase leading-[1.12] drop-shadow">
                    {{ customConfig?.groom?.nickname || templateStyle.defaultGroom }} &amp;<br />
                    {{ customConfig?.bride?.nickname || templateStyle.defaultBride }}
                </h1>

                <p class="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-[#2b3545] uppercase pt-1">
                    {{ customConfig?.event?.date ? customConfig.event.date.toUpperCase() : 'SABTU, 30 JANUARI 2027' }}
                </p>
            </div>

            <div class="relative z-10 pb-4 md:pb-8 space-y-3 max-w-sm mx-auto flex flex-col items-center">
                <div class="text-center text-[#2b3545] drop-shadow-sm">
                    <p class="font-serif italic text-sm md:text-base font-semibold text-[#3b4756] mb-0.5">Dear,</p>
                    <h3 class="font-serif text-xl md:text-3xl font-bold text-[#1f2834] tracking-wide">
                        {{ props.guestName || 'Tamu Undangan' }}
                    </h3>
                </div>

                <button @click="openInvitation" class="mt-3 bg-[#2c3746] hover:bg-[#1b232e] active:scale-95 text-white font-medium text-xs md:text-sm px-8 py-3.5 rounded-full shadow-2xl transition duration-300 flex items-center justify-center space-x-2.5 cursor-pointer border border-white/20">
                    <Mail class="w-4 h-4 text-white" />
                    <span class="tracking-wide">Open Invitation</span>
                </button>
            </div>
        </div>

        <!-- FLOATING MUSIC CONTROLLER -->
        <button v-if="isOpen" @click="toggleMusic" 
                class="fixed top-6 right-6 z-40 bg-[#2c3746] border border-white/20 text-white backdrop-blur p-3 rounded-full shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center">
            <div :class="{'animate-spin': isPlayingMusic}" class="text-amber-300" style="animation-duration: 4s;">
                <Volume2 v-if="isPlayingMusic" class="w-5 h-5" />
                <VolumeX v-else class="w-5 h-5 opacity-50" />
            </div>
        </button>

        <!-- FLOATING MOBILE BOTTOM NAVIGATION DOCK -->
        <div v-if="isOpen" class="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
            <div class="bg-[#2c3746]/95 border border-white/20 backdrop-blur-xl rounded-full px-5 py-2.5 shadow-2xl flex items-center space-x-6 text-white">
                <button @click="scrollToSection('hero')" :class="{'text-amber-300 font-bold': activeTabNav === 'hero'}" class="hover:text-amber-200 transition flex flex-col items-center">
                    <Sparkles class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Home</span>
                </button>
                <button @click="scrollToSection('mempelai')" :class="{'text-amber-400': activeTabNav === 'mempelai'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <Heart class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Mempelai</span>
                </button>
                <button @click="scrollToSection('acara')" :class="{'text-amber-400': activeTabNav === 'acara'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <Calendar class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Acara</span>
                </button>
                <button @click="scrollToSection('galeri')" :class="{'text-amber-400': activeTabNav === 'galeri'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <ImageIcon class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Galeri</span>
                </button>
                <button @click="scrollToSection('rsvp')" :class="{'text-amber-400': activeTabNav === 'rsvp'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <MessageSquare class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">RSVP</span>
                </button>
            </div>
        </div>

        <!-- ========================================== -->
        <!-- VIEW 1: TEMPLATE 1 (midnight-gold) DESIGN -->
        <!-- ========================================== -->
        <template v-if="activeTemplateId === 'midnight-gold'">
            <!-- HERO -->
            <section id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-6 md:p-12 overflow-hidden bg-[#f7f5f0]">
                <div class="absolute -top-10 -left-10 w-72 md:w-96 h-72 md:h-96 opacity-20 pointer-events-none mix-blend-multiply bg-contain bg-no-repeat bg-left-top" style="background-image: url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80')"></div>

                <div class="max-w-xl w-full mx-auto relative z-10 pt-8 pb-12">
                    <p class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal mb-3">Menuju Hari Bahagia</p>

                    <div class="flex justify-center items-center space-x-6 text-[#2c3746] mb-8 font-sans">
                        <div class="text-center">
                            <div class="text-xl md:text-2xl font-bold leading-none">{{ countdown.days }}</div>
                            <div class="text-[11px] font-medium text-[#4a5668] mt-1">Hari</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl md:text-2xl font-bold leading-none">{{ countdown.hours }}</div>
                            <div class="text-[11px] font-medium text-[#4a5668] mt-1">Jam</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl md:text-2xl font-bold leading-none">{{ countdown.minutes }}</div>
                            <div class="text-[11px] font-medium text-[#4a5668] mt-1">Menit</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl md:text-2xl font-bold leading-none">{{ countdown.seconds }}</div>
                            <div class="text-[11px] font-medium text-[#4a5668] mt-1">Detik</div>
                        </div>
                    </div>

                    <div class="w-full max-w-md mx-auto aspect-[4/3] rounded-2xl border-4 border-[#2c3746] shadow-2xl overflow-hidden mb-8 bg-slate-200">
                        <img :src="customConfig?.background?.imageUrl || customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'" 
                             class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                    </div>

                    <h1 class="font-serif text-3xl md:text-5xl font-black text-[#2c3746] tracking-[0.08em] uppercase mb-4 drop-shadow-sm">
                        {{ customConfig?.groom?.nickname || 'AMANDA' }} &amp; {{ customConfig?.bride?.nickname || 'ADITYA' }}
                    </h1>

                    <p class="text-xs md:text-sm text-[#4a5668] max-w-md mx-auto leading-relaxed font-sans px-4">
                        {{ customConfig?.quote?.customText || 'Dan mereka keduanya akan menjadi satu daging, jadi mereka tidak lagi menjadi dua orang, melainkan satu. Oleh karena itu apa yang telah dipersatukan Tuhan, janganlah manusia memisahkan.' }}
                    </p>
                </div>
            </section>

            <!-- AYAT -->
            <section id="ayat" class="py-20 px-6 text-center relative bg-[#f7f5f0] border-t border-b border-[#2c3746]/15">
                <div class="max-w-3xl mx-auto gsap-fade-up">
                    <div class="w-12 h-12 rounded-full bg-[#2c3746]/10 border border-[#2c3746]/30 flex items-center justify-center mx-auto mb-5 text-[#2c3746]">
                        <Heart class="w-6 h-6 fill-current text-[#2c3746]" />
                    </div>
                    <p class="font-serif italic text-lg md:text-2xl text-[#2c3746] leading-relaxed mb-5 font-normal">
                        "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...' }}"
                    </p>
                    <p class="text-[11px] font-bold tracking-[0.25em] text-[#4a5668] uppercase">KUTIPAN &amp; AYAT SUCI</p>
                </div>
            </section>

            <!-- MEMPELAI -->
            <section id="mempelai" class="py-24 px-6 relative overflow-hidden bg-[#f7f5f0]">
                <div class="max-w-3xl mx-auto text-center">
                    <div class="mb-14 gsap-fade-up">
                        <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal">Bride and Groom</h2>
                    </div>

                    <div class="space-y-20">
                        <div class="gsap-scale-up text-center max-w-md mx-auto">
                            <div class="w-full max-w-xs md:max-w-sm mx-auto aspect-[3/4] border-4 border-[#2c3746] shadow-xl overflow-hidden mb-5 bg-slate-200">
                                <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                            </div>
                            <h3 class="font-serif text-2xl md:text-3xl font-bold text-[#2c3746] mb-2">{{ customConfig?.bride?.name || 'Amanda Putri' }}</h3>
                            <div class="mb-3">
                                <a href="#" class="inline-flex items-center space-x-2 bg-[#2c3746] text-white text-xs font-medium px-4 py-2 rounded-md shadow">
                                    <Eye class="w-3.5 h-3.5" />
                                    <span>{{ customConfig?.bride?.instagram || '@amandaput' }}</span>
                                </a>
                            </div>
                            <div class="flex items-center justify-center space-x-3 my-3 max-w-xs mx-auto text-[#2c3746]">
                                <div class="h-0.5 w-12 bg-[#2c3746]/60"></div>
                                <span class="text-xs font-bold uppercase tracking-wider">{{ customConfig?.bride?.orderText || 'Putri Pertama dari' }}</span>
                                <div class="h-0.5 w-12 bg-[#2c3746]/60"></div>
                            </div>
                            <p class="text-sm md:text-base text-[#4a5668] leading-relaxed max-w-xs mx-auto font-normal">
                                {{ customConfig?.bride?.father || 'Bapak Iwan Susanto' }} dan {{ customConfig?.bride?.mother || 'Ibu Ani Wulandari' }}
                            </p>
                        </div>

                        <div class="gsap-scale-up text-center max-w-md mx-auto">
                            <div class="w-full max-w-xs md:max-w-sm mx-auto aspect-[3/4] border-4 border-[#2c3746] shadow-xl overflow-hidden mb-5 bg-slate-200">
                                <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                            </div>
                            <h3 class="font-serif text-2xl md:text-3xl font-bold text-[#2c3746] mb-2">{{ customConfig?.groom?.name || 'Aditya Kusuma' }}</h3>
                            <div class="mb-3">
                                <a href="#" class="inline-flex items-center space-x-2 bg-[#2c3746] text-white text-xs font-medium px-4 py-2 rounded-md shadow">
                                    <Eye class="w-3.5 h-3.5" />
                                    <span>{{ customConfig?.groom?.instagram || '@adityaks' }}</span>
                                </a>
                            </div>
                            <div class="flex items-center justify-center space-x-3 my-3 max-w-xs mx-auto text-[#2c3746]">
                                <div class="h-0.5 w-12 bg-[#2c3746]/60"></div>
                                <span class="text-xs font-bold uppercase tracking-wider">{{ customConfig?.groom?.orderText || 'Putra Pertama dari' }}</span>
                                <div class="h-0.5 w-12 bg-[#2c3746]/60"></div>
                            </div>
                            <p class="text-sm md:text-base text-[#4a5668] leading-relaxed max-w-xs mx-auto font-normal">
                                {{ customConfig?.groom?.father || 'Bapak Bambang' }} dan {{ customConfig?.groom?.mother || 'Ibu Dewi' }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ACARA -->
            <section id="acara" class="py-24 px-6 relative overflow-hidden bg-[#f7f5f0]">
                <div class="max-w-3xl mx-auto text-center space-y-16">
                    <div class="gsap-fade-up">
                        <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal">Wedding Ceremonial</h2>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8 items-center gsap-scale-up">
                        <div class="flex justify-center md:justify-end">
                            <div class="w-48 md:w-56 aspect-[3/4] rounded-tl-[120px] rounded-br-[20px] overflow-hidden shadow-2xl bg-slate-200 border-2 border-white">
                                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div class="text-center md:text-left space-y-3">
                            <h3 class="font-serif text-xl md:text-2xl font-bold text-[#2c3746] uppercase tracking-wider">HOLY MATRIMONY</h3>
                            <div class="flex items-center justify-center md:justify-start space-x-4 text-[#2c3746] font-sans py-2">
                                <span class="text-xs md:text-sm font-bold uppercase tracking-wider">SABTU</span>
                                <div class="h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <div class="text-center leading-tight">
                                    <div class="text-xl md:text-2xl font-bold">30</div>
                                    <div class="text-[10px] font-bold uppercase">JAN</div>
                                </div>
                                <div class="h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <span class="text-xs md:text-sm font-bold uppercase tracking-wider">2027</span>
                            </div>
                            <p class="text-xs md:text-sm font-bold text-[#2c3746] uppercase tracking-wider">
                                {{ customConfig?.event?.akadTime || '08.00 WIB - SELESAI' }}
                            </p>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8 items-center gsap-scale-up">
                        <div class="text-center md:text-right space-y-3 order-2 md:order-1">
                            <h3 class="font-serif text-xl md:text-2xl font-bold text-[#2c3746] uppercase tracking-wider">RECEPTION</h3>
                            <div class="flex items-center justify-center md:justify-end space-x-4 text-[#2c3746] font-sans py-2">
                                <span class="text-xs md:text-sm font-bold uppercase tracking-wider">SABTU</span>
                                <div class="h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <div class="text-center leading-tight">
                                    <div class="text-xl md:text-2xl font-bold">30</div>
                                    <div class="text-[10px] font-bold uppercase">JAN</div>
                                </div>
                                <div class="h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <span class="text-xs md:text-sm font-bold uppercase tracking-wider">2027</span>
                            </div>
                            <p class="text-xs md:text-sm font-bold text-[#2c3746] uppercase tracking-wider">
                                {{ customConfig?.event?.resepsiTime || '11.00 - 14.00 WIB' }}
                            </p>
                        </div>
                        <div class="flex justify-center md:justify-start order-1 md:order-2">
                            <div class="w-48 md:w-56 aspect-[3/4] rounded-tr-[120px] rounded-bl-[20px] overflow-hidden shadow-2xl bg-slate-200 border-2 border-white">
                                <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    <div class="text-center pt-8 space-y-3 gsap-fade-up">
                        <h3 class="font-serif text-xl md:text-3xl font-extrabold text-[#2c3746] uppercase tracking-wider max-w-lg mx-auto leading-snug">
                            {{ customConfig?.event?.venueName || customConfig?.event?.akadVenue || 'GEDUNG SASANA MANGGALA SUKOWATI SRAGEN' }}
                        </h3>
                        <p class="text-xs md:text-sm text-[#4a5668] max-w-md mx-auto leading-relaxed font-normal">
                            {{ customConfig?.event?.address || 'Jl. Dr. Sutomo, Sine, Sragen Kulon, Kec. Sragen, Kabupaten Sragen' }}
                        </p>
                        <div class="pt-4">
                            <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="inline-flex items-center space-x-2 bg-[#2c3746] hover:bg-[#1b232e] text-white text-xs font-medium px-7 py-3 rounded-full shadow-lg transition">
                                <Compass class="w-4 h-4 text-white" />
                                <span>Petunjuk Lokasi Google Maps</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- STORY -->
            <section id="story" class="py-24 px-6 relative overflow-hidden bg-[#f7f5f0]">
                <div class="max-w-xl mx-auto text-center relative z-10">
                    <div class="w-full max-w-lg mx-auto aspect-[16/9] rounded-2xl border-4 border-[#2c3746] shadow-2xl overflow-hidden mb-12 relative bg-slate-200 gsap-scale-up">
                        <img :src="customConfig?.loveStories?.[0]?.bgImage || heroPhotos[0]" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h2 class="font-script text-5xl md:text-7xl text-white font-normal drop-shadow-lg">Our love Journey</h2>
                        </div>
                    </div>

                    <div class="space-y-10 max-w-lg mx-auto">
                        <div v-for="(story, idx) in (customConfig?.loveStories || [
                            { year: '2020', title: 'Awal Bertemu', description: '2020 Kami bertemu di sebuah acara kampus.' },
                            { year: '2022', title: 'Menjalin Kasih', description: '2022 Kami mulai berkencan dan membangun komitmen bersama.' },
                            { year: '2026', title: 'Hari Pernikahan', description: '2026 Mengikat janji suci pernikahan di hadapan keluarga.' }
                        ])" :key="idx" class="gsap-fade-up text-center space-y-2">
                            <h3 class="font-serif text-2xl md:text-3xl font-bold text-[#2c3746]">{{ story.title }} - {{ story.year }}</h3>
                            <p class="text-xs md:text-sm text-[#4a5668] leading-relaxed max-w-md mx-auto font-normal">{{ story.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- GALERI -->
            <section id="galeri" class="py-24 px-6 relative text-center overflow-hidden min-h-screen flex flex-col justify-center bg-[#f7f5f0]">
                <div class="max-w-xl mx-auto relative z-10">
                    <div class="mb-8 gsap-fade-up">
                        <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal">Our Gallery</h2>
                    </div>

                    <div class="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-[#2c3746] mb-4 gsap-scale-up">
                        <img :src="allGalleryPhotos[activeGalleryIndex]" @click="activeLightbox = allGalleryPhotos[activeGalleryIndex]" class="w-full h-full object-cover cursor-pointer" />
                        <button @click.stop="prevGalleryPhoto" class="absolute left-3 top-1/2 -translate-y-1/2 text-white p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition">
                            <ChevronLeft class="w-6 h-6" />
                        </button>
                        <button @click.stop="nextGalleryPhoto" class="absolute right-3 top-1/2 -translate-y-1/2 text-white p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition">
                            <ChevronRight class="w-6 h-6" />
                        </button>
                    </div>

                    <div class="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-w-md mx-auto gsap-fade-up">
                        <div v-for="(photo, idx) in allGalleryPhotos" :key="idx" 
                             @click="activeGalleryIndex = idx" 
                             :class="activeGalleryIndex === idx ? 'border-4 border-[#2c3746] scale-105' : 'border-2 border-white/60 opacity-70'" 
                             class="aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-slate-200">
                            <img :src="photo" class="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- GIFT -->
            <section id="gift" class="py-24 px-6 text-center bg-[#f7f5f0] relative border-t border-[#2c3746]/10">
                <div class="max-w-xl mx-auto gsap-fade-up">
                    <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal mb-3">love Gift</h2>
                    <p class="text-xs md:text-sm text-[#4a5668] max-w-md mx-auto leading-relaxed font-normal mb-6">
                        Tanpa mengurangi rasa hormat, bagi tamu undangan yang ingin memberikan tanda kasih, dapat melalui rekening di bawah ini:
                    </p>
                    <button @click="showBankModal = !showBankModal" class="bg-[#2c3746] text-white text-xs font-medium px-6 py-2.5 rounded-lg shadow-md inline-flex items-center space-x-2 cursor-pointer mb-6">
                        <span>💳 Rekening</span>
                    </button>
                    <div v-if="showBankModal" class="max-w-md mx-auto bg-[#2c3746] p-6 text-white rounded-2xl shadow-xl text-left space-y-4 border border-white/20">
                        <div class="flex justify-between items-center pb-2 border-b border-white/10">
                            <span class="text-amber-300 font-bold text-base">{{ customConfig?.gift?.bankName1 || 'Bank BCA' }}</span>
                            <span class="text-[10px] text-gray-300 font-mono">Transfer Bank</span>
                        </div>
                        <div>
                            <p class="text-xs text-gray-300">Nomor Rekening:</p>
                            <p class="font-mono text-lg font-bold text-white tracking-widest">{{ customConfig?.gift?.accountNo1 || '8830192834' }}</p>
                            <p class="text-xs text-gray-300 mt-1">a.n. {{ customConfig?.gift?.accountName1 || 'Raden Arya Wijaya' }}</p>
                        </div>
                        <button @click="copyToClipboard(customConfig?.gift?.accountNo1 || '8830192834', 'bank1')" class="w-full bg-white text-[#2c3746] font-bold text-xs py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow">
                            <Check v-if="copiedBank === 'bank1'" class="w-4 h-4 text-emerald-600" />
                            <Copy v-else class="w-4 h-4" />
                            <span>{{ copiedBank === 'bank1' ? 'Disalin!' : 'Salin Rekening' }}</span>
                        </button>
                    </div>
                </div>
            </section>

            <!-- RSVP -->
            <section id="rsvp" class="py-24 px-6 pb-32 relative overflow-hidden bg-[#f7f5f0]">
                <div class="max-w-xl mx-auto relative z-10">
                    <div class="text-center mb-10 gsap-fade-up">
                        <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal mb-3">love Wishes</h2>
                    </div>

                    <div class="max-w-md mx-auto bg-[#2c3746] p-6 md:p-8 rounded-3xl shadow-xl text-white mb-8 text-left gsap-scale-up border border-white/20">
                        <form @submit.prevent="submitRSVP" class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-white mb-1.5">Nama Tamu:</label>
                                <input v-model="rsvpForm.name" type="text" required class="w-full bg-white text-[#2c3746] font-medium rounded-xl px-4 py-2.5 text-sm" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-white mb-1.5">Ucapan &amp; Doa:</label>
                                <textarea v-model="rsvpForm.message" rows="4" required class="w-full bg-white text-[#2c3746] font-medium rounded-xl px-4 py-2.5 text-sm"></textarea>
                            </div>
                            <button type="submit" :disabled="isSubmittingRSVP" class="bg-white text-[#2c3746] font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer">
                                <span>{{ isSubmittingRSVP ? 'Mengirim...' : 'Beri Ucapan' }}</span>
                            </button>
                        </form>
                    </div>

                    <div class="max-w-md mx-auto bg-[#2c3746] p-6 md:p-8 rounded-3xl shadow-xl text-white text-center gsap-fade-up border border-white/20">
                        <h3 class="font-serif text-lg md:text-xl font-bold text-white mb-3">Ucapan dan Doa Para Tamu</h3>
                        <div class="space-y-4 max-h-[350px] overflow-y-auto pr-1 text-left">
                            <div v-for="(wish, index) in wishesList" :key="index" class="bg-[#202936] border border-white/10 p-4 rounded-2xl">
                                <h4 class="font-bold text-sm text-white mb-1">{{ wish.name }}</h4>
                                <p class="text-xs text-slate-200 leading-relaxed">{{ wish.message || wish.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="relative min-h-screen flex flex-col justify-between items-center text-center p-8 overflow-hidden bg-slate-900">
                <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.75]" :style="{ backgroundImage: \`url('\${customConfig?.background?.imageUrl || heroPhotos[0]}')\` }"></div>
                <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90"></div>
                <div class="relative z-10 pt-16 md:pt-24 space-y-4 max-w-xl mx-auto gsap-fade-up">
                    <p class="font-script text-4xl md:text-6xl text-white font-normal">Thankyou</p>
                    <h2 class="font-serif text-3xl md:text-5xl font-extrabold text-white uppercase tracking-[0.2em] leading-tight">
                        {{ customConfig?.groom?.nickname || 'AMANDA' }} &amp;<br />
                        {{ customConfig?.bride?.nickname || 'ADITYA' }}
                    </h2>
                </div>
                <div class="relative z-10 pb-8 text-[11px] font-bold uppercase tracking-widest text-white/70">
                    Powered by Midnight Serenade Gold
                </div>
            </footer>
        </template>

        <!-- ========================================== -->
        <!-- VIEW 2: TEMPLATE 2 (serenade-green) DESIGN -->
        <!-- ========================================== -->
        <template v-else-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'">
            <!-- HERO -->
            <section id="hero" class="min-h-screen relative flex flex-col justify-end p-4 sm:p-6 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden z-0">
                    <div class="flex h-full w-full transition-transform duration-1000 ease-in-out" :style="{ transform: \`translateX(-\${heroSlideIndex * 100}%)\` }">
                        <div v-for="(photo, idx) in heroPhotos" :key="idx" class="w-full h-full shrink-0 relative">
                            <img :src="photo" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-gradient-to-t from-[#4f5e43]/90 via-transparent to-black/20"></div>
                        </div>
                    </div>
                </div>

                <div class="relative z-10 w-full max-w-md mx-auto bg-[#637454]/95 border border-white/30 backdrop-blur-md rounded-tr-[40px] rounded-tl-2xl rounded-b-2xl p-6 sm:p-8 text-white space-y-4 shadow-2xl mb-14 sm:mb-16 gsap-fade-up">
                    <div>
                        <span class="text-[10px] sm:text-xs font-serif tracking-[0.25em] uppercase text-amber-100/90 block mb-1">THE WEDDING OF</span>
                        <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
                            {{ customConfig?.groom?.nickname || 'Galuh' }} &amp; {{ customConfig?.bride?.nickname || 'Puspa' }}
                        </h1>
                    </div>

                    <div class="flex items-center space-x-4 sm:space-x-6 pt-2 font-serif text-white">
                        <div class="text-center">
                            <div class="text-2xl sm:text-3xl font-normal leading-none">{{ String(countdown.days).padStart(2, '0') }}</div>
                            <div class="text-[10px] text-amber-100/80 font-sans uppercase mt-1">Day</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl sm:text-3xl font-normal leading-none">{{ String(countdown.hours).padStart(2, '0') }}</div>
                            <div class="text-[10px] text-amber-100/80 font-sans uppercase mt-1">Hour</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl sm:text-3xl font-normal leading-none">{{ String(countdown.minutes).padStart(2, '0') }}</div>
                            <div class="text-[10px] text-amber-100/80 font-sans uppercase mt-1">Min</div>
                        </div>
                        <div class="text-center">
                            <div class="text-2xl sm:text-3xl font-normal leading-none">{{ String(countdown.seconds).padStart(2, '0') }}</div>
                            <div class="text-[10px] text-amber-100/80 font-sans uppercase mt-1">Sec</div>
                        </div>
                    </div>

                    <div class="pt-2">
                        <a :href="googleCalendarUrl" target="_blank" class="inline-flex items-center space-x-2 text-xs font-medium px-5 py-2.5 rounded-full border border-white/40 bg-white/10 hover:bg-white/20 transition text-white shadow">
                            <span>[</span>
                            <Calendar class="w-4 h-4 text-amber-200" />
                            <span>Save to Calendar</span>
                            <span>]</span>
                        </a>
                    </div>
                </div>
            </section>

            <!-- MONOGRAM & AYAT -->
            <section id="ayat" class="relative">
                <div class="bg-[#637454] text-amber-50 pt-16 pb-12 px-4 sm:px-6 text-center">
                    <div class="max-w-2xl mx-auto space-y-6">
                        <div class="w-16 h-16 sm:w-20 sm:h-20 border-2 border-amber-100/60 rounded-full flex items-center justify-center mx-auto text-2xl sm:text-3xl font-serif tracking-widest text-amber-100 font-bold shadow-lg uppercase gsap-rotate-in">
                            {{ customConfig?.monogram || 'GP' }}
                        </div>

                        <div class="grid grid-cols-4 gap-2 sm:gap-3 my-6 max-w-xl mx-auto gsap-scale-up">
                            <div v-for="(photo, idx) in heroPhotos.slice(0, 4)" :key="idx" class="aspect-[3/4] rounded-xl overflow-hidden shadow-md border border-white/20 bg-slate-800">
                                <img :src="photo" class="w-full h-full object-cover" />
                            </div>
                        </div>

                        <p class="font-serif text-sm sm:text-base md:text-lg leading-relaxed text-amber-100/90 font-normal px-2 gsap-fade-up">
                            "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.' }}"
                        </p>
                        <p class="text-xs font-serif text-amber-200 tracking-wider font-semibold gsap-fade-up">
                            (Q.S Ar Rum : 21)
                        </p>
                    </div>
                </div>

                <div class="bg-white text-slate-800 py-12 px-4 sm:px-6 text-center">
                    <div class="max-w-xl mx-auto space-y-3 gsap-fade-up">
                        <h2 class="font-script text-3xl sm:text-4xl text-[#4e5d41] font-normal">Assalamualaikum Wr. Wb.</h2>
                        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-md mx-auto">
                            Dengan memohon Rahmat dan Ridho Allah SWT, Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami
                        </p>
                    </div>
                </div>
            </section>

            <!-- MEMPELAI -->
            <section id="mempelai" class="py-12 sm:py-16 bg-white text-slate-900 px-4 sm:px-6">
                <div class="max-w-lg mx-auto space-y-12">
                    <div class="space-y-4 gsap-slide-left">
                        <div class="relative flex items-stretch">
                            <div class="bg-[#637454] text-white flex items-center justify-center px-3 py-6 rounded-l-2xl shrink-0">
                                <span class="font-serif text-sm sm:text-base font-bold uppercase tracking-[0.25em] rotate-180 [writing-mode:vertical-lr]">THE GROOM</span>
                            </div>
                            
                            <div class="flex-1 relative aspect-[3/4] rounded-tr-[70px] overflow-hidden bg-slate-200 border-2 border-[#637454]">
                                <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover" />
                                <div class="absolute bottom-3 left-4 text-amber-100 font-script text-3xl sm:text-4xl drop-shadow-md">
                                    {{ customConfig?.groom?.nickname || 'Galuh' }}
                                </div>
                            </div>
                        </div>

                        <div class="space-y-1 text-left pt-1">
                            <h3 class="font-serif text-xl sm:text-2xl font-bold text-[#4e5d41]">{{ customConfig?.groom?.name || 'Aria Galuh Arandaka' }}</h3>
                            <p class="text-xs text-slate-600 font-serif">
                                {{ customConfig?.groom?.orderText || 'Putra Tunggal dari' }} <strong class="text-slate-900">{{ customConfig?.groom?.mother || 'Ibu Sri Rahayu Intan Bayduri' }}</strong>
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center justify-center space-x-4 my-6 gsap-scale-up">
                        <div class="h-[1px] flex-1 bg-slate-300"></div>
                        <span class="font-serif italic text-2xl text-slate-400">&amp;</span>
                        <div class="h-[1px] flex-1 bg-slate-300"></div>
                    </div>

                    <div class="space-y-4 gsap-slide-right">
                        <div class="relative flex items-stretch">
                            <div class="flex-1 relative aspect-[3/4] rounded-tl-[70px] overflow-hidden bg-slate-200 border-2 border-[#637454]">
                                <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover" />
                                <div class="absolute bottom-3 right-4 text-amber-100 font-script text-3xl sm:text-4xl drop-shadow-md">
                                    {{ customConfig?.bride?.nickname || 'Puspa' }}
                                </div>
                            </div>

                            <div class="bg-[#637454] text-white flex items-center justify-center px-3 py-6 rounded-r-2xl shrink-0">
                                <span class="font-serif text-sm sm:text-base font-bold uppercase tracking-[0.25em] rotate-180 [writing-mode:vertical-lr]">THE BRIDE</span>
                            </div>
                        </div>

                        <div class="space-y-1 text-right pt-1">
                            <h3 class="font-serif text-xl sm:text-2xl font-bold text-[#4e5d41]">{{ customConfig?.bride?.name || 'Puspa Rema' }}</h3>
                            <p class="text-xs text-slate-600 font-serif">
                                {{ customConfig?.bride?.orderText || 'Putri Keempat dari' }} <strong class="text-slate-900">{{ customConfig?.bride?.father || 'Bapak Andi Sugandi' }}</strong> dan <strong class="text-slate-900">{{ customConfig?.bride?.mother || 'Ibu Rosiah (Alm)' }}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ACARA -->
            <section id="acara" class="py-12 sm:py-16 bg-[#e2e8db] text-[#3d4a34] px-4 sm:px-6 border-t border-[#4e5d41]/20">
                <div class="max-w-lg mx-auto space-y-12">
                    <div class="flex items-center space-x-3 gsap-fade-up">
                        <div>
                            <span class="font-serif text-2xl sm:text-3xl font-extrabold text-[#4e5d41] tracking-wider block">WEDDING</span>
                            <span class="font-script text-3xl sm:text-4xl text-[#5a6b4c] block -mt-3 ml-8">Event</span>
                        </div>
                        <div class="h-[1px] bg-[#4e5d41]/40 flex-1"></div>
                    </div>

                    <div class="space-y-3 gsap-slide-left">
                        <div class="w-full aspect-[16/10] rounded-tr-[60px] overflow-hidden bg-slate-300 border-2 border-[#637454] shadow-md">
                            <img :src="heroPhotos[0]" class="w-full h-full object-cover" />
                        </div>

                        <div class="flex items-stretch shadow-lg">
                            <div class="bg-[#637454] text-white flex items-center justify-center px-3.5 py-6 rounded-l-xl shrink-0">
                                <span class="font-serif text-sm sm:text-base font-bold uppercase tracking-[0.25em] rotate-180 [writing-mode:vertical-lr]">AKAD NIKAH</span>
                            </div>
                            <div class="flex-1 bg-white p-5 sm:p-6 rounded-r-xl border border-slate-200 text-left space-y-3">
                                <div>
                                    <h4 class="font-serif text-base sm:text-lg font-bold text-[#4e5d41] mb-1">
                                        {{ customConfig?.event?.date || 'Minggu, 21 Januari 2024' }}
                                    </h4>
                                    <p class="text-xs text-slate-600 font-sans">
                                        {{ customConfig?.event?.akadTime || 'Pukul 10.00 s.d 12.00 WIB' }}
                                    </p>
                                </div>
                                <div class="h-[1px] bg-slate-200"></div>
                                <div>
                                    <h5 class="font-serif text-sm font-bold text-[#4e5d41] mb-1">Lokasi</h5>
                                    <p class="text-xs text-slate-700 font-sans leading-relaxed">
                                        {{ customConfig?.event?.akadVenue || 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)' }}
                                    </p>
                                </div>
                                <div class="pt-1">
                                    <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="inline-flex items-center space-x-2 bg-[#637454] text-white text-xs font-medium px-4 py-2 rounded-xl shadow">
                                        <Compass class="w-4 h-4 text-amber-200" />
                                        <span>Google Maps Lokasi</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-3 gsap-slide-right">
                        <div class="w-full aspect-[16/10] rounded-tl-[60px] overflow-hidden bg-slate-300 border-2 border-[#637454] shadow-md">
                            <img :src="heroPhotos[1]" class="w-full h-full object-cover" />
                        </div>

                        <div class="flex items-stretch shadow-lg">
                            <div class="flex-1 bg-white p-5 sm:p-6 rounded-l-xl border border-slate-200 text-left space-y-3">
                                <div>
                                    <h4 class="font-serif text-base sm:text-lg font-bold text-[#4e5d41] mb-1">
                                        {{ customConfig?.event?.date || 'Minggu, 21 Januari 2024' }}
                                    </h4>
                                    <p class="text-xs text-slate-600 font-sans">
                                        {{ customConfig?.event?.resepsiTime || 'Pukul 12.00 s.d 21.00 WIB' }}
                                    </p>
                                </div>
                                <div class="h-[1px] bg-slate-200"></div>
                                <div>
                                    <h5 class="font-serif text-sm font-bold text-[#4e5d41] mb-1">Lokasi</h5>
                                    <p class="text-xs text-slate-700 font-sans leading-relaxed">
                                        {{ customConfig?.event?.venueName || 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)' }}
                                    </p>
                                </div>
                                <div class="pt-1">
                                    <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="inline-flex items-center space-x-2 bg-[#637454] text-white text-xs font-medium px-4 py-2 rounded-xl shadow">
                                        <Compass class="w-4 h-4 text-amber-200" />
                                        <span>Google Maps Lokasi</span>
                                    </a>
                                </div>
                            </div>
                            <div class="bg-[#637454] text-white flex items-center justify-center px-3.5 py-6 rounded-r-xl shrink-0">
                                <span class="font-serif text-sm sm:text-base font-bold uppercase tracking-[0.25em] rotate-180 [writing-mode:vertical-lr]">RESEPSI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- STORY -->
            <section id="story" class="py-12 sm:py-16 bg-[#637454] text-white px-4 sm:px-6">
                <div class="max-w-lg mx-auto space-y-10">
                    <div class="flex items-center space-x-3 gsap-fade-up">
                        <div>
                            <span class="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wider block">OUR</span>
                            <span class="font-script text-3xl sm:text-4xl text-amber-100 block -mt-3 ml-6">Story</span>
                        </div>
                        <div class="h-[1px] bg-white/30 flex-1"></div>
                    </div>

                    <div class="relative border-l-2 border-amber-100/40 ml-4 space-y-8 pl-6 sm:pl-8">
                        <div v-for="(story, idx) in (customConfig?.loveStories || [
                            { year: '2016', description: 'Kita dipertemukan setelah lulus dari SMA dan menjalin komitmen untuk masa depan.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
                            { year: 'Januari 2023', description: 'Dengan izin Allah SWT dan restu dari kedua keluarga. Saya berniat untuk melamar dan memintanya untuk menikah dengan saya.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
                            { year: 'Januari 2024', title: 'Akad Nikah', description: 'Hingga diputuskanlah Akad nikah pada tanggal 3 Juni 2023.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
                        ])" :key="idx" class="relative group gsap-fade-up">
                            
                            <div class="absolute -left-[41px] sm:-left-[49px] top-3 w-8 h-8 rounded-full bg-[#e2e8db] text-[#637454] border-2 border-white flex items-center justify-center shadow-lg gsap-rotate-in">
                                <Heart class="w-4 h-4 fill-current" />
                            </div>

                            <div class="bg-[#e2e8db] text-slate-800 rounded-2xl p-4 sm:p-5 border border-white/60 shadow-xl space-y-3">
                                <div class="w-full aspect-[16/10] rounded-xl overflow-hidden bg-slate-300">
                                    <img :src="story.bgImage || heroPhotos[idx % heroPhotos.length]" class="w-full h-full object-cover" />
                                </div>
                                <div class="space-y-1 text-left">
                                    <h4 class="font-serif text-lg font-bold text-[#4e5d41]">{{ story.year }}</h4>
                                    <h5 v-if="story.title" class="font-serif text-sm font-bold text-slate-900">{{ story.title }}</h5>
                                    <p class="text-xs text-slate-700 leading-relaxed font-sans">{{ story.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- GALERI -->
            <section id="galeri" class="py-12 sm:py-16 bg-[#e2e8db] text-[#3d4a34] px-4 sm:px-6">
                <div class="max-w-lg mx-auto space-y-8">
                    <div class="flex items-center space-x-3 text-center justify-center gsap-fade-up">
                        <div class="h-[1px] bg-[#4e5d41]/40 flex-1"></div>
                        <div class="text-center px-2">
                            <span class="font-serif text-2xl sm:text-3xl font-extrabold text-[#4e5d41] tracking-wider block">OUR MOMENT</span>
                            <span class="font-script text-3xl sm:text-4xl text-[#5a6b4c] block -mt-3">Gallery</span>
                        </div>
                        <div class="h-[1px] bg-[#4e5d41]/40 flex-1"></div>
                    </div>

                    <div class="bg-[#d4ded0] p-2.5 sm:p-3 rounded-2xl border border-white/60 shadow-xl space-y-2 gsap-scale-up">
                        <div class="grid grid-cols-5 gap-2">
                            <div class="col-span-3 aspect-[4/3] rounded-lg overflow-hidden border border-white bg-slate-300 cursor-pointer" @click="activeLightbox = heroPhotos[0]">
                                <img :src="heroPhotos[0]" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            </div>
                            <div class="col-span-2 aspect-[3/4] rounded-lg overflow-hidden border border-white bg-slate-300 cursor-pointer" @click="activeLightbox = heroPhotos[1]">
                                <img :src="heroPhotos[1]" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            </div>
                        </div>
                        <div class="grid grid-cols-5 gap-2 items-center">
                            <div class="col-span-2 aspect-[3/4] rounded-lg overflow-hidden border border-white bg-slate-300 cursor-pointer" @click="activeLightbox = heroPhotos[2]">
                                <img :src="heroPhotos[2]" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            </div>
                            <div class="col-span-3 aspect-[4/3] rounded-lg overflow-hidden border border-white bg-slate-300 cursor-pointer" @click="activeLightbox = heroPhotos[3]">
                                <img :src="heroPhotos[3]" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- GIFT -->
            <section id="gift" class="py-12 sm:py-16 bg-[#e2e8db] text-[#3d4a34] px-4 sm:px-6 border-t border-[#4e5d41]/20">
                <div class="max-w-lg mx-auto space-y-12">
                    <div class="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-[#637454] bg-slate-900 gsap-scale-up">
                        <iframe class="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Prewedding Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>

                    <div class="space-y-4 gsap-fade-up">
                        <div class="flex items-center space-x-3">
                            <div>
                                <span class="font-serif text-2xl sm:text-3xl font-extrabold text-[#4e5d41] tracking-wider block">WEDDING</span>
                                <span class="font-script text-3xl sm:text-4xl text-[#5a6b4c] block -mt-3 ml-8">Gift</span>
                            </div>
                            <div class="h-[1px] bg-[#4e5d41]/40 flex-1"></div>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans text-left">
                            Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
                        </p>
                    </div>

                    <div class="space-y-4">
                        <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 relative overflow-hidden space-y-4 text-left gsap-slide-left">
                            <div class="flex justify-between items-center">
                                <span class="font-extrabold text-blue-800 text-lg sm:text-xl tracking-tighter">💳 BCA</span>
                            </div>
                            <div class="space-y-1">
                                <p class="font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-800">{{ customConfig?.gift?.accountNo1 || '0123456789' }}</p>
                                <p class="text-xs font-bold text-slate-600 font-sans">{{ customConfig?.gift?.accountName1 || 'Puspa Rema' }}</p>
                            </div>
                            <button @click="copyToClipboard(customConfig?.gift?.accountNo1 || '0123456789', 'bank1')" class="bg-[#637454] text-white font-medium text-xs px-4 py-2 rounded-xl transition inline-flex items-center space-x-1.5 shadow">
                                <Copy class="w-3.5 h-3.5" />
                                <span>{{ copiedBank === 'bank1' ? 'Tersalin!' : 'Salin No. Rekening' }}</span>
                            </button>
                        </div>

                        <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 relative overflow-hidden space-y-4 text-left gsap-slide-right">
                            <div class="flex items-center space-x-2">
                                <span class="font-extrabold text-blue-500 text-lg tracking-wider">DANA</span>
                            </div>
                            <div class="space-y-1">
                                <p class="font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-800">{{ customConfig?.gift?.accountNo2 || '081234567890' }}</p>
                                <p class="text-xs font-bold text-slate-600 font-sans">{{ customConfig?.gift?.accountName2 || 'Puspa Rema' }}</p>
                            </div>
                            <button @click="copyToClipboard(customConfig?.gift?.accountNo2 || '081234567890', 'bank2')" class="bg-[#637454] text-white font-medium text-xs px-4 py-2 rounded-xl transition inline-flex items-center space-x-1.5 shadow">
                                <Copy class="w-3.5 h-3.5" />
                                <span>{{ copiedBank === 'bank2' ? 'Tersalin!' : 'Salin Nomor' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- RSVP -->
            <section id="rsvp" class="py-12 sm:py-16 bg-[#637454] text-white px-4 sm:px-6">
                <div class="max-w-lg mx-auto space-y-8">
                    <div class="space-y-2 text-center gsap-fade-up">
                        <span class="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wider block">UCAPAN &amp; DOA</span>
                    </div>

                    <div class="bg-[#e2e8db] text-slate-800 rounded-2xl p-5 sm:p-6 border border-white/60 shadow-xl space-y-5 text-left gsap-scale-up">
                        <form @submit.prevent="submitRSVP" class="space-y-3">
                            <input v-model="rsvpForm.name" type="text" required placeholder="Nama Anda" class="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs" />
                            <textarea v-model="rsvpForm.message" rows="3" required placeholder="Berikan Ucapan & Doa" class="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs"></textarea>
                            <button type="submit" :disabled="isSubmittingRSVP" class="bg-[#4e5d41] text-white font-bold text-xs px-5 py-2 rounded-lg transition shadow">
                                <span>{{ isSubmittingRSVP ? 'Mengirim...' : 'Kirim' }}</span>
                            </button>
                        </form>

                        <div class="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                            <div v-for="(wish, index) in wishesList" :key="index" class="text-xs border-b border-slate-300 pb-3">
                                <div class="font-bold text-slate-900">{{ wish.name }}</div>
                                <p class="text-xs text-slate-700 leading-relaxed pt-0.5">{{ wish.message || wish.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="bg-[#e2e8db] text-[#3d4a34] pt-12 pb-24 sm:pb-28 px-4 sm:px-6 relative text-center space-y-10 border-t border-[#4e5d41]/20">
                <div class="max-w-lg mx-auto space-y-8">
                    <div class="grid grid-cols-4 gap-2 gsap-fade-up">
                        <div v-for="(photo, idx) in heroPhotos.slice(0, 4)" :key="idx" class="aspect-[3/4] rounded-lg overflow-hidden border border-white shadow">
                            <img :src="photo" class="w-full h-full object-cover" />
                        </div>
                    </div>
                    <div class="bg-white p-6 sm:p-8 rounded-tr-[50px] rounded-tl-xl rounded-b-xl shadow-2xl border border-slate-200 text-left space-y-1 gsap-slide-left">
                        <p class="font-serif italic text-xs sm:text-sm text-slate-500">Kami yang berbahagia</p>
                        <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-[#4e5d41] tracking-wide">
                            {{ customConfig?.groom?.nickname || 'Galuh' }} &amp; {{ customConfig?.bride?.nickname || 'Puspa' }}
                        </h1>
                    </div>
                    <div class="text-[10px] font-bold uppercase tracking-widest text-[#4e5d41]">
                        Powered by Serenade Green
                    </div>
                </div>
            </footer>
        </template>

        <!-- ========================================== -->
        <!-- VIEW 3: UNIVERSAL TEMPLATES (3, 4, 5, 6) -->
        <!-- ========================================== -->
        <template v-else>
            <!-- HERO -->
            <section id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-6 md:p-12 overflow-hidden">
                <div class="max-w-xl w-full mx-auto relative z-10 pt-8 pb-12 space-y-6 gsap-fade-up">
                    <p class="font-serif text-xs sm:text-sm uppercase tracking-[0.3em] font-medium" :class="templateStyle.accentText">THE WEDDING OF</p>

                    <h1 class="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wider uppercase drop-shadow-lg" :class="templateStyle.accentText">
                        {{ customConfig?.groom?.nickname || templateStyle.defaultGroom }} &amp; {{ customConfig?.bride?.nickname || templateStyle.defaultBride }}
                    </h1>

                    <div class="w-full max-w-[280px] sm:max-w-md mx-auto aspect-[4/3] overflow-hidden shadow-2xl my-4" :class="templateStyle.photoFrameClass">
                        <img :src="customConfig?.background?.imageUrl || customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover" />
                    </div>

                    <div class="flex justify-center items-center space-x-3 sm:space-x-5 my-4 font-sans">
                        <div class="text-center min-w-[55px] sm:min-w-[65px] p-2.5 rounded-xl border shadow-lg backdrop-blur-md" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <div class="text-lg sm:text-2xl font-bold leading-none" :class="templateStyle.accentText">{{ String(countdown.days).padStart(2, '0') }}</div>
                            <div class="text-[10px] font-medium opacity-80 mt-1">HARI</div>
                        </div>
                        <div class="text-center min-w-[55px] sm:min-w-[65px] p-2.5 rounded-xl border shadow-lg backdrop-blur-md" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <div class="text-lg sm:text-2xl font-bold leading-none" :class="templateStyle.accentText">{{ String(countdown.hours).padStart(2, '0') }}</div>
                            <div class="text-[10px] font-medium opacity-80 mt-1">JAM</div>
                        </div>
                        <div class="text-center min-w-[55px] sm:min-w-[65px] p-2.5 rounded-xl border shadow-lg backdrop-blur-md" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <div class="text-lg sm:text-2xl font-bold leading-none" :class="templateStyle.accentText">{{ String(countdown.minutes).padStart(2, '0') }}</div>
                            <div class="text-[10px] font-medium opacity-80 mt-1">MENIT</div>
                        </div>
                        <div class="text-center min-w-[55px] sm:min-w-[65px] p-2.5 rounded-xl border shadow-lg backdrop-blur-md" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <div class="text-lg sm:text-2xl font-bold leading-none" :class="templateStyle.accentText">{{ String(countdown.seconds).padStart(2, '0') }}</div>
                            <div class="text-[10px] font-medium opacity-80 mt-1">DETIK</div>
                        </div>
                    </div>

                    <div class="pt-2">
                        <a :href="googleCalendarUrl" target="_blank" :class="templateStyle.buttonBg" class="inline-flex items-center space-x-2 text-xs font-extrabold px-6 py-3 rounded-full shadow-xl transition">
                            <Calendar class="w-4 h-4" />
                            <span>Save to Calendar</span>
                        </a>
                    </div>
                </div>
            </section>

            <!-- AYAT -->
            <section id="ayat" class="py-14 sm:py-20 px-4 sm:px-6 relative text-center">
                <div class="max-w-2xl mx-auto space-y-6 p-6 sm:p-10 border rounded-2xl shadow-2xl backdrop-blur-md gsap-scale-up" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                    <div class="w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-full flex items-center justify-center mx-auto text-2xl sm:text-3xl font-serif tracking-widest font-bold shadow-lg uppercase gsap-rotate-in" :class="[templateStyle.accentBorder, templateStyle.accentText]">
                        {{ customConfig?.monogram || 'WD' }}
                    </div>
                    <p class="font-serif text-sm sm:text-base leading-relaxed opacity-90 italic">
                        "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...' }}"
                    </p>
                    <p class="text-xs font-serif tracking-wider font-semibold" :class="templateStyle.accentText">
                        (Q.S Ar Rum : 21)
                    </p>
                </div>
            </section>

            <!-- MEMPELAI -->
            <section id="mempelai" class="py-14 sm:py-20 px-4 sm:px-6">
                <div class="max-w-2xl mx-auto text-center space-y-12">
                    <div class="space-y-2 gsap-fade-up">
                        <p class="font-serif text-xs uppercase tracking-widest" :class="templateStyle.accentText">Mempelai Pernikahan</p>
                        <h2 class="font-serif text-2xl sm:text-4xl font-bold">Pasangan Mempelai</h2>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                        <div class="p-6 sm:p-8 border rounded-2xl space-y-4 text-center shadow-xl gsap-slide-left" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <div class="w-28 h-28 sm:w-36 sm:h-36 mx-auto overflow-hidden shadow-xl" :class="templateStyle.photoFrameClass">
                                <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 class="font-serif text-xl sm:text-2xl font-bold" :class="templateStyle.accentText">
                                    {{ customConfig?.groom?.name || templateStyle.defaultGroom }}
                                </h3>
                                <p class="text-xs opacity-80 mt-1 font-serif">
                                    {{ customConfig?.groom?.orderText || 'Putra dari' }} <strong>{{ customConfig?.groom?.mother || 'Orang Tua Groom' }}</strong>
                                </p>
                            </div>
                        </div>
                        <div class="p-6 sm:p-8 border rounded-2xl space-y-4 text-center shadow-xl gsap-slide-right" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <div class="w-28 h-28 sm:w-36 sm:h-36 mx-auto overflow-hidden shadow-xl" :class="templateStyle.photoFrameClass">
                                <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 class="font-serif text-xl sm:text-2xl font-bold" :class="templateStyle.accentText">
                                    {{ customConfig?.bride?.name || templateStyle.defaultBride }}
                                </h3>
                                <p class="text-xs opacity-80 mt-1 font-serif">
                                    {{ customConfig?.bride?.orderText || 'Putri dari' }} <strong>{{ customConfig?.bride?.father || 'Orang Tua Bride' }}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ACARA -->
            <section id="acara" class="py-14 sm:py-20 px-4 sm:px-6">
                <div class="max-w-2xl mx-auto text-center space-y-10">
                    <div class="space-y-2 gsap-fade-up">
                        <p class="font-serif text-xs uppercase tracking-widest" :class="templateStyle.accentText">Waktu &amp; Tempat</p>
                        <h2 class="font-serif text-2xl sm:text-4xl font-bold">Rangkaian Acara</h2>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="p-6 sm:p-8 border rounded-2xl space-y-3 text-left shadow-xl gsap-slide-left" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <span class="text-xs font-bold px-3 py-1 rounded-full uppercase" :class="templateStyle.badgeBg">AKAD NIKAH</span>
                            <h4 class="font-serif text-lg font-bold pt-2">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</h4>
                            <p class="text-xs opacity-80">{{ customConfig?.event?.akadTime || '08:00 WIB' }}</p>
                            <p class="text-xs leading-relaxed">{{ customConfig?.event?.akadVenue || 'Lokasi Akad Nikah' }}</p>
                            <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" :class="templateStyle.buttonBg" class="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-xl transition shadow">
                                <Compass class="w-3.5 h-3.5" />
                                <span>Google Maps</span>
                            </a>
                        </div>
                        <div class="p-6 sm:p-8 border rounded-2xl space-y-3 text-left shadow-xl gsap-slide-right" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                            <span class="text-xs font-bold px-3 py-1 rounded-full uppercase" :class="templateStyle.badgeBg">RESEPSI</span>
                            <h4 class="font-serif text-lg font-bold pt-2">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</h4>
                            <p class="text-xs opacity-80">{{ customConfig?.event?.resepsiTime || '11:00 WIB' }}</p>
                            <p class="text-xs leading-relaxed">{{ customConfig?.event?.venueName || 'Lokasi Resepsi Pernikahan' }}</p>
                            <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" :class="templateStyle.buttonBg" class="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-xl transition shadow">
                                <Compass class="w-3.5 h-3.5" />
                                <span>Google Maps</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <!-- GALERI -->
            <section id="galeri" class="py-14 sm:py-20 px-4 sm:px-6">
                <div class="max-w-3xl mx-auto text-center space-y-8">
                    <div class="space-y-2 gsap-fade-up">
                        <p class="font-serif text-xs uppercase tracking-widest" :class="templateStyle.accentText">Momen Indah</p>
                        <h2 class="font-serif text-2xl sm:text-4xl font-bold">Galeri Prewedding</h2>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 gsap-scale-up">
                        <div v-for="(photo, idx) in heroPhotos" :key="idx" class="aspect-[3/4] overflow-hidden rounded-xl border cursor-pointer shadow-xl" :class="templateStyle.accentBorder" @click="activeLightbox = photo">
                            <img :src="photo" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- GIFT -->
            <section id="gift" class="py-14 sm:py-20 px-4 sm:px-6">
                <div class="max-w-lg mx-auto text-center space-y-8">
                    <div class="space-y-2 gsap-fade-up">
                        <p class="font-serif text-xs uppercase tracking-widest" :class="templateStyle.accentText">Tanda Kasih</p>
                        <h2 class="font-serif text-2xl sm:text-4xl font-bold">Amplop Digital</h2>
                    </div>
                    <div class="p-6 sm:p-8 border rounded-2xl space-y-4 text-left shadow-xl gsap-slide-left" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-sm" :class="templateStyle.accentText">{{ customConfig?.gift?.bankName1 || 'Bank BCA' }}</span>
                            <span class="text-xs font-mono opacity-80">REKENING</span>
                        </div>
                        <p class="font-mono text-xl sm:text-2xl font-bold tracking-wider" :class="templateStyle.accentText">
                            {{ customConfig?.gift?.accountNo1 || '1234567890' }}
                        </p>
                        <p class="text-xs opacity-80">a.n {{ customConfig?.gift?.accountName1 || templateStyle.defaultGroom }}</p>
                        <button @click="copyToClipboard(customConfig?.gift?.accountNo1 || '1234567890', 'bank1')" :class="templateStyle.buttonBg" class="text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center space-x-1.5 shadow">
                            <Copy class="w-3.5 h-3.5" />
                            <span>{{ copiedBank === 'bank1' ? 'Tersalin!' : 'Salin No. Rekening' }}</span>
                        </button>
                    </div>
                </div>
            </section>

            <!-- RSVP -->
            <section id="rsvp" class="py-14 sm:py-20 px-4 sm:px-6">
                <div class="max-w-lg mx-auto space-y-8">
                    <div class="text-center space-y-2 gsap-fade-up">
                        <p class="font-serif text-xs uppercase tracking-widest" :class="templateStyle.accentText">Buku Tamu</p>
                        <h2 class="font-serif text-2xl sm:text-4xl font-bold">Ucapan &amp; Doa Restu</h2>
                    </div>
                    <div class="p-6 sm:p-8 border rounded-2xl space-y-5 text-left shadow-xl gsap-scale-up" :class="[templateStyle.cardBg, templateStyle.accentBorder]">
                        <form @submit.prevent="submitRSVP" class="space-y-3">
                            <input v-model="rsvpForm.name" type="text" required placeholder="Nama Anda" class="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none" />
                            <textarea v-model="rsvpForm.message" rows="3" required placeholder="Berikan Ucapan & Doa" class="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/50 focus:outline-none"></textarea>
                            <button type="submit" :disabled="isSubmittingRSVP" :class="templateStyle.buttonBg" class="font-bold text-xs px-5 py-2.5 rounded-xl transition shadow">
                                {{ isSubmittingRSVP ? 'Mengirim...' : 'Kirim Ucapan' }}
                            </button>
                        </form>
                        <div class="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                            <div v-for="(wish, index) in wishesList" :key="index" class="text-xs border-b border-white/10 pb-3 space-y-1">
                                <div class="font-bold" :class="templateStyle.accentText">{{ wish.name }}</div>
                                <p class="opacity-80 leading-relaxed">{{ wish.message || wish.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="py-14 text-center px-4 space-y-4 border-t border-white/10">
                <p class="text-xs opacity-70">Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih.</p>
                <h3 class="font-serif text-2xl font-bold" :class="templateStyle.accentText">
                    {{ customConfig?.groom?.nickname || templateStyle.defaultGroom }} &amp; {{ customConfig?.bride?.nickname || templateStyle.defaultBride }}
                </h3>
                <div class="text-[10px] font-bold uppercase tracking-widest opacity-60">
                    Powered by {{ templateStyle.name }}
                </div>
            </footer>
        </template>

        <!-- LIGHTBOX MODAL -->
        <div v-if="activeLightbox" @click="activeLightbox = null" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer">
            <img :src="activeLightbox" class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2 border-white/40" />
        </div>

    </div>
</template>
`;

fs.writeFileSync('resources/js/Pages/Demo/Invitation.vue', code, 'utf8');
console.log('Successfully wrote template-isolated Invitation.vue!');
`;

fs.writeFileSync('scratch/build_invitation.js', code, 'utf8');
console.log('Written scratch/build_invitation.js!');
