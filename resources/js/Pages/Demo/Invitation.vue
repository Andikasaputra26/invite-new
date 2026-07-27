<script setup>
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Heart, Calendar, MapPin, Clock, Volume2, VolumeX, 
    Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    ChevronDown, ChevronLeft, ChevronRight, UserCheck, Eye, Compass, Image as ImageIcon,
    Flower2, Shield, Leaf, Diamond, Crown, Star
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

// WeGiftry Wishlist Registry
const localWishlist = ref(props.giftWishlists || [
    {
        id: 1,
        item_name: 'Air Fryer Digital Philips 4.1L',
        price_estimate: 'Rp 1.499.000',
        item_image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80',
        is_reserved: false,
        reserved_by: null
    },
    {
        id: 2,
        item_name: 'Set Sprei King Size Tencel Premium',
        price_estimate: 'Rp 899.000',
        item_image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=300&q=80',
        is_reserved: true,
        reserved_by: 'Budi Santoso'
    }
]);

const reserveWishlistItem = (item) => {
    const reserver = prompt(`Masukkan nama Anda untuk mereservasi ${item.item_name}:`, props.guestName || '');
    if (!reserver) return;

    if (props.invitationSlug) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        fetch(`/v/${props.invitationSlug}/wishlist/${item.id}/reserve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({ reserved_by: reserver })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                item.is_reserved = true;
                item.reserved_by = reserver;
                alert(`Terima kasih ${reserver}! Kado berhasil di-reservasi.`);
            } else {
                alert(data.message || 'Gagal mereservasi kado.');
            }
        });
    } else {
        item.is_reserved = true;
        item.reserved_by = reserver;
        alert(`Terima kasih ${reserver}! Kado berhasil di-reservasi.`);
    }
};

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
    '4': 'royal-velvet'
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
            cardBg: 'bg-[#2a1720]/95 border-[#f472b6]/30 rounded-t-[50px] rounded-b-[24px] shadow-[0_10px_30px_rgba(244,114,182,0.15)]',
            accentText: 'text-[#f472b6]',
            accentBorder: 'border-[#f472b6]/40',
            accentBg: 'bg-[#f472b6]/15',
            buttonBg: 'bg-gradient-to-r from-[#f472b6] via-[#fb7185] to-[#f43f5e] text-white shadow-lg shadow-[#f472b6]/30 hover:scale-105',
            badgeBg: 'bg-[#f472b6] text-white',
            iconColor: 'text-[#f472b6]',
            heroTitleClass: 'font-serif text-5xl md:text-7xl italic font-normal text-pink-100 tracking-wide',
            photoFrameClass: 'rounded-t-full rounded-b-3xl border-4 border-[#f472b6]/50 shadow-2xl p-1.5 bg-[#2a1720]'
        };
    } else if (tId === 'emerald-botanical') {
        return {
            id: 'emerald-botanical',
            name: 'Emerald Botanical Haven',
            bgClass: 'bg-[#062c1e] text-[#ecfdf5]',
            coverBg: 'bg-[#042015]',
            cardBg: 'bg-[#0a422e]/80 backdrop-blur-xl border border-[#34d399]/40 rounded-3xl shadow-[0_20px_50px_rgba(52,211,153,0.15)]',
            accentText: 'text-[#34d399]',
            accentBorder: 'border-[#34d399]/40',
            accentBg: 'bg-[#34d399]/15',
            buttonBg: 'bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669] text-[#042015] font-extrabold shadow-lg shadow-[#34d399]/25 hover:scale-105',
            badgeBg: 'bg-[#34d399] text-[#042015]',
            iconColor: 'text-[#34d399]',
            heroTitleClass: 'font-sans text-5xl md:text-7xl font-black tracking-tight text-white uppercase',
            photoFrameClass: 'rounded-[40px] border-2 border-[#34d399] shadow-2xl p-2 bg-[#0a422e]'
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
            heroTitleClass: 'font-serif text-5xl md:text-7xl font-bold tracking-widest text-sky-100 uppercase',
            photoFrameClass: 'rounded-2xl border-2 border-[#38bdf8] shadow-2xl p-2 bg-[#0d1b3e] transform rotate-1 hover:rotate-0 transition'
        };
    } else {
        // Default: midnight-gold
        return {
            id: 'midnight-gold',
            name: 'Midnight Serenade Gold',
            bgClass: 'bg-[#092219] text-[#f4efe6]',
            coverBg: 'bg-[#061811]',
            cardBg: 'bg-[#051711] border border-[#d4af37]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
            accentText: 'text-[#d4af37]',
            accentBorder: 'border-[#d4af37]/40',
            accentBg: 'bg-[#d4af37]/10',
            buttonBg: 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c5a059] text-[#092219] font-extrabold shadow-lg shadow-[#d4af37]/20 hover:scale-105',
            badgeBg: 'bg-[#d4af37] text-black',
            iconColor: 'text-[#d4af37]',
            heroTitleClass: 'font-script text-6xl md:text-8xl font-normal tracking-wide text-white',
            photoFrameClass: 'rounded-full border-4 border-[#d4af37] p-1 bg-[#051711] shadow-2xl'
        };
    }
});

// Form RSVP
const rsvpForm = reactive({
    name: '',
    status: 'hadir',
    guests: '1',
    message: ''
});

const isSubmittingRSVP = ref(false);
const rsvpSubmitted = ref(false);

const wishesList = ref([
    {
        name: 'Budi & Keluarga',
        status: 'Hadir',
        message: 'Selamat untuk Arya & Sekar! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin.',
        date: '2 jam yang lalu'
    },
    {
        name: 'Siti Rahmawati',
        status: 'Hadir',
        message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Cantik dan ganteng banget!',
        date: '5 jam yang lalu'
    },
    {
        name: 'Dion & Amanda',
        status: 'Hadir',
        message: 'Happy wedding brother! Lancar-lancar terus acaranya yaa 🎉🎉',
        date: '1 hari yang lalu'
    }
]);

// Countdown state
const countdown = reactive({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
});

let timerInterval = null;

const updateCountdown = () => {
    const rawDate = customConfig.value?.event?.date || '2026-08-24';
    const targetDate = new Date(`${rawDate}T08:00:00+07:00`).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        countdown.days = d < 10 ? `0${d}` : `${d}`;
        countdown.hours = h < 10 ? `0${h}` : `${h}`;
        countdown.minutes = m < 10 ? `0${m}` : `${m}`;
        countdown.seconds = s < 10 ? `0${s}` : `${s}`;
    } else {
        countdown.days = '00';
        countdown.hours = '00';
        countdown.minutes = '00';
        countdown.seconds = '00';
    }
};

// Open Envelope & Start Animation
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
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    }, '-=0.5');
};

// Audio Controller
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
                guest_name: rsvpForm.name,
                attendance_status: rsvpForm.status === 'hadir' ? 'Hadir' : rsvpForm.status === 'ragu' ? 'Ragu-ragu' : 'Tidak Hadir',
                message: rsvpForm.message
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.wish) {
                wishesList.value.unshift(data.wish);
            } else {
                wishesList.value.unshift({
                    name: rsvpForm.name,
                    status: rsvpForm.status === 'hadir' ? 'Hadir' : rsvpForm.status === 'ragu' ? 'Ragu-ragu' : 'Tidak Hadir',
                    message: rsvpForm.message,
                    date: 'Baru saja'
                });
            }
            rsvpForm.name = '';
            rsvpForm.message = '';
            isSubmittingRSVP.value = false;
            rsvpSubmitted.value = true;
            setTimeout(() => rsvpSubmitted.value = false, 4000);
        })
        .catch(err => {
            console.error('Error posting wish:', err);
            isSubmittingRSVP.value = false;
        });
    } else {
        setTimeout(() => {
            wishesList.value.unshift({
                name: rsvpForm.name,
                status: rsvpForm.status === 'hadir' ? 'Hadir' : rsvpForm.status === 'ragu' ? 'Ragu-ragu' : 'Tidak Hadir',
                message: rsvpForm.message,
                date: 'Baru saja'
            });
            
            rsvpForm.name = '';
            rsvpForm.message = '';
            isSubmittingRSVP.value = false;
            rsvpSubmitted.value = true;
            setTimeout(() => rsvpSubmitted.value = false, 4000);
        }, 800);
    }
};

const scrollToSection = (id) => {
    activeTabNav.value = id;
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
};

const initScrollAnimations = () => {
    // GSAP Parallax Background Scroll Animation for Template 1 (midnight-gold)
    if (activeTemplateId.value === 'midnight-gold') {
        gsap.to('.parallax-bg', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            },
            yPercent: 25,
            ease: 'none'
        });
    }

    gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    gsap.utils.toArray('.gsap-scale-up').forEach((el) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%' },
            scale: 0.88,
            opacity: 0,
            duration: 1.2,
            ease: 'back.out(1.7)'
        });
    });
};

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const invitationId = params.get('id');
    const queryTemplate = params.get('template');

    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    let routeTemplate = props.templateSlug || queryTemplate;
    
    if (!routeTemplate && pathSegments.length >= 3 && pathSegments[0] === 'demo' && pathSegments[1] === 'invitation') {
        routeTemplate = pathSegments[2];
    }

    let stored = null;
    if (invitationId) {
        stored = localStorage.getItem(`customer_invitation_${invitationId}`);
    }
    if (!stored) {
        stored = localStorage.getItem('customInvitationData');
    }

    if (stored) {
        try {
            customConfig.value = JSON.parse(stored);
        } catch(e) {
            console.error('Failed parsing custom config:', e);
        }
    }

    if (!customConfig.value) {
        customConfig.value = { templateId: routeTemplate || 'midnight-gold' };
    }

    if (routeTemplate) {
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

    <!-- Audio BGM -->
    <audio ref="audioRef" loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113064.mp3" type="audio/mpeg" />
    </audio>

    <div :class="[templateStyle.bgClass, {'h-screen overflow-hidden': !isOpen}]" class="font-sans min-h-screen relative overflow-x-hidden transition-colors duration-700">
        
        <!-- PARALLAX COUPLE PHOTO BACKGROUND FOR TEMPLATE 1 (midnight-gold) -->
        <div v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.background?.useImage !== false)" class="parallax-bg fixed -inset-x-0 -top-[15vh] h-[135vh] w-full bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none z-0 filter brightness-90 saturate-125 transition duration-700" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80'})` }"></div>
        <div v-if="activeTemplateId === 'midnight-gold'" class="fixed inset-0 bg-gradient-to-b from-[#061811]/90 via-[#061811]/75 to-[#092219]/95 z-0 pointer-events-none"></div>

        <!-- COVER ENVELOPE OVERLAY WITH 4 DISTINCT TEMPLATE VISUALS -->
        <div id="envelope-cover" :class="templateStyle.coverBg" class="fixed inset-0 z-50 flex flex-col justify-between items-center p-6 text-center shadow-2xl overflow-hidden">
            <div v-if="!customConfig || customConfig.background?.useImage !== false" class="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80'})` }"></div>
            
            <!-- Top Header Badge Variant -->
            <div class="pt-8 flex flex-col items-center z-10">
                <!-- Midnight Gold Badge -->
                <div v-if="activeTemplateId === 'midnight-gold'" class="flex flex-col items-center">
                    <Crown class="w-7 h-7 text-[#d4af37] mb-1 animate-pulse" />
                    <span class="text-[#d4af37] text-xs font-bold tracking-[0.3em] uppercase">WALIMATUL 'URSY</span>
                    <div class="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2"></div>
                </div>

                <!-- Rose Romance Badge -->
                <div v-else-if="activeTemplateId === 'rose-romance'" class="flex flex-col items-center">
                    <Flower2 class="w-7 h-7 text-[#f472b6] mb-1 animate-spin" style="animation-duration: 12s;" />
                    <span class="text-[#f472b6] text-xs font-bold tracking-[0.3em] uppercase">THE WEDDING DAY</span>
                    <div class="w-16 h-0.5 bg-[#f472b6]/50 mt-2 rounded-full"></div>
                </div>

                <!-- Emerald Botanical Badge -->
                <div v-else-if="activeTemplateId === 'emerald-botanical'" class="flex flex-col items-center">
                    <Leaf class="w-7 h-7 text-[#34d399] mb-1 animate-bounce" />
                    <span class="text-[#34d399] text-xs font-bold tracking-[0.3em] uppercase">BOTANICAL WEDDING</span>
                    <div class="w-16 h-0.5 bg-[#34d399] mt-2"></div>
                </div>

                <!-- Royal Velvet Sapphire Badge -->
                <div v-else class="flex flex-col items-center">
                    <Diamond class="w-7 h-7 text-[#38bdf8] mb-1 animate-pulse" />
                    <span class="text-[#38bdf8] text-xs font-bold tracking-[0.3em] uppercase">ROYAL SAPPHIRE GALA</span>
                    <div class="w-16 h-0.5 bg-[#38bdf8] mt-2"></div>
                </div>
            </div>

            <!-- Envelope Center Container -->
            <div :class="templateStyle.cardBg" class="max-w-md w-full p-8 flex flex-col items-center relative overflow-hidden group z-10 transition duration-500">
                <p :class="templateStyle.accentText" class="font-serif italic text-xl mb-1">The Wedding of</p>
                
                <h1 :class="templateStyle.heroTitleClass" class="mb-6 leading-tight">
                    {{ customConfig?.groom?.nickname || 'Raden Arya' }} <br />
                    <span :class="templateStyle.accentText" class="font-serif italic text-3xl">&amp;</span> <br />
                    {{ customConfig?.bride?.nickname || 'Putri Sekar' }}
                </h1>

                <!-- Recipient Box -->
                <div class="w-full bg-black/40 border border-white/10 rounded-2xl p-4 mb-8 text-center backdrop-blur-sm">
                    <p class="text-xs text-gray-400 mb-1">KEPADA YTH. BAPAK/IBU/SAUDARA/I:</p>
                    <h3 class="text-lg font-bold text-white tracking-wide">{{ props.guestName || 'Tamu Undangan Spesial' }}</h3>
                    <p :class="templateStyle.accentText" class="text-[10px] mt-1 font-mono">Di Tempat</p>
                </div>

                <!-- Open Button -->
                <button @click="openInvitation" :class="templateStyle.buttonBg" class="relative px-8 py-3.5 rounded-full transition-all duration-300 flex items-center space-x-3 cursor-pointer">
                    <Sparkles class="w-5 h-5 animate-spin" style="animation-duration: 8s;" />
                    <span class="tracking-wider text-sm uppercase">Buka Undangan</span>
                </button>
            </div>

            <div class="pb-6 text-xs text-gray-400 font-light z-10">
                <p>Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
            </div>
        </div>

        <!-- FLOATING MUSIC CONTROLLER -->
        <button v-if="isOpen && (!customConfig || customConfig.components?.music !== false)" @click="toggleMusic" :class="templateStyle.accentBorder" class="fixed top-6 right-6 z-40 bg-black/80 backdrop-blur border p-3 rounded-full shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center">
            <div :class="[templateStyle.accentText, {'animate-spin': isPlayingMusic}]" style="animation-duration: 4s;">
                <Volume2 v-if="isPlayingMusic" class="w-5 h-5" />
                <VolumeX v-else class="w-5 h-5 opacity-50" />
            </div>
        </button>

        <!-- FLOATING MOBILE BOTTOM NAVIGATION DOCK -->
        <div v-if="isOpen" class="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
            <div :class="templateStyle.accentBorder" class="bg-black/90 backdrop-blur-xl border rounded-full px-5 py-2.5 shadow-2xl flex items-center space-x-6 text-white">
                <button @click="scrollToSection('hero')" :class="{'text-amber-400': activeTabNav === 'hero'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <Sparkles class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Home</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.mempelai !== false" @click="scrollToSection('mempelai')" :class="{'text-amber-400': activeTabNav === 'mempelai'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <Heart class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Mempelai</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.acara !== false" @click="scrollToSection('acara')" :class="{'text-amber-400': activeTabNav === 'acara'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <Calendar class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Acara</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.gallery !== false" @click="scrollToSection('galeri')" :class="{'text-amber-400': activeTabNav === 'galeri'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <ImageIcon class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Galeri</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.rsvp !== false" @click="scrollToSection('rsvp')" :class="{'text-amber-400': activeTabNav === 'rsvp'}" class="hover:text-amber-300 transition flex flex-col items-center">
                    <MessageSquare class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">RSVP</span>
                </button>
            </div>
        </div>

        <!-- MAIN HERO SECTION -->
        <section id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-6 overflow-hidden">
            <div v-if="!customConfig || customConfig.background?.useImage !== false" class="absolute inset-0 bg-cover bg-center bg-fixed opacity-30 mix-blend-overlay pointer-events-none" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80'})` }"></div>

            <div class="hero-content max-w-3xl relative z-10 space-y-6 pt-12">
                <div :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="inline-block px-5 py-2 rounded-full border text-xs font-extrabold tracking-[0.25em] uppercase">
                    {{ templateStyle.name }}
                </div>
                
                <h1 :class="templateStyle.heroTitleClass" class="leading-tight">
                    {{ customConfig?.groom?.nickname || 'Raden Arya' }} <br />
                    <span :class="templateStyle.accentText" class="font-serif italic text-4xl md:text-6xl font-normal">&amp;</span> <br />
                    {{ customConfig?.bride?.nickname || 'Putri Sekar' }}
                </h1>

                <p class="text-sm md:text-base text-gray-300 font-light max-w-md mx-auto leading-relaxed">
                    Kami mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada hari kebahagiaan kami.
                </p>

                <!-- Interactive Hero Photo Slider for Template 2 (rose-romance) -->
                <div v-if="activeTemplateId === 'rose-romance'" class="relative w-full max-w-xs md:max-w-sm mx-auto h-72 md:h-80 rounded-t-[140px] rounded-b-[40px] overflow-hidden border-4 border-[#f472b6]/50 shadow-[0_15px_40px_rgba(244,114,182,0.35)] my-6 group">
                    <div v-for="(photo, idx) in heroPhotos" :key="idx" 
                         :class="['absolute inset-0 transition-opacity duration-1000 ease-in-out', heroSlideIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0']">
                        <img :src="photo" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#1f1318] via-transparent to-transparent opacity-60"></div>
                    </div>
                    
                    <!-- Prev / Next Slider Arrows -->
                    <button @click="prevHeroSlide" class="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#f472b6] text-white p-2 rounded-full backdrop-blur-md transition shadow-lg">
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button @click="nextHeroSlide" class="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#f472b6] text-white p-2 rounded-full backdrop-blur-md transition shadow-lg">
                        <ChevronRight class="w-4 h-4" />
                    </button>
                    
                    <!-- Slide Indicator Dots -->
                    <div class="absolute bottom-3 inset-x-0 z-20 flex justify-center space-x-1.5">
                        <span v-for="(p, idx) in heroPhotos" :key="idx" @click="heroSlideIndex = idx"
                              :class="['h-2 rounded-full transition-all duration-300 cursor-pointer shadow', heroSlideIndex === idx ? 'w-6 bg-[#f472b6]' : 'w-2 bg-white/60']"></span>
                    </div>
                </div>

                <!-- Date Badge -->
                <div class="pt-4">
                    <div :class="templateStyle.accentBorder" class="inline-flex items-center space-x-3 bg-black/60 border px-6 py-3 rounded-2xl shadow-xl backdrop-blur-md">
                        <Calendar :class="templateStyle.iconColor" class="w-5 h-5" />
                        <span class="text-sm font-bold tracking-widest uppercase text-white">
                            {{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}
                        </span>
                    </div>
                </div>

                <div class="pt-12 flex justify-center">
                    <button @click="scrollToSection('ayat')" :class="templateStyle.accentText" class="animate-bounce hover:scale-125 transition">
                        <ChevronDown class="w-8 h-8" />
                    </button>
                </div>
            </div>
        </section>

        <!-- COMPONENT: QUOTE -->
        <section v-if="!customConfig || customConfig.components?.quote !== false" id="ayat" class="py-24 px-6 text-center relative border-t border-b border-white/10">
            <div class="max-w-3xl mx-auto gsap-fade-up">
                <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-14 h-14 rounded-full border flex items-center justify-center mx-auto mb-6">
                    <Heart :class="templateStyle.iconColor" class="w-7 h-7 fill-current" />
                </div>
                
                <p class="font-serif italic text-lg md:text-2xl text-white leading-relaxed mb-6">
                    "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...' }}"
                </p>
                <p :class="templateStyle.accentText" class="text-xs font-extrabold tracking-widest uppercase">KUTIPAN & AYAT SUCI</p>
            </div>
        </section>

        <!-- COMPONENT: MEMPELAI / COUPLE SECTION -->
        <section v-if="!customConfig || customConfig.components?.mempelai !== false" id="mempelai" class="py-28 px-6 relative overflow-hidden">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">PASANGAN MEMPELAI</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Mempelai Pria &amp; Wanita</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    <!-- Mempelai Pria Card -->
                    <div :class="templateStyle.cardBg" class="gsap-scale-up text-center relative overflow-hidden group hover:-translate-y-2 transition duration-500 flex flex-col p-0 border shadow-2xl">
                        <!-- Full Card Top Photo -->
                        <div class="w-full h-80 md:h-[380px] relative overflow-hidden">
                            <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                            <div class="absolute bottom-4 inset-x-0 text-center">
                                <span :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-widest uppercase shadow">
                                    MEMPELAI PRIA
                                </span>
                            </div>
                        </div>

                        <!-- Card Details Below Photo -->
                        <div class="p-6 md:p-8 space-y-3">
                            <h3 class="font-serif text-2xl md:text-3xl font-bold text-white mb-1">{{ customConfig?.groom?.name || 'Raden Arya Kusuma, S.T.' }}</h3>
                            
                            <p class="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
                                {{ customConfig?.groom?.orderText || 'Putra pertama dari' }} <br />
                                <strong class="text-white">{{ customConfig?.groom?.father || 'Bpk. Hj. Suryo Wijaya' }}</strong> <br />
                                &amp; <strong class="text-white">{{ customConfig?.groom?.mother || 'Ibu Hj. Endang Rahayu' }}</strong>
                            </p>

                            <div class="pt-2">
                                <a href="#" :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="inline-flex items-center space-x-2 text-xs font-bold px-6 py-2.5 rounded-full border hover:scale-105 transition shadow">
                                    <span>{{ customConfig?.groom?.instagram || '@aryawijaya' }}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Mempelai Wanita Card -->
                    <div :class="templateStyle.cardBg" class="gsap-scale-up text-center relative overflow-hidden group hover:-translate-y-2 transition duration-500 flex flex-col p-0 border shadow-2xl">
                        <!-- Full Card Top Photo -->
                        <div class="w-full h-80 md:h-[380px] relative overflow-hidden">
                            <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                            <div class="absolute bottom-4 inset-x-0 text-center">
                                <span :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-widest uppercase shadow">
                                    MEMPELAI WANITA
                                </span>
                            </div>
                        </div>

                        <!-- Card Details Below Photo -->
                        <div class="p-6 md:p-8 space-y-3">
                            <h3 class="font-serif text-2xl md:text-3xl font-bold text-white mb-1">{{ customConfig?.bride?.name || 'Putri Sekar Arum, S.Ked' }}</h3>
                            
                            <p class="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto">
                                {{ customConfig?.bride?.orderText || 'Putri kedua dari' }} <br />
                                <strong class="text-white">{{ customConfig?.bride?.father || 'Bpk. Dr. H. Bambang Subroto' }}</strong> <br />
                                &amp; <strong class="text-white">{{ customConfig?.bride?.mother || 'Ibu Hj. Dewi Lestari' }}</strong>
                            </p>

                            <div class="pt-2">
                                <a href="#" :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="inline-flex items-center space-x-2 text-xs font-bold px-6 py-2.5 rounded-full border hover:scale-105 transition shadow">
                                    <span>{{ customConfig?.bride?.instagram || '@sekararum' }}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- COMPONENT: COUNTDOWN TIMER -->
        <section v-if="!customConfig || customConfig.components?.countdown !== false" class="py-20 px-6 text-center border-t border-b border-white/10 relative overflow-hidden">
            <div class="max-w-4xl mx-auto gsap-fade-up">
                <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">COUNTDOWN</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-10">Menghitung Hari Bahagia</h2>

                <div class="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto mb-10">
                    <div :class="templateStyle.cardBg" class="p-4">
                        <div :class="templateStyle.accentText" class="font-serif text-3xl md:text-5xl font-bold">{{ countdown.days }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Hari</div>
                    </div>
                    <div :class="templateStyle.cardBg" class="p-4">
                        <div :class="templateStyle.accentText" class="font-serif text-3xl md:text-5xl font-bold">{{ countdown.hours }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Jam</div>
                    </div>
                    <div :class="templateStyle.cardBg" class="p-4">
                        <div :class="templateStyle.accentText" class="font-serif text-3xl md:text-5xl font-bold">{{ countdown.minutes }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Menit</div>
                    </div>
                    <div :class="templateStyle.cardBg" class="p-4">
                        <div :class="templateStyle.accentText" class="font-serif text-3xl md:text-5xl font-bold">{{ countdown.seconds }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Detik</div>
                    </div>
                </div>

                <a :href="googleCalendarUrl" target="_blank" :class="templateStyle.buttonBg" class="inline-flex items-center space-x-2 text-xs uppercase px-8 py-3.5 rounded-full shadow-lg">
                    <Calendar class="w-4 h-4" />
                    <span>Simpan ke Google Calendar</span>
                </a>
            </div>
        </section>

        <!-- COMPONENT: RANGKAIAN ACARA (EVENT & LOCATION) -->
        <section v-if="!customConfig || customConfig.components?.acara !== false" id="acara" class="py-28 px-6 relative overflow-hidden">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">JADWAL PERNIKAHAN</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Rangkaian Acara</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <!-- Akad Nikah -->
                    <div :class="templateStyle.cardBg" class="gsap-scale-up p-8 flex flex-col justify-between text-center relative overflow-hidden group hover:scale-[1.02] transition duration-500">
                        <div>
                            <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6">
                                <Sparkles :class="templateStyle.iconColor" class="w-7 h-7" />
                            </div>
                            <h3 class="font-serif text-2xl font-bold text-white mb-2">Akad Nikah</h3>
                            <p :class="templateStyle.accentText" class="text-xs font-extrabold tracking-wider uppercase mb-6">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</p>

                            <div class="space-y-3 text-xs text-gray-300 mb-8">
                                <p class="flex items-center justify-center space-x-2">
                                    <Clock :class="templateStyle.iconColor" class="w-4 h-4" />
                                    <span>{{ customConfig?.event?.akadTime || 'Pukul 08.00 WIB - 10.00 WIB' }}</span>
                                </p>
                                <p class="flex items-start justify-center space-x-2">
                                    <MapPin :class="templateStyle.iconColor" class="w-4 h-4 shrink-0 mt-0.5" />
                                    <span class="text-left">
                                        <strong class="text-white block">{{ customConfig?.event?.akadVenue || 'Masjid Agung Trans Studio' }}</strong>
                                        <span class="text-[11px] text-slate-300 block mt-0.5">{{ customConfig?.event?.address || 'Jl. Jend. Gatot Subroto No.1, Jakarta Pusat' }}</span>
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
                    <div :class="templateStyle.cardBg" class="gsap-scale-up p-8 flex flex-col justify-between text-center relative overflow-hidden group hover:scale-[1.02] transition duration-500">
                        <div>
                            <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6">
                                <Heart :class="templateStyle.iconColor" class="w-7 h-7" />
                            </div>
                            <h3 class="font-serif text-2xl font-bold text-white mb-2">Resepsi Pernikahan</h3>
                            <p :class="templateStyle.accentText" class="text-xs font-extrabold tracking-wider uppercase mb-6">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</p>

                            <div class="space-y-3 text-xs text-gray-300 mb-8">
                                <p class="flex items-center justify-center space-x-2">
                                    <Clock :class="templateStyle.iconColor" class="w-4 h-4" />
                                    <span>{{ customConfig?.event?.resepsiTime || 'Pukul 11.00 - 14.00 WIB' }}</span>
                                </p>
                                <p class="flex items-start justify-center space-x-2">
                                    <MapPin :class="templateStyle.iconColor" class="w-4 h-4 shrink-0 mt-0.5" />
                                    <span class="text-left">
                                        <strong class="text-white block">{{ customConfig?.event?.venueName || 'Gedung Serbaguna Senayan' }}</strong>
                                        <span class="text-[11px] text-slate-300 block mt-0.5">{{ customConfig?.event?.address || 'Jl. Jend. Gatot Subroto No.1, Jakarta Pusat' }}</span>
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

        <!-- COMPONENT: LOVE STORY WITH EDITABLE BACKGROUND CARDS -->
        <section v-if="!customConfig || customConfig.components?.story !== false" class="py-24 px-6 relative">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">PERJALANAN CINTA</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Kisah Cinta Kami</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div :class="templateStyle.accentBorder" class="relative border-l-2 ml-4 md:ml-12 space-y-10 pl-6 md:pl-10">
                    <div v-for="(story, idx) in (customConfig?.loveStories || [
                        { year: '2021', title: 'Awal Pertemuan', description: 'Kami pertama kali bertemu dalam sebuah kegiatan kampus di Universitas Indonesia.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
                        { year: '2023', title: 'Momen Lamaran', description: 'Arya melamar Sekar di hadapan keluarga besar dengan suasana hangat dan penuh kebahagiaan.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
                        { year: '2026', title: 'Hari Pernikahan', description: 'Awal dari babak baru perjalanan kehidupan suci kami berdua.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
                    ])" :key="idx" class="gsap-fade-up relative group">
                        
                        <!-- Timeline Dot Indicator -->
                        <div :class="templateStyle.badgeBg" class="absolute -left-[31px] md:-left-[47px] top-4 w-6 h-6 rounded-full border-4 border-black z-10 shadow-lg"></div>

                        <!-- Story Background Card -->
                        <div :class="templateStyle.cardBg" class="relative overflow-hidden p-6 md:p-8 transition duration-500 hover:-translate-y-1.5 shadow-2xl group">
                            
                            <!-- Editable Background Photo Layer with Gradient Vignette -->
                            <div v-if="story.bgImage" class="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700 pointer-events-none" :style="{ backgroundImage: `url(${story.bgImage})` }"></div>
                            <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90 pointer-events-none"></div>

                            <!-- Story Card Body Content -->
                            <div class="relative z-10 space-y-2">
                                <div class="flex items-center space-x-3">
                                    <span :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="text-xs font-extrabold px-3 py-1 rounded-full border tracking-widest uppercase">
                                        {{ story.year }}
                                    </span>
                                    <h4 class="font-serif text-xl md:text-2xl font-bold text-white">{{ story.title }}</h4>
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

        <!-- COMPONENT: GALERI FOTO -->
        <section v-if="!customConfig || customConfig.components?.gallery !== false" id="galeri" class="py-28 px-6">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">MOMEN INDAH</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Galeri Foto</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <!-- DEDICATED EDITORIAL MASONRY GRID FOR TEMPLATE 2 (rose-romance) -->
                <div v-if="activeTemplateId === 'rose-romance'" class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
                    <!-- Photo 1: Large Featured Left Card -->
                    <div v-if="heroPhotos[0]" @click="activeLightbox = heroPhotos[0]" 
                         class="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl border-2 border-[#f472b6]/40 shadow-[0_15px_40px_rgba(244,114,182,0.25)] hover:border-[#f472b6] transition duration-500 cursor-pointer group bg-[#2a1720] min-h-[360px] md:min-h-[480px]">
                        <img :src="heroPhotos[0]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div class="p-3.5 bg-[#f472b6] text-slate-950 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                                <Eye class="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <!-- Photo 2: Top Right Grid Card -->
                    <div v-if="heroPhotos[1]" @click="activeLightbox = heroPhotos[1]" 
                         class="relative overflow-hidden rounded-2xl border-2 border-[#f472b6]/40 shadow-xl hover:border-[#f472b6] transition duration-500 cursor-pointer group bg-[#2a1720] h-56 md:h-[228px]">
                        <img :src="heroPhotos[1]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div class="p-3 bg-[#f472b6] text-slate-950 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                <Eye class="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <!-- Photo 3: Bottom Right Grid Card -->
                    <div v-if="heroPhotos[2]" @click="activeLightbox = heroPhotos[2]" 
                         class="relative overflow-hidden rounded-2xl border-2 border-[#f472b6]/40 shadow-xl hover:border-[#f472b6] transition duration-500 cursor-pointer group bg-[#2a1720] h-56 md:h-[228px]">
                        <img :src="heroPhotos[2]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div class="p-3 bg-[#f472b6] text-slate-950 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                <Eye class="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <!-- Additional Photos if more than 3 -->
                    <div v-for="(img, idx) in heroPhotos.slice(3)" :key="idx" @click="activeLightbox = img"
                         class="relative overflow-hidden rounded-2xl border-2 border-[#f472b6]/40 shadow-xl hover:border-[#f472b6] transition duration-500 cursor-pointer group bg-[#2a1720] h-56">
                        <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div class="p-3 bg-[#f472b6] text-slate-950 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                <Eye class="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STANDARD / OTHER TEMPLATES GALLERY GRID -->
                <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div v-for="(img, idx) in (customConfig?.gallery?.photos || [
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80'
                    ])" :key="idx" @click="activeLightbox = img" :class="templateStyle.accentBorder" class="gsap-scale-up aspect-square rounded-2xl overflow-hidden cursor-pointer group relative border shadow-lg">
                        <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye :class="templateStyle.iconColor" class="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- LIGHTBOX MODAL -->
        <div v-if="activeLightbox" @click="activeLightbox = null" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer">
            <img :src="activeLightbox" :class="templateStyle.accentBorder" class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border-2" />
        </div>

        <!-- COMPONENT: AMPLOP DIGITAL -->
        <section v-if="!customConfig || customConfig.components?.gift !== false" class="py-24 px-6 text-center border-t border-b border-white/10">
            <div class="max-w-3xl mx-auto gsap-fade-up">
                <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-14 h-14 rounded-full border flex items-center justify-center mx-auto mb-6">
                    <Gift :class="templateStyle.iconColor" class="w-7 h-7" />
                </div>
                <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">TANDA KASIH</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Amplop Digital &amp; Kado</h2>
                <p class="text-xs text-gray-300 max-w-md mx-auto mb-10 leading-relaxed">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan hadiah, Anda dapat menggunakan rekening di bawah ini:
                </p>

                <div class="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                    <div :class="templateStyle.cardBg" class="p-6 text-left relative overflow-hidden">
                        <div class="flex justify-between items-center mb-4">
                            <span :class="templateStyle.accentText" class="text-lg font-bold">{{ customConfig?.gift?.bankName1 || 'Bank BCA' }}</span>
                            <span class="text-[10px] text-gray-400 font-mono">Transfer Bank</span>
                        </div>
                        <p class="font-mono text-base font-bold text-white tracking-widest mb-1">{{ customConfig?.gift?.accountNo1 || '8830192834' }}</p>
                        <p class="text-xs text-gray-300 mb-4">a.n. {{ customConfig?.gift?.accountName1 || 'Raden Arya Wijaya' }}</p>
                        
                        <button @click="copyToClipboard(customConfig?.gift?.accountNo1 || '8830192834', 'bank1')" :class="[templateStyle.accentBg, templateStyle.accentBorder, templateStyle.accentText]" class="w-full border text-xs font-bold py-2.5 rounded-xl hover:scale-105 transition flex items-center justify-center space-x-2">
                            <Check v-if="copiedBank === 'bank1'" class="w-4 h-4 text-green-400" />
                            <Copy v-else class="w-4 h-4" />
                            <span>{{ copiedBank === 'bank1' ? 'Disalin!' : 'Salin Rekening' }}</span>
                        </button>
                    </div>

                    <div :class="templateStyle.cardBg" class="p-6 text-left relative overflow-hidden">
                        <div class="flex justify-between items-center mb-4">
                            <span :class="templateStyle.accentText" class="text-lg font-bold">Kirim Kado Fisik</span>
                            <Gift :class="templateStyle.iconColor" class="w-4 h-4" />
                        </div>
                        <p class="text-xs text-slate-300 mb-4 leading-relaxed">{{ customConfig?.gift?.shippingAddress || 'Jl. Wijaya Kusuma No. 45, Kebayoran Baru, Jakarta Selatan' }}</p>
                    </div>
                </div>

                <!-- COMPONENT: WEGIFTRY WISHLIST REGISTRY -->
                <div v-if="!customConfig || customConfig.components?.wishlist !== false" class="mt-16 pt-12 border-t border-white/10 max-w-4xl mx-auto">
                    <div class="mb-8">
                        <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">WEGIFTRY REGISTRY</span>
                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-white mt-1">Wishlist Kado Impian Pengantin</h3>
                        <p class="text-xs text-gray-300 mt-1">Pilih dan reservasi kado impian pengantin agar hadiah tidak dobel.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div v-for="item in localWishlist" :key="item.id" :class="templateStyle.cardBg" class="p-5 flex items-center space-x-4 border rounded-2xl text-left shadow-lg relative overflow-hidden">
                            <img :src="item.item_image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80'" class="w-20 h-20 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-sm text-white truncate">{{ item.item_name }}</h4>
                                <p :class="templateStyle.accentText" class="text-xs font-mono font-bold mt-0.5">{{ item.price_estimate }}</p>
                                <div class="mt-3 flex items-center justify-between">
                                    <span :class="[item.is_reserved ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', 'text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border']">
                                        {{ item.is_reserved ? `✓ Di-reservasi (${item.reserved_by})` : 'Tersedia' }}
                                    </span>

                                    <button 
                                        @click="reserveWishlistItem(item)"
                                        :disabled="item.is_reserved"
                                        :class="[item.is_reserved ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-400' : templateStyle.buttonBg, 'px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center space-x-1 shadow']"
                                    >
                                        <Gift class="w-3.5 h-3.5 mr-1" />
                                        <span>{{ item.is_reserved ? 'Ter-reservasi' : 'Reservasi Kado' }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- COMPONENT: RSVP FORM -->
        <section v-if="!customConfig || customConfig.components?.rsvp !== false" id="rsvp" class="py-28 px-6 pb-32">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">KONFIRMASI KEHADIRAN</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">RSVP &amp; Ucapan Selamat</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <div class="grid lg:grid-cols-2 gap-12 items-start">
                    <div :class="templateStyle.cardBg" class="gsap-scale-up p-8 shadow-xl">
                        <h3 class="font-serif text-xl font-bold text-white mb-6 flex items-center">
                            <UserCheck :class="templateStyle.iconColor" class="w-5 h-5 mr-2" />
                            <span>Form Kehadiran</span>
                        </h3>

                        <form @submit.prevent="submitRSVP" class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Nama Lengkap</label>
                                <input v-model="rsvpForm.name" type="text" required placeholder="Masukkan nama Anda" class="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none" />
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Konfirmasi Kehadiran</label>
                                <select v-model="rsvpForm.status" class="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none">
                                    <option value="hadir">Hadir</option>
                                    <option value="ragu">Ragu-ragu</option>
                                    <option value="tidak">Tidak Dapat Hadir</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Pesan &amp; Doa Restu</label>
                                <textarea v-model="rsvpForm.message" rows="4" required placeholder="Tuliskan ucapan dan doa hangat Anda..." class="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none"></textarea>
                            </div>

                            <button type="submit" :disabled="isSubmittingRSVP" :class="templateStyle.buttonBg" class="w-full font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-2">
                                <Send class="w-4 h-4" />
                                <span>{{ isSubmittingRSVP ? 'Mengirimkan...' : 'Kirim Ucapan & RSVP' }}</span>
                            </button>

                            <p v-if="rsvpSubmitted" class="text-center text-xs font-bold text-green-400 mt-2">
                                Terima kasih! Ucapan Anda telah berhasil terkirim.
                            </p>
                        </form>
                    </div>

                    <div class="gsap-fade-up space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        <h3 class="font-serif text-xl font-bold text-white mb-6 flex items-center">
                            <MessageSquare :class="templateStyle.iconColor" class="w-5 h-5 mr-2" />
                            <span>Ucapan dari Sahabat ({{ wishesList.length }})</span>
                        </h3>

                        <div v-for="(wish, index) in wishesList" :key="index" :class="templateStyle.cardBg" class="p-5 shadow-md">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-sm text-white">{{ wish.name }}</h4>
                                <span :class="templateStyle.accentBg" class="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">{{ wish.status }}</span>
                            </div>
                            <p class="text-xs text-gray-300 leading-relaxed italic">"{{ wish.message }}"</p>
                            <span class="block text-[10px] text-gray-500 mt-3 text-right">{{ wish.date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="py-12 px-6 bg-black/80 text-center border-t border-white/10 text-xs text-gray-400">
            <p class="font-serif text-lg text-white mb-2 font-bold">{{ customConfig?.groom?.nickname || 'Raden Arya' }} &amp; {{ customConfig?.bride?.nickname || 'Putri Sekar' }}</p>
            <p class="text-gray-500 mb-6">Terima kasih atas doa &amp; kehadiran Bapak/Ibu/Saudara/i sekalian.</p>
            <div :class="templateStyle.accentText" class="text-[11px] font-bold uppercase tracking-widest">
                Powered by {{ templateStyle.name }}
            </div>
        </footer>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

.font-script { font-family: 'Great Vibes', cursive; }
.font-serif { font-family: 'Cormorant Garamond', serif; }
.font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
</style>
