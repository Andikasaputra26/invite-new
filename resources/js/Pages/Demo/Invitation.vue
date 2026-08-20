<script setup>
import { ref, onMounted, onUnmounted, reactive, computed, watch, nextTick } from 'vue';
import { Head } from '@inertiajs/vue3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Heart, Calendar, MapPin, Clock, Volume2, VolumeX, 
    Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    ChevronDown, ChevronLeft, ChevronRight, UserCheck, Eye, Compass, Image as ImageIcon,
    Flower2, Shield, Leaf, Diamond, Crown, Star, Mail
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
const activeTabNav = ref('home');

// Custom Config from Props or LocalStorage
const customConfig = ref(props.customData || null);

// Google Calendar URL Generator
const googleCalendarUrl = computed(() => {
    const rawDate = customConfig.value?.event?.date || '2026-08-24';
    const title = encodeURIComponent((customConfig.value?.groom?.name || 'Raden Arya') + ' & ' + (customConfig.value?.bride?.name || 'Putri Sekar') + ' Wedding');
    const venue = encodeURIComponent(customConfig.value?.event?.venue || 'Gedung Acara');
    const details = encodeURIComponent('Undangan Pernikahan Digital');
    const startDate = rawDate.replace(/-/g, '') + 'T080000Z';
    const endDate = rawDate.replace(/-/g, '') + 'T120000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${venue}`;
});

// Hero Slider State for Template 2 (rose-romance)
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
    heroSlideIndex.value = (heroSlideIndex.value + 1) % heroPhotos.value.length;
};

const prevHeroSlide = () => {
    heroSlideIndex.value = (heroSlideIndex.value - 1 + heroPhotos.value.length) % heroPhotos.value.length;
};

const templateMap = {
    '1': 'midnight-gold',
    '2': 'rose-romance',
    '3': 'emerald-botanical',
    '4': 'royal-velvet',
    '5': 'boho-terracotta',
    '6': 'minimalist-monochrome'
};

const activeTemplateId = computed(() => {
    const raw = props.templateSlug || customConfig.value?.templateId || 'midnight-gold';
    return templateMap[raw] || raw;
});

// Dynamic Template Styling & Layout Config
const templateStyle = computed(() => {
    const tId = activeTemplateId.value;
    if (tId === 'rose-romance') {
        return {
            id: 'rose-romance',
            name: 'Floral Garden Romance',
            bgClass: 'bg-[#1f1318] text-[#fff1f2]',
            coverBg: 'bg-[#180d12]',
            cardBg: 'bg-[#2a1720]/95 border-[#f472b6]/30 rounded-t-[40px] sm:rounded-t-[50px] rounded-b-[20px] sm:rounded-b-[24px] shadow-[0_10px_30px_rgba(244,114,182,0.15)]',
            accentText: 'text-[#f472b6]',
            accentBorder: 'border-[#f472b6]/40',
            accentBg: 'bg-[#f472b6]/15',
            buttonBg: 'bg-gradient-to-r from-[#f472b6] via-[#fb7185] to-[#f43f5e] text-white shadow-lg shadow-[#f472b6]/30 hover:scale-105',
            badgeBg: 'bg-[#f472b6] text-white',
            iconColor: 'text-[#f472b6]',
            heroTitleClass: 'font-serif text-4xl sm:text-5xl md:text-7xl italic font-normal text-pink-100 tracking-wide',
            photoFrameClass: 'rounded-t-full rounded-b-3xl border-4 border-[#f472b6]/50 shadow-2xl p-1.5 bg-[#2a1720]'
        };
    } else if (tId === 'emerald-botanical') {
        return {
            id: 'emerald-botanical',
            name: 'Emerald Botanical Haven',
            bgClass: 'bg-[#062c1e] text-[#ecfdf5]',
            coverBg: 'bg-[#042015]',
            cardBg: 'bg-[#0a422e]/80 backdrop-blur-xl border border-[#34d399]/40 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(52,211,153,0.15)]',
            accentText: 'text-[#34d399]',
            accentBorder: 'border-[#34d399]/40',
            accentBg: 'bg-[#34d399]/15',
            buttonBg: 'bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669] text-[#042015] font-extrabold shadow-lg shadow-[#34d399]/25 hover:scale-105',
            badgeBg: 'bg-[#34d399] text-[#042015]',
            iconColor: 'text-[#34d399]',
            heroTitleClass: 'font-sans text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white uppercase',
            photoFrameClass: 'rounded-[30px] sm:rounded-[40px] border-2 border-[#34d399] shadow-2xl p-2 bg-[#0a422e]'
        };
    } else if (tId === 'royal-velvet') {
        return {
            id: 'royal-velvet',
            name: 'Royal Velvet Sapphire',
            bgClass: 'bg-[#09132b] text-[#f0f9ff]',
            coverBg: 'bg-[#050b1a]',
            cardBg: 'bg-[#0d1b3e]/95 border-2 border-[#38bdf8]/40 rounded-2xl shadow-[0_15px_40px_rgba(56,189,248,0.2)]',
            accentText: 'text-[#38bdf8]',
            accentBorder: 'border-[#38bdf8]/40',
            accentBg: 'bg-[#38bdf8]/15',
            buttonBg: 'bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#6366f1] text-white font-extrabold shadow-lg shadow-[#38bdf8]/30 hover:scale-105',
            badgeBg: 'bg-[#38bdf8] text-slate-950',
            iconColor: 'text-[#38bdf8]',
            heroTitleClass: 'font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-widest text-sky-100 uppercase',
            photoFrameClass: 'rounded-2xl border-2 border-[#38bdf8] shadow-2xl p-2 bg-[#0d1b3e] transform rotate-1 hover:rotate-0 transition'
        };
    } else if (tId === 'boho-terracotta') {
        return {
            id: 'boho-terracotta',
            name: 'Terracotta Rustic Warmth',
            bgClass: 'bg-[#1c0f0a] text-[#fbf4ee]',
            coverBg: 'bg-[#140a07]',
            cardBg: 'bg-[#291710]/95 border-2 border-[#d97706]/40 rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_rgba(217,119,6,0.18)]',
            accentText: 'text-[#f59e0b]',
            accentBorder: 'border-[#d97706]/40',
            accentBg: 'bg-[#d97706]/15',
            buttonBg: 'bg-gradient-to-r from-[#d97706] via-[#b45309] to-[#92400e] text-white font-extrabold shadow-lg shadow-[#d97706]/30 hover:scale-105',
            badgeBg: 'bg-[#d97706] text-white',
            iconColor: 'text-[#f59e0b]',
            heroTitleClass: 'font-serif text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-amber-100 italic',
            photoFrameClass: 'rounded-2xl border-4 border-[#d97706]/50 shadow-2xl p-2 bg-[#291710]'
        };
    } else if (tId === 'minimalist-monochrome') {
        return {
            id: 'minimalist-monochrome',
            name: 'Nordic Monochrome Minimalist',
            bgClass: 'bg-[#0a0a0a] text-[#f4f4f5]',
            coverBg: 'bg-[#000000]',
            cardBg: 'bg-[#18181b]/95 border border-[#3f3f46] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
            accentText: 'text-[#fafafa]',
            accentBorder: 'border-zinc-700',
            accentBg: 'bg-zinc-800/60',
            buttonBg: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-extrabold shadow-lg shadow-white/10 hover:scale-105',
            badgeBg: 'bg-zinc-100 text-zinc-950',
            iconColor: 'text-zinc-100',
            heroTitleClass: 'font-sans text-3xl sm:text-5xl md:text-7xl font-light tracking-[0.15em] sm:tracking-[0.2em] text-zinc-100 uppercase',
            photoFrameClass: 'rounded-none border border-zinc-500 shadow-2xl p-1 bg-zinc-900'
        };
    } else {
        // Default: midnight-gold
        return {
            id: 'midnight-gold',
            name: 'Midnight Serenade Gold',
            bgClass: 'bg-[#092219] text-[#f4efe6]',
            coverBg: 'bg-[#061811]',
            cardBg: 'bg-[#051711] border border-[#d4af37]/40 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
            accentText: 'text-[#d4af37]',
            accentBorder: 'border-[#d4af37]/40',
            accentBg: 'bg-[#d4af37]/10',
            buttonBg: 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c5a059] text-[#092219] font-extrabold shadow-lg shadow-[#d4af37]/20 hover:scale-105',
            badgeBg: 'bg-[#d4af37] text-black',
            iconColor: 'text-[#d4af37]',
            heroTitleClass: 'font-script text-5xl sm:text-6xl md:text-8xl font-normal tracking-wide text-white',
            photoFrameClass: 'rounded-full border-4 border-[#d4af37] p-1 bg-[#051711] shadow-2xl'
        };
    }
});

// Gallery Carousel & Gift Modal State
const activeGalleryIndex = ref(0);
const showBankModal = ref(true);

const allGalleryPhotos = computed(() => {
    if (customConfig.value?.gallery?.photos && customConfig.value.gallery.photos.length > 0) {
        return customConfig.value.gallery.photos;
    }
    return heroPhotos.value;
});

const nextGalleryPhoto = () => {
    activeGalleryIndex.value = (activeGalleryIndex.value + 1) % allGalleryPhotos.value.length;
};

const prevGalleryPhoto = () => {
    activeGalleryIndex.value = (activeGalleryIndex.value - 1 + allGalleryPhotos.value.length) % allGalleryPhotos.value.length;
};

// Countdown State
const countdown = reactive({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval = null;

const updateCountdown = () => {
    const rawDateStr = customConfig.value?.event?.date || '2026-08-24';
    const targetDate = new Date(rawDateStr + 'T08:00:00');
    const now = new Date();
    const diff = targetDate - now;

    if (diff > 0) {
        countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24));
        countdown.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        countdown.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        countdown.seconds = Math.floor((diff % (1000 * 60)) / 1000);
    } else {
        countdown.days = 0;
        countdown.hours = 0;
        countdown.minutes = 0;
        countdown.seconds = 0;
    }
};

// RSVP Form & Wishes List State
const rsvpForm = reactive({
    name: props.guestName || '',
    status: 'hadir',
    message: ''
});
const isSubmittingRSVP = ref(false);
const rsvpSubmitted = ref(false);

const wishesList = ref(props.wishes || [
    { name: 'Budi Santoso & Keluarga', text: 'Selamat! Semoga sakinah, mawaddah, warahmah.', status: 'Hadir', date: '2 jam lalu' },
    { name: 'Siti Rahmawati', text: 'Barakallahu lakuma wa baraka alaikuma. Sangat bahagia melihat momen ini!', status: 'Hadir', date: '4 jam lalu' },
    { name: 'Dion Amanda', text: 'Selamat ya! Nanti diusahakan banget bisa hadir.', status: 'Ragu-ragu', date: '6 jam lalu' }
]);

const submitRSVP = () => {
    if (!rsvpForm.name || !rsvpForm.message) return;
    isSubmittingRSVP.value = true;

    if (props.invitationSlug) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        fetch(`/v/${props.invitationSlug}/wishes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                name: rsvpForm.name,
                status: rsvpForm.status,
                message: rsvpForm.message
            })
        })
        .then(res => res.json())
        .then(data => {
            isSubmittingRSVP.value = false;
            if (data.success) {
                wishesList.value.unshift({
                    name: rsvpForm.name,
                    text: rsvpForm.message,
                    status: rsvpForm.status === 'hadir' ? 'Hadir' : rsvpForm.status === 'ragu' ? 'Ragu-ragu' : 'Tidak Hadir',
                    date: 'Baru saja'
                });
                rsvpSubmitted.value = true;
                rsvpForm.message = '';
                setTimeout(() => rsvpSubmitted.value = false, 4000);
            }
        })
        .catch(err => {
            console.error('Failed submitting wish:', err);
            isSubmittingRSVP.value = false;
        });
    } else {
        setTimeout(() => {
            isSubmittingRSVP.value = false;
            wishesList.value.unshift({
                name: rsvpForm.name,
                text: rsvpForm.message,
                status: rsvpForm.status === 'hadir' ? 'Hadir' : rsvpForm.status === 'ragu' ? 'Ragu-ragu' : 'Tidak Hadir',
                date: 'Baru saja'
            });
            rsvpSubmitted.value = true;
            rsvpForm.message = '';
            setTimeout(() => rsvpSubmitted.value = false, 4000);
        }, 600);
    }
};

// Copy Bank / QRIS Helper
const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    copiedBank.value = type;
    setTimeout(() => copiedBank.value = null, 2500);
};

// Smooth Scroll Helper
const scrollToSection = (id) => {
    activeTabNav.value = id;
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Open Envelope Cover
const openInvitation = () => {
    isOpen.value = true;
    const env = document.getElementById('envelope-cover');
    if (env) {
        gsap.to(env, {
            yPercent: -100,
            duration: 1.1,
            ease: 'power4.inOut',
            onComplete: () => {
                env.style.display = 'none';
                initGSAPAnimations();
            }
        });
    }
    if (audioRef.value) {
        audioRef.value.play().then(() => {
            isPlayingMusic.value = true;
        }).catch(err => {
            console.log('Autoplay audio prevented by browser interaction policy:', err);
        });
    }
};

const toggleMusic = () => {
    if (!audioRef.value) return;
    if (isPlayingMusic.value) {
        audioRef.value.pause();
        isPlayingMusic.value = false;
    } else {
        audioRef.value.play();
        isPlayingMusic.value = true;
    }
};

// GSAP ScrollTrigger Animations
const initGSAPAnimations = () => {
    nextTick(() => {
        gsap.utils.toArray('.gsap-fade-up').forEach(el => {
            gsap.fromTo(el, 
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        gsap.utils.toArray('.gsap-scale-up').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, scale: 0.92 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    });
};

// UNIQUE TEMPLATE PRESETS DICTIONARY (Each template catalog item has its OWN distinct content)
const templatePresets = {
    'midnight-gold': {
        templateId: 'midnight-gold',
        paletteId: 'gold',
        fontId: 'serif',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: {
            name: 'Raden Arya Wijaya, S.T.',
            nickname: 'Arya',
            father: 'Bpk. Hj. Suryo Wijaya',
            mother: 'Ibu Hj. Endang Rahayu',
            orderText: 'Putra pertama dari',
            instagram: '@aryawijaya',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
        },
        bride: {
            name: 'Putri Sekar Arum, S.Ked',
            nickname: 'Sekar',
            father: 'Bpk. Dr. H. Bambang Subroto',
            mother: 'Ibu Hj. Dewi Lestari',
            orderText: 'Putri kedua dari',
            instagram: '@sekararum',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        },
        quote: {
            customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...'
        },
        event: {
            date: '2026-08-24',
            akadTime: '08:00 WIB - 10:00 WIB',
            akadVenue: 'Masjid Agung Trans Studio',
            resepsiTime: '11:00 WIB - 14:00 WIB',
            venueName: 'Gedung Serbaguna Senayan',
            locationCity: 'Jakarta Pusat',
            address: 'Jl. Jend. Gatot Subroto No.1, Gelora, Tanah Abang, Jakarta Pusat',
            mapsUrl: 'https://maps.google.com'
        },
        loveStories: [
            { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan tidak sengaja saat kegiatan kampus di Universitas Indonesia.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
            { year: '2023', title: 'Momen Lamaran', description: 'Arya secara resmi melamar Sekar di hadapan kedua keluarga besar.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Hari Pernikahan', description: 'Awal dari babak baru perjalanan kehidupan suci kami.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: {
            photos: [
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
            ]
        },
        gift: {
            bankName1: 'Bank BCA',
            accountNo1: '8830192834',
            accountName1: 'Raden Arya Wijaya',
            shippingAddress: 'Jl. Wijaya Kusuma No. 45, Kebayoran Baru, Jakarta Selatan'
        },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80' }
    },

    'rose-romance': {
        templateId: 'rose-romance',
        paletteId: 'rose',
        fontId: 'script',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: {
            name: 'Dimas Prasetya, M.B.A.',
            nickname: 'Dimas',
            father: 'Bpk. Ir. Handoko Prasetya',
            mother: 'Ibu Hj. Ratna Sari',
            orderText: 'Putra kedua dari',
            instagram: '@dimaspras',
            photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'
        },
        bride: {
            name: 'Kiara Anindya, S.Psi',
            nickname: 'Kiara',
            father: 'Bpk. Prof. Dr. Suhartono',
            mother: 'Ibu Dra. Maya Indah',
            orderText: 'Putri tunggal dari',
            instagram: '@kiaraanindya',
            photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
        },
        quote: {
            customText: 'Cinta bukanlah tentang saling menatap satu sama lain, tetapi tentang bersama-sama melihat ke satu arah yang sama dalam kasih dan ketulusan.'
        },
        event: {
            date: '2026-09-15',
            akadTime: '09:00 WIB - 11:00 WIB',
            akadVenue: 'Bambini Garden Resto',
            resepsiTime: '12:00 WIB - 15:00 WIB',
            venueName: 'The Westin Ballroom Jakarta',
            locationCity: 'Jakarta Selatan',
            address: 'Jl. H.R. Rasuna Said Kav. C-22, Karet Kuningan, Jakarta Selatan',
            mapsUrl: 'https://maps.google.com'
        },
        loveStories: [
            { year: '2022', title: 'Tak Sanggup Berpaling', description: 'Pertama kali bertukar pandang di pameran seni rupa modern.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: '2024', title: 'Janji Kasih', description: 'Dimas mengutarakan niat suci melamar Kiara di tepi pantai Bali.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Resepsi Taman Bunga', description: 'Merayakan hari keabadian cinta berhiaskan indahnya ribuan bunga pastel.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: {
            photos: [
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
            ]
        },
        gift: {
            bankName1: 'Bank Mandiri',
            accountNo1: '1370009849201',
            accountName1: 'Kiara Anindya',
            shippingAddress: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan'
        },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1920&q=80' }
    },

    'emerald-botanical': {
        templateId: 'emerald-botanical',
        paletteId: 'emerald',
        fontId: 'sans',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: {
            name: 'Farhan Ramadhan, S.T.',
            nickname: 'Farhan',
            father: 'Bpk. Hj. Mansyur Ramadhan',
            mother: 'Ibu Hj. Rosita Farida',
            orderText: 'Putra bungsu dari',
            instagram: '@farhanrmd',
            photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
        },
        bride: {
            name: 'Nadia Salsabila, S.T.',
            nickname: 'Nadia',
            father: 'Bpk. Dr. Eng. Hermawan',
            mother: 'Ibu Hj. Yulia Anita',
            orderText: 'Putri pertama dari',
            instagram: '@nadiasalsa',
            photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
        },
        quote: {
            customText: 'Seperti dedaunan zamrud yang tumbuh rindang bersama, demikianlah cinta kami berakar dalam keharmonisan alam dan ketetapan-Nya.'
        },
        event: {
            date: '2026-10-18',
            akadTime: '08:30 WIB - 10:30 WIB',
            akadVenue: 'Hutan Kota by Plataran',
            resepsiTime: '11:30 WIB - 14:30 WIB',
            venueName: 'Plataran Senayan Glasshouse',
            locationCity: 'Jakarta Pusat',
            address: 'Kawasan GBK, Jl. Jend. Sudirman No. 54, Jakarta Pusat',
            mapsUrl: 'https://maps.google.com'
        },
        loveStories: [
            { year: '2020', title: 'Sahabat Teknik', description: 'Menyelesaikan tugas akhir arsitektur hijau bersama di perpustakaan.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
            { year: '2023', title: 'Komitmen Sejati', description: 'Memutuskan untuk melangkah ke jenjang yang lebih serious dalam ikatan dinas.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Pernikahan Botanical', description: 'Mengikat janji nikah di tengah sejuknya keasrian kaca dan pepohonan.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: {
            photos: [
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'
            ]
        },
        gift: {
            bankName1: 'Bank BNI',
            accountNo1: '0981237465',
            accountName1: 'Farhan Ramadhan',
            shippingAddress: 'Jl. Menteng Raya No. 12, Jakarta Pusat'
        },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1920&q=80' }
    },

    'royal-velvet': {
        templateId: 'royal-velvet',
        paletteId: 'sapphire',
        fontId: 'serif',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: {
            name: 'Bramantyo Satria, S.E.',
            nickname: 'Bram',
            father: 'Bpk. Mayjen (Purn) Satria',
            mother: 'Ibu Hj. Nindya Satria',
            orderText: 'Putra pertama dari',
            instagram: '@bramantyo',
            photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80'
        },
        bride: {
            name: 'Valensia Clarissa, B.A.',
            nickname: 'Valen',
            father: 'Bpk. Robertus Winata',
            mother: 'Ibu Angela Winata',
            orderText: 'Putri kedua dari',
            instagram: '@valensiaclarissa',
            photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
        },
        quote: {
            customText: 'Di bawah naungan kemegahan kasih dan ketetapan Takdir, kami menyatukan dua ikatan keluarga besar dalam keagungan pesta kerajaan cinta.'
        },
        event: {
            date: '2026-11-20',
            akadTime: '10:00 WIB - 12:00 WIB',
            akadVenue: 'Grand Hyatt Hotel Ballroom',
            resepsiTime: '18:30 WIB - 21:30 WIB',
            venueName: 'The Ritz-Carlton Pacific Place',
            locationCity: 'Jakarta Selatan',
            address: 'SCBD Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan',
            mapsUrl: 'https://maps.google.com'
        },
        loveStories: [
            { year: '2021', title: 'Royal Encounter', description: 'Pertemuan perdana dalam acara gala dinner diplomatik internasional.', bgImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80' },
            { year: '2024', title: 'Gala Engagement', description: 'Acara pertunangan megah berhias permata safir di Hotel Indonesia Kempinski.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Malam Mahkota Cinta', description: 'Resepsi royal bernuansa biru beludru dan perak kerajaan.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: {
            photos: [
                'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'
            ]
        },
        gift: {
            bankName1: 'Bank CIMB Niaga',
            accountNo1: '700192837465',
            accountName1: 'Bramantyo Satria',
            shippingAddress: 'Jl. Pondok Indah Utama No. 10, Jakarta Selatan'
        },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1920&q=80' }
    },

    'boho-terracotta': {
        templateId: 'boho-terracotta',
        paletteId: 'terracotta',
        fontId: 'serif',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: {
            name: 'Raka Alamsyah, S.Sn',
            nickname: 'Raka',
            father: 'Bpk. Gunawan Alamsyah',
            mother: 'Ibu Ratmi Alamsyah',
            orderText: 'Putra pertama dari',
            instagram: '@rakaalamsyah',
            photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'
        },
        bride: {
            name: 'Alya Maharani, S.Ds',
            nickname: 'Alya',
            father: 'Bpk. Mahfud Hendarto',
            mother: 'Ibu Endah Hendarto',
            orderText: 'Putri kedua dari',
            instagram: '@alyamaharani',
            photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
        },
        quote: {
            customText: 'Hangatnya warna terakota dan hembusan angin bohemian menjadi saksi bisu Janji Suci kita di bawah rimbunnya ilalang dan senja.'
        },
        event: {
            date: '2026-12-05',
            akadTime: '15:30 WIB - 17:00 WIB',
            akadVenue: 'Pine Hill Organic Farm',
            resepsiTime: '17:30 WIB - 21:00 WIB',
            venueName: 'Pine Hill Outdoor Lembang',
            locationCity: 'Bandung Barat',
            address: 'Jl. Maribaya No. 120, Lembang, Bandung Barat',
            mapsUrl: 'https://maps.google.com'
        },
        loveStories: [
            { year: '2022', title: 'Senja di Lembang', description: 'Pertama kali berdiskusi desain interior studio dengan nuansa rustic hangat.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
            { year: '2025', title: 'Lamaran Boho', description: 'Momen kejutan romantis di puncak bukit berhias pampas grass.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: '2026', title: 'Pernikahan Terracotta', description: 'Mengikat janji dalam hangatnya dekorasi kayu, tanah liat, dan cahaya lampu gantung.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: {
            photos: [
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80'
            ]
        },
        gift: {
            bankName1: 'Bank BCA',
            accountNo1: '5420192837',
            accountName1: 'Raka Alamsyah',
            shippingAddress: 'Jl. Dago Asri No. 45, Coblong, Bandung'
        },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80' }
    },

    'minimalist-monochrome': {
        templateId: 'minimalist-monochrome',
        paletteId: 'monochrome',
        fontId: 'sans',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: {
            name: 'Reza Mahendra, B.Arch',
            nickname: 'Reza',
            father: 'Bpk. Ir. Lukman Mahendra',
            mother: 'Ibu Sylvia Mahendra',
            orderText: 'Putra pertama dari',
            instagram: '@rezamahendra',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
        },
        bride: {
            name: 'Fiona Adeline, M.A.',
            nickname: 'Fiona',
            father: 'Bpk. Henry Adeline',
            mother: 'Ibu Clarissa Adeline',
            orderText: 'Putri pertama dari',
            instagram: '@fionaadeline',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        },
        quote: {
            customText: 'Simplicity is the ultimate sophistication. Dua jiwa, satu estetika minimalis modern dalam komitmen abadi tanpa batas waktu.'
        },
        event: {
            date: '2027-01-16',
            akadTime: '10:00 WIB - 12:00 WIB',
            akadVenue: 'Museum Macan Gallery Space',
            resepsiTime: '18:00 WIB - 21:00 WIB',
            venueName: 'Alila SCBD Event Gallery',
            locationCity: 'Jakarta Selatan',
            address: 'SCBD Lot 11, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan',
            mapsUrl: 'https://maps.google.com'
        },
        loveStories: [
            { year: '2022', title: 'Studio Architecture', description: 'Kolaborasi pameran seni kontemporer hitam putih di Tokyo.', bgImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80' },
            { year: '2025', title: 'Nordic Engagement', description: 'Pertunangan hangat di tengah arsitektur minimalis Stockholm.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
            { year: '2027', title: 'Monochrome Union', description: 'Resepsi pernikahan kontemporer berkonsep hitam dan putih elegan.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: {
            photos: [
                'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
            ]
        },
        gift: {
            bankName1: 'Bank BCA',
            accountNo1: '0019283746',
            accountName1: 'Reza Mahendra',
            shippingAddress: 'Jl. Gunawarman No. 22, Kebayoran Baru, Jakarta Selatan'
        },
        background: { useImage: true, imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1920&q=80' }
    }
};

onMounted(() => {
    let routeTemplate = props.templateSlug;
    let invitationId = props.invitationId;
    const pathSegments = window.location.pathname.split('/');
    if (!routeTemplate && pathSegments.length >= 4 && pathSegments[1] === 'demo' && pathSegments[2] === 'invitation') {
        routeTemplate = pathSegments[3];
    } else if (!routeTemplate && pathSegments.length >= 3) {
        routeTemplate = pathSegments[2];
    }

    if (routeTemplate && templateMap[routeTemplate]) {
        routeTemplate = templateMap[routeTemplate];
    }

    let loadedConfig = null;

    // 1. If backend explicitly provided customData for a specific User Invitation
    if (props.customData) {
        loadedConfig = props.customData;
    }
    // 2. If invitationId exists, check invitation specific localStorage
    else if (invitationId && localStorage.getItem(`customer_invitation_${invitationId}`)) {
        try {
            loadedConfig = JSON.parse(localStorage.getItem(`customer_invitation_${invitationId}`));
        } catch (e) { console.error(e); }
    }
    // 3. If template_config_ exists for this specific template
    else if (routeTemplate && localStorage.getItem(`template_config_${routeTemplate}`)) {
        try {
            loadedConfig = JSON.parse(localStorage.getItem(`template_config_${routeTemplate}`));
        } catch (e) { console.error(e); }
    }

    // 4. Default Fallback: Use the SPECIFIC preset for this template slug, so each template has its own unique content!
    if (!loadedConfig) {
        const key = routeTemplate || 'midnight-gold';
        const preset = templatePresets[key] || templatePresets['midnight-gold'];
        loadedConfig = JSON.parse(JSON.stringify(preset));
    }

    customConfig.value = loadedConfig;

    if (customConfig.value && routeTemplate) {
        customConfig.value.templateId = routeTemplate;
    }

    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
    heroSlideTimer = setInterval(nextHeroSlide, 3500);
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    ScrollTrigger.getAll().forEach(t => t.kill());
});
</script>

<template>
    <Head :title="`Undangan Pernikahan (${templateStyle.name}) - ${customConfig?.groom?.nickname || 'Arya'} & ${customConfig?.bride?.nickname || 'Sekar'}`" />

    <audio ref="audioRef" loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113064.mp3" type="audio/mpeg" />
    </audio>

    <div :class="[templateStyle.bgClass, {'h-screen overflow-hidden': !isOpen}]" class="font-sans min-h-screen relative overflow-x-hidden transition-colors duration-700">
        
        <div v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.background?.useImage !== false)" class="parallax-bg fixed -inset-x-0 -top-[15vh] h-[135vh] w-full bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none z-0 filter brightness-90 saturate-125 transition duration-700" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80'})` }"></div>
        <div v-if="activeTemplateId === 'midnight-gold'" class="fixed inset-0 bg-gradient-to-b from-[#061811]/90 via-[#061811]/75 to-[#092219]/95 z-0 pointer-events-none"></div>

        <!-- ENVELOPE COVER (FULLY RESPONSIVE) -->
        <div id="envelope-cover" class="fixed inset-0 z-50 flex flex-col justify-between items-center px-4 sm:px-6 py-8 sm:py-10 md:py-14 text-center shadow-2xl overflow-y-auto bg-slate-100">
            <!-- Full Height Background Image -->
            <img :src="customConfig?.background?.imageUrl || customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'" 
                 class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.97] contrast-[1.02] transition duration-700" />

            <!-- Soft Top & Bottom Vignette Overlay -->
            <div class="absolute inset-0 bg-gradient-to-b from-slate-200/80 via-transparent to-slate-900/65 pointer-events-none"></div>

            <!-- TOP SECTION: Wedding Invitation Header -->
            <div class="relative z-10 pt-2 sm:pt-4 md:pt-8 space-y-2 sm:space-y-3 max-w-lg mx-auto w-full">
                <p class="font-serif text-[#3f4b59] text-xl sm:text-2xl md:text-3xl font-normal tracking-wide drop-shadow-sm">Wedding Invitation</p>
                
                <h1 class="font-serif text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#2b3545] tracking-[0.06em] sm:tracking-[0.08em] uppercase leading-tight sm:leading-[1.12] drop-shadow break-words px-2">
                    {{ customConfig?.groom?.nickname || 'GROOM' }} &amp;<br />
                    {{ customConfig?.bride?.nickname || 'BRIDE' }}
                </h1>

                <p class="font-sans text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#2b3545] uppercase pt-1">
                    {{ customConfig?.event?.date ? customConfig.event.date.toUpperCase() : 'SABTU, 30 JANUARI 2027' }}
                </p>
            </div>

            <!-- BOTTOM SECTION: Recipient & Open Button -->
            <div class="relative z-10 pb-2 sm:pb-4 md:pb-8 space-y-3 max-w-sm mx-auto w-full flex flex-col items-center">
                <div class="text-center text-[#2b3545] drop-shadow-sm px-2">
                    <p class="font-serif italic text-xs sm:text-sm md:text-base font-semibold text-[#3b4756] mb-0.5">Dear,</p>
                    <h3 class="font-serif text-lg sm:text-xl md:text-3xl font-bold text-[#1f2834] tracking-wide break-words">
                        {{ props.guestName || 'Tamu Undangan' }}
                    </h3>
                </div>

                <button @click="openInvitation" class="mt-2 sm:mt-3 bg-[#2c3746] hover:bg-[#1b232e] active:scale-95 text-white font-medium text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-2xl transition duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-white/20">
                    <Mail class="w-4 h-4 text-white" />
                    <span class="tracking-wide">Open Invitation</span>
                </button>
            </div>
        </div>

        <!-- FLOATING MUSIC CONTROLLER -->
        <button v-if="isOpen && (!customConfig || customConfig.components?.music !== false)" @click="toggleMusic" 
                :class="activeTemplateId === 'midnight-gold' ? 'bg-[#2c3746] border-white/20 text-white' : templateStyle.accentBorder + ' bg-black/80 text-white'" 
                class="fixed top-4 right-4 sm:top-6 sm:right-6 z-40 backdrop-blur border p-2.5 sm:p-3 rounded-full shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center">
            <div :class="[activeTemplateId === 'midnight-gold' ? 'text-amber-300' : templateStyle.accentText, {'animate-spin': isPlayingMusic}]" style="animation-duration: 4s;">
                <Volume2 v-if="isPlayingMusic" class="w-4 h-4 sm:w-5 sm:h-5" />
                <VolumeX v-else class="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
            </div>
        </button>

        <!-- FLOATING MOBILE BOTTOM NAVIGATION DOCK -->
        <div v-if="isOpen" class="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 flex justify-center px-3 sm:px-4">
            <div :class="activeTemplateId === 'midnight-gold' ? 'bg-[#2c3746]/95 border-white/20' : templateStyle.accentBorder + ' bg-black/90'" 
                 class="backdrop-blur-xl border rounded-full px-4 sm:px-6 py-2 sm:py-2.5 shadow-2xl flex items-center space-x-3 sm:space-x-6 text-white max-w-full overflow-x-auto scrollbar-none">
                <button @click="scrollToSection('hero')" :class="{'text-amber-300 font-bold': activeTabNav === 'hero'}" class="hover:text-amber-200 transition flex flex-col items-center shrink-0">
                    <Sparkles class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span class="text-[8px] sm:text-[9px] font-bold mt-0.5 uppercase tracking-wider">Home</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.mempelai !== false" @click="scrollToSection('mempelai')" :class="{'text-amber-400': activeTabNav === 'mempelai'}" class="hover:text-amber-300 transition flex flex-col items-center shrink-0">
                    <Heart class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span class="text-[8px] sm:text-[9px] font-bold mt-0.5 uppercase tracking-wider">Mempelai</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.acara !== false" @click="scrollToSection('acara')" :class="{'text-amber-400': activeTabNav === 'acara'}" class="hover:text-amber-300 transition flex flex-col items-center shrink-0">
                    <Calendar class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span class="text-[8px] sm:text-[9px] font-bold mt-0.5 uppercase tracking-wider">Acara</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.gallery !== false" @click="scrollToSection('galeri')" :class="{'text-amber-400': activeTabNav === 'galeri'}" class="hover:text-amber-300 transition flex flex-col items-center shrink-0">
                    <ImageIcon class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span class="text-[8px] sm:text-[9px] font-bold mt-0.5 uppercase tracking-wider">Galeri</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.rsvp !== false" @click="scrollToSection('rsvp')" :class="{'text-amber-400': activeTabNav === 'rsvp'}" class="hover:text-amber-300 transition flex flex-col items-center shrink-0">
                    <MessageSquare class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span class="text-[8px] sm:text-[9px] font-bold mt-0.5 uppercase tracking-wider">RSVP</span>
                </button>
            </div>
        </div>

        <!-- MAIN HERO SECTION FOR TEMPLATE 1 (midnight-gold) -->
        <section v-if="activeTemplateId === 'midnight-gold'" id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-12 overflow-hidden bg-[#f7f5f0]">
            <!-- Leaf Shadow Motif Overlay -->
            <div class="absolute -top-10 -left-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 opacity-20 pointer-events-none mix-blend-multiply bg-contain bg-no-repeat bg-left-top" style="background-image: url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80')"></div>

            <div class="max-w-xl w-full mx-auto relative z-10 pt-6 sm:pt-8 pb-10 sm:pb-12">
                <!-- Subheader Script -->
                <p class="font-script text-3xl sm:text-4xl md:text-6xl text-[#2c3746] font-normal mb-2 sm:mb-3">Menuju Hari Bahagia</p>

                <!-- Compact Countdown Line -->
                <div class="flex justify-center items-center space-x-3 sm:space-x-6 text-[#2c3746] mb-6 sm:mb-8 font-sans">
                    <div class="text-center min-w-[50px] sm:min-w-[60px]">
                        <div class="text-lg sm:text-xl md:text-2xl font-bold leading-none">{{ countdown.days }}</div>
                        <div class="text-[10px] sm:text-[11px] font-medium text-[#4a5668] mt-1">Hari</div>
                    </div>
                    <div class="text-center min-w-[50px] sm:min-w-[60px]">
                        <div class="text-lg sm:text-xl md:text-2xl font-bold leading-none">{{ countdown.hours }}</div>
                        <div class="text-[10px] sm:text-[11px] font-medium text-[#4a5668] mt-1">Jam</div>
                    </div>
                    <div class="text-center min-w-[50px] sm:min-w-[60px]">
                        <div class="text-lg sm:text-xl md:text-2xl font-bold leading-none">{{ countdown.minutes }}</div>
                        <div class="text-[10px] sm:text-[11px] font-medium text-[#4a5668] mt-1">Menit</div>
                    </div>
                    <div class="text-center min-w-[50px] sm:min-w-[60px]">
                        <div class="text-lg sm:text-xl md:text-2xl font-bold leading-none">{{ countdown.seconds }}</div>
                        <div class="text-[10px] sm:text-[11px] font-medium text-[#4a5668] mt-1">Detik</div>
                    </div>
                </div>

                <!-- Center Landscape Photo Box -->
                <div class="w-full max-w-[280px] sm:max-w-md mx-auto aspect-[4/3] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-[#2c3746] shadow-2xl overflow-hidden mb-6 sm:mb-8 bg-slate-200">
                    <img :src="customConfig?.background?.imageUrl || customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'" 
                         class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                </div>

                <h1 class="font-serif text-2xl sm:text-3xl md:text-5xl font-black text-[#2c3746] tracking-[0.06em] sm:tracking-[0.08em] uppercase mb-3 sm:mb-4 drop-shadow-sm break-words">
                    {{ customConfig?.groom?.nickname || 'ARYA' }} &amp; {{ customConfig?.bride?.nickname || 'SEKAR' }}
                </h1>

                <p class="text-xs md:text-sm text-[#4a5668] max-w-md mx-auto leading-relaxed font-sans px-2 sm:px-4">
                    {{ customConfig?.quote?.customText || 'Dan mereka keduanya akan menjadi satu daging, jadi mereka tidak lagi menjadi dua orang, melainkan satu.' }}
                </p>
            </div>
        </section>

        <!-- HERO SECTION FOR OTHER TEMPLATES -->
        <section v-else id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-4 sm:p-6 overflow-hidden">
            <div v-if="!customConfig || customConfig.background?.useImage !== false" class="absolute inset-0 bg-cover bg-center bg-fixed opacity-30 mix-blend-overlay pointer-events-none" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80'})` }"></div>

            <div class="hero-content max-w-3xl relative z-10 space-y-4 sm:space-y-6 pt-8 sm:pt-12">
                <div :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border text-[10px] sm:text-xs font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase">
                    {{ templateStyle.name }}
                </div>
                
                <h1 :class="templateStyle.heroTitleClass" class="leading-tight break-words">
                    {{ customConfig?.groom?.nickname || 'Mempelai Pria' }} <br />
                    <span :class="templateStyle.accentText" class="font-serif italic text-3xl sm:text-4xl md:text-6xl font-normal">&amp;</span> <br />
                    {{ customConfig?.bride?.nickname || 'Mempelai Wanita' }}
                </h1>

                <p class="text-xs sm:text-sm md:text-base text-gray-300 font-light max-w-md mx-auto leading-relaxed px-2">
                    Kami mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada hari kebahagiaan kami.
                </p>

                <div v-if="activeTemplateId === 'rose-romance'" class="relative w-full max-w-[240px] sm:max-w-xs md:max-w-sm mx-auto h-60 sm:h-72 md:h-80 rounded-t-[100px] sm:rounded-t-[140px] rounded-b-[30px] sm:rounded-b-[40px] overflow-hidden border-4 border-[#f472b6]/50 shadow-[0_15px_40px_rgba(244,114,182,0.35)] my-4 sm:my-6 group">
                    <div v-for="(photo, idx) in heroPhotos" :key="idx" 
                         :class="['absolute inset-0 transition-opacity duration-1000 ease-in-out', heroSlideIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0']">
                        <img :src="photo" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#1f1318] via-transparent to-transparent opacity-60"></div>
                    </div>
                    
                    <button @click="prevHeroSlide" class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#f472b6] text-white p-1.5 sm:p-2 rounded-full backdrop-blur-md transition shadow-lg">
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button @click="nextHeroSlide" class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#f472b6] text-white p-1.5 sm:p-2 rounded-full backdrop-blur-md transition shadow-lg">
                        <ChevronRight class="w-4 h-4" />
                    </button>
                    
                    <div class="absolute bottom-3 inset-x-0 z-20 flex justify-center space-x-1.5">
                        <span v-for="(p, idx) in heroPhotos" :key="idx" @click="heroSlideIndex = idx"
                              :class="['h-2 rounded-full transition-all duration-300 cursor-pointer shadow', heroSlideIndex === idx ? 'w-6 bg-[#f472b6]' : 'w-2 bg-white/60']"></span>
                    </div>
                </div>

                <div class="pt-2 sm:pt-4">
                    <div :class="templateStyle.accentBorder" class="inline-flex items-center space-x-2 sm:space-x-3 bg-black/60 border px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-xl backdrop-blur-md text-xs sm:text-sm">
                        <Calendar :class="templateStyle.iconColor" class="w-4 h-4 sm:w-5 sm:h-5" />
                        <span class="font-bold tracking-widest uppercase text-white">
                            {{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- AYAT SECTION FOR TEMPLATE 1 -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.quote !== false)" id="ayat" class="py-16 sm:py-20 px-4 sm:px-6 text-center relative bg-[#f7f5f0] border-t border-b border-[#2c3746]/15">
            <div class="max-w-3xl mx-auto gsap-fade-up">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2c3746]/10 border border-[#2c3746]/30 flex items-center justify-center mx-auto mb-4 sm:mb-5 text-[#2c3746]">
                    <Heart class="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#2c3746]" />
                </div>
                
                <p class="font-serif italic text-base sm:text-lg md:text-2xl text-[#2c3746] leading-relaxed mb-4 sm:mb-5 font-normal px-2">
                    "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...' }}"
                </p>
                <p class="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.25em] text-[#4a5668] uppercase">KUTIPAN &amp; AYAT SUCI</p>
            </div>
        </section>

        <!-- AYAT SECTION FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.quote !== false" id="ayat" class="py-16 sm:py-24 px-4 sm:px-6 text-center relative border-t border-b border-white/10">
            <div class="max-w-3xl mx-auto gsap-fade-up">
                <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center mx-auto mb-5 sm:mb-6">
                    <Heart :class="templateStyle.iconColor" class="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                </div>
                
                <p class="font-serif italic text-base sm:text-lg md:text-2xl text-white leading-relaxed mb-5 sm:mb-6 px-2">
                    "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...' }}"
                </p>
                <p :class="templateStyle.accentText" class="text-xs font-extrabold tracking-widest uppercase">KUTIPAN &amp; AYAT SUCI</p>
            </div>
        </section>

        <!-- MEMPELAI SECTION FOR TEMPLATE 1 -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.mempelai !== false)" id="mempelai" class="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#f7f5f0]">
            <div class="max-w-3xl mx-auto text-center">
                <div class="mb-10 sm:mb-14 gsap-fade-up">
                    <h2 class="font-script text-4xl sm:text-5xl md:text-6xl text-[#2c3746] font-normal">Bride and Groom</h2>
                </div>

                <div class="space-y-12 sm:space-y-20">
                    
                    <!-- Mempelai Wanita -->
                    <div class="gsap-scale-up text-center max-w-md mx-auto">
                        <div class="w-full max-w-[240px] sm:max-w-xs md:max-w-sm mx-auto aspect-[3/4] border-2 sm:border-4 border-[#2c3746] shadow-xl overflow-hidden mb-4 sm:mb-5 bg-slate-200">
                            <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'" 
                                 class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                        </div>

                        <h3 class="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#2c3746] mb-2 px-2">
                            {{ customConfig?.bride?.name || 'Amanda Putri' }}
                        </h3>
                        
                        <div class="mb-3">
                            <a :href="`https://instagram.com/${(customConfig?.bride?.instagram || 'amandaput').replace('@','')}`" target="_blank" class="inline-flex items-center space-x-2 bg-[#2c3746] hover:bg-[#1b232e] text-white text-xs font-medium px-4 py-2 rounded-md shadow transition">
                                <Eye class="w-3.5 h-3.5" />
                                <span>{{ customConfig?.bride?.instagram || '@amandaput' }}</span>
                            </a>
                        </div>

                        <div class="flex items-center justify-center space-x-3 my-3 max-w-xs mx-auto text-[#2c3746]">
                            <div class="h-0.5 w-8 sm:w-12 bg-[#2c3746]/60"></div>
                            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{{ customConfig?.bride?.orderText || 'Putri Pertama dari' }}</span>
                            <div class="h-0.5 w-8 sm:w-12 bg-[#2c3746]/60"></div>
                        </div>

                        <p class="text-xs sm:text-sm md:text-base text-[#4a5668] leading-relaxed max-w-xs mx-auto font-normal px-2">
                            {{ customConfig?.bride?.father || 'Bapak Iwan Susanto' }} dan {{ customConfig?.bride?.mother || 'Ibu Ani Wulandari' }}
                        </p>
                    </div>

                    <!-- Mempelai Pria -->
                    <div class="gsap-scale-up text-center max-w-md mx-auto">
                        <div class="w-full max-w-[240px] sm:max-w-xs md:max-w-sm mx-auto aspect-[3/4] border-2 sm:border-4 border-[#2c3746] shadow-xl overflow-hidden mb-4 sm:mb-5 bg-slate-200">
                            <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'" 
                                 class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                        </div>

                        <h3 class="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#2c3746] mb-2 px-2">
                            {{ customConfig?.groom?.name || 'Aditya Kusuma' }}
                        </h3>
                        
                        <div class="mb-3">
                            <a :href="`https://instagram.com/${(customConfig?.groom?.instagram || 'adityakusuma').replace('@','')}`" target="_blank" class="inline-flex items-center space-x-2 bg-[#2c3746] hover:bg-[#1b232e] text-white text-xs font-medium px-4 py-2 rounded-md shadow transition">
                                <Eye class="w-3.5 h-3.5" />
                                <span>{{ customConfig?.groom?.instagram || '@adityakusuma' }}</span>
                            </a>
                        </div>

                        <div class="flex items-center justify-center space-x-3 my-3 max-w-xs mx-auto text-[#2c3746]">
                            <div class="h-0.5 w-8 sm:w-12 bg-[#2c3746]/60"></div>
                            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">{{ customConfig?.groom?.orderText || 'Putra Pertama dari' }}</span>
                            <div class="h-0.5 w-8 sm:w-12 bg-[#2c3746]/60"></div>
                        </div>

                        <p class="text-xs sm:text-sm md:text-base text-[#4a5668] leading-relaxed max-w-xs mx-auto font-normal px-2">
                            {{ customConfig?.groom?.father || 'Bapak Hendra Wijaya' }} dan {{ customConfig?.groom?.mother || 'Ibu Ratna Wijaya' }}
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <!-- MEMPELAI SECTION FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.mempelai !== false" id="mempelai" class="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-12 sm:mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">PASANGAN MEMPELAI</span>
                    <h2 class="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-2">Mempelai Pria &amp; Wanita</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
                    
                    <!-- Mempelai Pria Card -->
                    <div :class="templateStyle.cardBg" class="gsap-scale-up text-center relative overflow-hidden group hover:-translate-y-2 transition duration-500 flex flex-col p-0 border shadow-2xl">
                        <div class="w-full h-64 sm:h-80 md:h-[380px] relative overflow-hidden">
                            <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                            <div class="absolute bottom-4 inset-x-0 text-center">
                                <span :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-widest uppercase shadow">
                                    MEMPELAI PRIA
                                </span>
                            </div>
                        </div>

                        <div class="p-5 sm:p-6 md:p-8 space-y-3">
                            <h3 class="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{{ customConfig?.groom?.name || 'Mempelai Pria, S.T.' }}</h3>
                            
                            <p class="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
                                {{ customConfig?.groom?.orderText || 'Putra pertama dari' }} <br />
                                <strong class="text-white">{{ customConfig?.groom?.father || 'Bpk. Ayah Mempelai' }}</strong> <br />
                                &amp; <strong class="text-white">{{ customConfig?.groom?.mother || 'Ibu Ibu Mempelai' }}</strong>
                            </p>

                            <div class="pt-2">
                                <a href="#" :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="inline-flex items-center space-x-2 text-xs font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border hover:scale-105 transition shadow">
                                    <span>{{ customConfig?.groom?.instagram || '@instagram' }}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Mempelai Wanita Card -->
                    <div :class="templateStyle.cardBg" class="gsap-scale-up text-center relative overflow-hidden group hover:-translate-y-2 transition duration-500 flex flex-col p-0 border shadow-2xl">
                        <div class="w-full h-64 sm:h-80 md:h-[380px] relative overflow-hidden">
                            <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                            <div class="absolute bottom-4 inset-x-0 text-center">
                                <span :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-widest uppercase shadow">
                                    MEMPELAI WANITA
                                </span>
                            </div>
                        </div>

                        <div class="p-5 sm:p-6 md:p-8 space-y-3">
                            <h3 class="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{{ customConfig?.bride?.name || 'Mempelai Wanita, S.Ked' }}</h3>
                            
                            <p class="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
                                {{ customConfig?.bride?.orderText || 'Putri kedua dari' }} <br />
                                <strong class="text-white">{{ customConfig?.bride?.father || 'Bpk. Ayah Mempelai' }}</strong> <br />
                                &amp; <strong class="text-white">{{ customConfig?.bride?.mother || 'Ibu Ibu Mempelai' }}</strong>
                            </p>

                            <div class="pt-2">
                                <a href="#" :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="inline-flex items-center space-x-2 text-xs font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border hover:scale-105 transition shadow">
                                    <span>{{ customConfig?.bride?.instagram || '@instagram' }}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ACARA SECTION FOR TEMPLATE 1 -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.acara !== false)" id="acara" class="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#f7f5f0]">
            <div class="max-w-3xl mx-auto">
                <div class="text-center mb-10 sm:mb-16 gsap-fade-up">
                    <h2 class="font-script text-4xl sm:text-5xl md:text-6xl text-[#2c3746] font-normal">Wedding Ceremonial</h2>
                </div>

                <div class="space-y-12 sm:space-y-16">
                    
                    <!-- Holy Matrimony -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center gsap-scale-up">
                        <div class="flex justify-center md:justify-end">
                            <div class="w-40 sm:w-48 md:w-56 aspect-[3/4] rounded-tl-[80px] sm:rounded-tl-[120px] rounded-br-[20px] overflow-hidden shadow-2xl bg-slate-200 border-2 border-white">
                                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover filter brightness-[0.98]" />
                            </div>
                        </div>

                        <div class="text-center md:text-left space-y-2 sm:space-y-3">
                            <h3 class="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#2c3746] uppercase tracking-wider">HOLY MATRIMONY</h3>
                            
                            <div class="flex items-center justify-center md:justify-start space-x-3 sm:space-x-4 text-[#2c3746] font-sans py-1 sm:py-2">
                                <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">SABTU</span>
                                <div class="h-7 sm:h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <div class="text-center leading-tight">
                                    <div class="text-lg sm:text-xl md:text-2xl font-bold">30</div>
                                    <div class="text-[9px] sm:text-[10px] font-bold uppercase">JAN</div>
                                </div>
                                <div class="h-7 sm:h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">2027</span>
                            </div>

                            <p class="text-xs sm:text-sm font-bold text-[#2c3746] uppercase tracking-wider">
                                {{ customConfig?.event?.akadTime || '08.00 WIB - SELESAI' }}
                            </p>
                        </div>
                    </div>

                    <!-- Reception -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center gsap-scale-up">
                        <div class="text-center md:text-right space-y-2 sm:space-y-3 order-2 md:order-1">
                            <h3 class="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#2c3746] uppercase tracking-wider">RECEPTION</h3>
                            
                            <div class="flex items-center justify-center md:justify-end space-x-3 sm:space-x-4 text-[#2c3746] font-sans py-1 sm:py-2">
                                <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">SABTU</span>
                                <div class="h-7 sm:h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <div class="text-center leading-tight">
                                    <div class="text-lg sm:text-xl md:text-2xl font-bold">30</div>
                                    <div class="text-[9px] sm:text-[10px] font-bold uppercase">JAN</div>
                                </div>
                                <div class="h-7 sm:h-9 w-[1.5px] bg-[#2c3746]"></div>
                                <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">2027</span>
                            </div>

                            <p class="text-xs sm:text-sm font-bold text-[#2c3746] uppercase tracking-wider">
                                {{ customConfig?.event?.resepsiTime || '11.00 - 14.00 WIB' }}
                            </p>
                        </div>

                        <div class="flex justify-center md:justify-start order-1 md:order-2">
                            <div class="w-40 sm:w-48 md:w-56 aspect-[3/4] rounded-tr-[80px] sm:rounded-tr-[120px] rounded-bl-[20px] overflow-hidden shadow-2xl bg-slate-200 border-2 border-white">
                                <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover filter brightness-[0.98]" />
                            </div>
                        </div>
                    </div>

                    <!-- Venue Name & Full Address Section -->
                    <div class="text-center pt-6 sm:pt-8 space-y-3 gsap-fade-up">
                        <h3 class="font-serif text-lg sm:text-xl md:text-3xl font-extrabold text-[#2c3746] uppercase tracking-wider max-w-lg mx-auto leading-snug px-2">
                            {{ customConfig?.event?.venueName || customConfig?.event?.akadVenue || 'GEDUNG SASANA MANGGALA SUKOWATI SRAGEN' }}
                        </h3>

                        <p class="text-xs md:text-sm text-[#4a5668] max-w-md mx-auto leading-relaxed font-normal px-2">
                            {{ customConfig?.event?.address || 'Jl. Dr. Sutomo, Sine, Sragen Kulon, Kec. Sragen, Kabupaten Sragen' }}
                        </p>

                        <div class="pt-2 sm:pt-4">
                            <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="inline-flex items-center space-x-2 bg-[#2c3746] hover:bg-[#1b232e] text-white text-xs font-medium px-5 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-lg transition">
                                <Compass class="w-4 h-4 text-white" />
                                <span>Petunjuk Lokasi Google Maps</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ACARA SECTION FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.acara !== false" id="acara" class="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-12 sm:mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">JADWAL PERNIKAHAN</span>
                    <h2 class="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-2">Rangkaian Acara</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    <!-- Akad Nikah -->
                    <div :class="templateStyle.cardBg" class="gsap-scale-up p-6 sm:p-8 flex flex-col justify-between text-center relative overflow-hidden group hover:scale-[1.02] transition duration-500">
                        <div>
                            <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center mx-auto mb-5 sm:mb-6">
                                <Sparkles :class="templateStyle.iconColor" class="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <h3 class="font-serif text-xl sm:text-2xl font-bold text-white mb-2">Akad Nikah</h3>
                            <p :class="templateStyle.accentText" class="text-xs font-extrabold tracking-wider uppercase mb-5 sm:mb-6">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</p>

                            <div class="space-y-3 text-xs text-gray-300 mb-6 sm:mb-8">
                                <p class="flex items-center justify-center space-x-2">
                                    <Clock :class="templateStyle.iconColor" class="w-4 h-4" />
                                    <span>{{ customConfig?.event?.akadTime || 'Pukul 08.00 WIB - 10.00 WIB' }}</span>
                                </p>
                                <p class="flex items-start justify-center space-x-2">
                                    <MapPin :class="templateStyle.iconColor" class="w-4 h-4 shrink-0 mt-0.5" />
                                    <span class="text-left">
                                        <strong class="text-white block">{{ customConfig?.event?.akadVenue || 'Tempat Akad Nikah' }}</strong>
                                        <span class="text-[11px] text-slate-300 block mt-0.5">{{ customConfig?.event?.address || 'Alamat Lokasi Akad' }}</span>
                                    </span>
                                </p>
                            </div>
                        </div>

                        <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="w-full border font-bold text-xs py-3 rounded-xl hover:scale-105 transition flex items-center justify-center space-x-2">
                            <Compass class="w-4 h-4" />
                            <span>Petunjuk Lokasi Google Maps</span>
                        </a>
                    </div>

                    <!-- Resepsi -->
                    <div :class="templateStyle.cardBg" class="gsap-scale-up p-6 sm:p-8 flex flex-col justify-between text-center relative overflow-hidden group hover:scale-[1.02] transition duration-500">
                        <div>
                            <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex items-center justify-center mx-auto mb-5 sm:mb-6">
                                <Heart :class="templateStyle.iconColor" class="w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <h3 class="font-serif text-xl sm:text-2xl font-bold text-white mb-2">Resepsi Pernikahan</h3>
                            <p :class="templateStyle.accentText" class="text-xs font-extrabold tracking-wider uppercase mb-5 sm:mb-6">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</p>

                            <div class="space-y-3 text-xs text-gray-300 mb-6 sm:mb-8">
                                <p class="flex items-center justify-center space-x-2">
                                    <Clock :class="templateStyle.iconColor" class="w-4 h-4" />
                                    <span>{{ customConfig?.event?.resepsiTime || 'Pukul 11.00 - 14.00 WIB' }}</span>
                                </p>
                                <p class="flex items-start justify-center space-x-2">
                                    <MapPin :class="templateStyle.iconColor" class="w-4 h-4 shrink-0 mt-0.5" />
                                    <span class="text-left">
                                        <strong class="text-white block">{{ customConfig?.event?.venueName || 'Gedung Resepsi' }}</strong>
                                        <span class="text-[11px] text-slate-300 block mt-0.5">{{ customConfig?.event?.address || 'Alamat Lokasi Resepsi' }}</span>
                                    </span>
                                </p>
                            </div>
                        </div>

                        <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="w-full border font-bold text-xs py-3 rounded-xl hover:scale-105 transition flex items-center justify-center space-x-2">
                            <Compass class="w-4 h-4" />
                            <span>Petunjuk Lokasi Google Maps</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- LOVE STORY FOR TEMPLATE 1 -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.story !== false)" id="story" class="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#f7f5f0]">
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.92] contrast-[1.02] pointer-events-none transition-all duration-700 opacity-40 mix-blend-multiply" 
                 :style="{ backgroundImage: `url('${customConfig?.loveStories?.[0]?.bgImage || heroPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#f7f5f0]/90 via-[#f7f5f0]/80 to-[#f7f5f0]/95 pointer-events-none"></div>

            <div class="max-w-xl mx-auto text-center relative z-10">
                <div class="w-full max-w-lg mx-auto aspect-[16/9] rounded-xl sm:rounded-2xl border-2 sm:border-4 border-[#2c3746] shadow-2xl overflow-hidden mb-8 sm:mb-12 relative bg-slate-200 group hover:scale-[1.01] transition duration-500 gsap-scale-up">
                    <img :src="customConfig?.loveStories?.[0]?.bgImage || heroPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'" 
                         class="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 transition-transform duration-700" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40 flex items-center justify-center">
                        <h2 class="font-script text-4xl sm:text-5xl md:text-7xl text-white font-normal drop-shadow-lg tracking-wide">Our love Journey</h2>
                    </div>
                </div>

                <div class="space-y-8 sm:space-y-10 max-w-lg mx-auto">
                    <div v-for="(story, idx) in (customConfig?.loveStories || [
                        { year: '2020', title: 'Awal Bertemu', description: '2020 Kami bertemu di sebuah acara kampus. Meski hanya singkat, kami merasa saling tertarik dan saling ingin mengenal lebih lanjut satu sama lain.' },
                        { year: '2022', title: 'Menjalin Kasih', description: '2022 Kami mulai berkencan dan membangun komitmen bersama untuk saling mendukung dalam suka dan duka.' },
                        { year: '2026', title: 'Hari Pernikahan', description: '2026 Mengikat janji suci pernikahan di hadapan keluarga dan sahabat tercinta.' }
                    ])" :key="idx" class="gsap-fade-up text-center space-y-2 px-2">
                        
                        <h3 class="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#2c3746] tracking-wide">
                            {{ story.title }} - {{ story.year }}
                        </h3>

                        <p class="text-xs md:text-sm text-[#4a5668] leading-relaxed max-w-md mx-auto font-normal">
                            {{ story.description }}
                        </p>

                    </div>
                </div>
            </div>
        </section>

        <!-- LOVE STORY FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.story !== false" id="story" class="py-20 sm:py-24 px-4 sm:px-6 relative">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-12 sm:mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">PERJALANAN CINTA</span>
                    <h2 class="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-2">Kisah Cinta Kami</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div :class="templateStyle.accentBorder" class="relative border-l-2 ml-4 md:ml-12 space-y-8 sm:space-y-10 pl-6 md:pl-10">
                    <div v-for="(story, idx) in customConfig?.loveStories" :key="idx" class="gsap-fade-up relative group">
                        <div :class="templateStyle.badgeBg" class="absolute -left-[31px] md:-left-[47px] top-4 w-6 h-6 rounded-full border-4 border-black z-10 shadow-lg"></div>

                        <div :class="templateStyle.cardBg" class="relative overflow-hidden p-5 sm:p-6 md:p-8 transition duration-500 hover:-translate-y-1.5 shadow-2xl group">
                            <div v-if="story.bgImage" class="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700 pointer-events-none" :style="{ backgroundImage: `url(${story.bgImage})` }"></div>
                            <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90 pointer-events-none"></div>

                            <div class="relative z-10 space-y-2">
                                <div class="flex items-center space-x-3">
                                    <span :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="text-xs font-extrabold px-3 py-1 rounded-full border tracking-widest uppercase">
                                        {{ story.year }}
                                    </span>
                                    <h4 class="font-serif text-lg sm:text-xl md:text-2xl font-bold text-white">{{ story.title }}</h4>
                                </div>
                                <p class="text-xs md:text-sm text-gray-200 leading-relaxed pt-1">
                                    {{ story.description }}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <!-- GALLERY SECTION FOR TEMPLATE 1 -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.gallery !== false)" id="galeri" class="py-16 sm:py-24 px-4 sm:px-6 relative text-center overflow-hidden min-h-screen flex flex-col justify-center bg-[#f7f5f0]">
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.9] contrast-[1.02] pointer-events-none transition-all duration-700" 
                 :style="{ backgroundImage: `url('${allGalleryPhotos[activeGalleryIndex] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#f7f5f0]/85 via-black/30 to-[#f7f5f0]/90 pointer-events-none"></div>

            <div class="max-w-xl mx-auto relative z-10 w-full">
                <div class="mb-6 sm:mb-8 gsap-fade-up">
                    <h2 class="font-script text-4xl sm:text-5xl md:text-6xl text-[#2c3746] font-normal drop-shadow-sm">Our Gallery</h2>
                </div>

                <div class="relative w-full max-w-[300px] sm:max-w-md mx-auto aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-2 sm:border-4 border-[#2c3746] mb-4 group gsap-scale-up">
                    <img :src="allGalleryPhotos[activeGalleryIndex]" @click="activeLightbox = allGalleryPhotos[activeGalleryIndex]" class="w-full h-full object-cover transition-all duration-500 cursor-pointer" />
                    
                    <button @click.stop="prevGalleryPhoto" class="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition shadow-lg cursor-pointer">
                        <ChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <button @click.stop="nextGalleryPhoto" class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-2 sm:p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition shadow-lg cursor-pointer">
                        <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div class="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2.5 max-w-[300px] sm:max-w-md mx-auto gsap-fade-up">
                    <div v-for="(photo, idx) in allGalleryPhotos" :key="idx" 
                         @click="activeGalleryIndex = idx" 
                         :class="activeGalleryIndex === idx ? 'border-2 sm:border-4 border-[#2c3746] scale-105 shadow-xl' : 'border border-white/60 opacity-70 hover:opacity-100'" 
                         class="aspect-square rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-slate-200 shadow">
                        <img :src="photo" class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>

        <!-- GALLERY SECTION FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.gallery !== false" id="galeri" class="py-20 sm:py-28 px-4 sm:px-6">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-12 sm:mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">MOMEN INDAH</span>
                    <h2 class="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-2">Galeri Foto</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <div v-for="(img, idx) in allGalleryPhotos" :key="idx" @click="activeLightbox = img" :class="templateStyle.accentBorder" class="gsap-scale-up aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group relative border shadow-lg">
                        <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye :class="templateStyle.iconColor" class="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- LIGHTBOX MODAL -->
        <div v-if="activeLightbox" @click="activeLightbox = null" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer">
            <img :src="activeLightbox" :class="templateStyle.accentBorder" class="max-w-full max-h-[85vh] rounded-xl sm:rounded-2xl shadow-2xl border-2" />
        </div>

        <!-- LOVE GIFT SECTION FOR TEMPLATE 1 -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.gift !== false)" id="gift" class="py-16 sm:py-24 px-4 sm:px-6 text-center bg-[#f7f5f0] relative border-t border-[#2c3746]/10">
            <div class="max-w-xl mx-auto gsap-fade-up">
                <h2 class="font-script text-4xl sm:text-5xl md:text-6xl text-[#2c3746] font-normal mb-3">love Gift</h2>
                
                <p class="text-xs md:text-sm text-[#4a5668] max-w-md mx-auto leading-relaxed font-normal mb-6 px-2">
                    Tanpa mengurangi rasa hormat, bagi tamu undangan yang ingin memberikan tanda kasih , dapat melalui virtual account di bawah ini
                </p>

                <button @click="showBankModal = !showBankModal" class="bg-[#2c3746] hover:bg-[#1c2430] text-white text-xs font-medium px-6 py-2.5 rounded-lg shadow-md inline-flex items-center space-x-2 cursor-pointer transition mb-6">
                    <span>💳 Rekening</span>
                </button>

                <transition name="fade">
                    <div v-if="showBankModal" class="max-w-sm sm:max-w-md mx-auto bg-[#2c3746] p-5 sm:p-6 text-white rounded-2xl shadow-xl text-left space-y-4 border border-white/20">
                        <div class="flex justify-between items-center pb-2 border-b border-white/10">
                            <span class="text-amber-300 font-bold text-sm sm:text-base">{{ customConfig?.gift?.bankName1 || 'Bank Central Asia (BCA)' }}</span>
                            <span class="text-[10px] text-gray-300 font-mono">Transfer Bank</span>
                        </div>
                        <div>
                            <p class="text-[10px] text-gray-300 uppercase tracking-wider mb-0.5">Nomor Rekening:</p>
                            <p class="font-mono text-base sm:text-lg font-bold text-white tracking-widest">{{ customConfig?.gift?.accountNo1 || '8830192834' }}</p>
                            <p class="text-xs text-gray-300 mt-1">a.n. {{ customConfig?.gift?.accountName1 || 'Nama Pemilik Rekening' }}</p>
                        </div>
                        <button @click="copyToClipboard(customConfig?.gift?.accountNo1 || '8830192834', 'bank1')" class="w-full bg-white text-[#2c3746] hover:bg-slate-100 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer shadow">
                            <Check v-if="copiedBank === 'bank1'" class="w-4 h-4 text-emerald-600" />
                            <Copy v-else class="w-4 h-4 text-[#2c3746]" />
                            <span>{{ copiedBank === 'bank1' ? 'Disalin!' : 'Salin Rekening' }}</span>
                        </button>
                    </div>
                </transition>
            </div>
        </section>

        <!-- RSVP & WISHES SECTION FOR TEMPLATE 1 -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.rsvp !== false)" id="rsvp" class="py-16 sm:py-24 px-4 sm:px-6 pb-28 sm:pb-32 relative overflow-hidden bg-[#f7f5f0]">
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.92] contrast-[1.02] pointer-events-none transition-all duration-700 opacity-60 mix-blend-multiply" 
                 :style="{ backgroundImage: `url('${allGalleryPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#f7f5f0]/90 via-[#f7f5f0]/75 to-[#f7f5f0]/95 pointer-events-none"></div>

            <div class="max-w-xl mx-auto relative z-10">
                <div class="text-center mb-8 sm:mb-10 gsap-fade-up">
                    <h2 class="font-script text-4xl sm:text-5xl md:text-6xl text-[#2c3746] font-normal mb-3 drop-shadow-sm">love Wishes</h2>
                    <p class="text-xs md:text-sm text-[#4a5668] max-w-lg mx-auto leading-relaxed font-normal px-2">
                        Do'a restu keluarga dan sahabat dipernikahan kami sudah sangat cukup sebagai hadiah, tetapi jika memberi merupakan tanda kasih, kami dengan senang hati menerimanya.
                    </p>
                </div>

                <div class="max-w-sm sm:max-w-md mx-auto bg-[#2c3746] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-white mb-6 sm:mb-8 text-left gsap-scale-up border border-white/20">
                    <form @submit.prevent="submitRSVP" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-white mb-1.5">Nama Tamu:</label>
                            <input v-model="rsvpForm.name" type="text" required placeholder="Nama Anda" 
                                   class="w-full bg-white text-[#2c3746] font-medium rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-white mb-1.5">Ucapan &amp; Doa:</label>
                            <textarea v-model="rsvpForm.message" rows="3" required placeholder="Pesan doa restu..." 
                                      class="w-full bg-white text-[#2c3746] font-medium rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"></textarea>
                        </div>

                        <div class="pt-2">
                            <button type="submit" :disabled="isSubmittingRSVP" class="bg-white hover:bg-slate-100 text-[#2c3746] font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer transition inline-flex items-center space-x-2">
                                <MessageSquare class="w-4 h-4 text-[#2c3746]" />
                                <span>{{ isSubmittingRSVP ? 'Mengirim...' : 'Beri Ucapan' }}</span>
                            </button>
                        </div>

                        <p v-if="rsvpSubmitted" class="text-xs font-bold text-emerald-300 pt-2">
                            Terima kasih! Ucapan Anda telah berhasil terkirim.
                        </p>
                    </form>
                </div>

                <div class="max-w-sm sm:max-w-md mx-auto bg-[#2c3746] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl text-white text-center gsap-fade-up border border-white/20">
                    <h3 class="font-serif text-base sm:text-lg md:text-xl font-bold text-white mb-3">Ucapan dan Doa Para Tamu</h3>
                    
                    <div class="mb-5">
                        <span class="bg-[#e67e22] text-white text-xs font-bold px-4 py-1.5 rounded-xl inline-block shadow">
                            Jumlah: {{ wishesList.length }} Ucapan
                        </span>
                    </div>

                    <div class="max-h-[300px] sm:max-h-[380px] overflow-y-auto space-y-3.5 pr-1 text-left custom-scrollbar">
                        <div v-if="wishesList.length === 0" class="text-center text-xs text-slate-400 py-6 italic bg-[#202936] rounded-xl border border-white/5 px-4">
                            Belum ada ucapan &amp; doa. Berikan ucapan pertama Anda di atas!
                        </div>
                        <div v-for="(wish, index) in wishesList" :key="index" class="bg-[#202936] border border-white/10 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-inner">
                            <h4 class="font-bold text-xs sm:text-sm text-white mb-1">{{ wish.name }}</h4>
                            <p class="text-xs text-slate-200 leading-relaxed">{{ wish.message || wish.text }}</p>
                            <span class="text-[10px] text-slate-400 font-medium block mt-2">{{ wish.date || wish.time || 'Baru saja' }}</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- FOOTER FOR TEMPLATE 1 -->
        <footer v-if="activeTemplateId === 'midnight-gold'" class="relative min-h-[80vh] sm:min-h-screen flex flex-col justify-between items-center text-center p-6 sm:p-8 overflow-hidden bg-slate-900">
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.75] contrast-[1.05] pointer-events-none" 
                 :style="{ backgroundImage: `url('${customConfig?.bride?.photo || heroPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none"></div>

            <div class="relative z-10 pt-12 sm:pt-16 md:pt-24 space-y-3 sm:space-y-4 max-w-xl mx-auto gsap-fade-up">
                <p class="font-script text-3xl sm:text-4xl md:text-6xl text-white font-normal drop-shadow-md">Thankyou</p>
                
                <h2 class="font-serif text-2xl sm:text-3xl md:text-5xl font-extrabold text-white uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-tight drop-shadow-xl px-2">
                    {{ customConfig?.bride?.nickname || 'SEKAR' }} &amp;<br />
                    {{ customConfig?.groom?.nickname || 'ARYA' }}
                </h2>
            </div>

            <div class="relative z-10 pb-6 sm:pb-8 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/70 drop-shadow">
                Powered by {{ templateStyle.name }}
            </div>
        </footer>

        <!-- FOOTER FOR OTHER TEMPLATES -->
        <footer v-else class="py-10 sm:py-12 px-4 sm:px-6 bg-black/80 text-center border-t border-white/10 text-xs text-gray-400">
            <p class="font-serif text-base sm:text-lg text-white mb-2 font-bold">{{ customConfig?.groom?.nickname || 'Mempelai Pria' }} &amp; {{ customConfig?.bride?.nickname || 'Mempelai Wanita' }}</p>
            <p class="text-gray-500 mb-4 sm:mb-6">Terima kasih atas doa &amp; kehadiran Bapak/Ibu/Saudara/i sekalian.</p>
            <div :class="templateStyle.accentText" class="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
                Powered by {{ templateStyle.name }}
            </div>
        </footer>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Marcellus&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=WindSong:wght@400;500&display=swap');

.font-script { font-family: 'WindSong', 'Alex Brush', 'Great Vibes', cursive; }
.font-serif { font-family: 'Bodoni Moda', 'Cinzel', 'Marcellus', 'Cormorant Garamond', serif; }
.font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }

.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
