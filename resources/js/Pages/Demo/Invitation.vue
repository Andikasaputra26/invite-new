<script setup>
import { ref, onMounted, onUnmounted, reactive, computed, watch, nextTick } from 'vue';
import { Head } from '@inertiajs/vue3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Heart, Calendar, MapPin, Clock, Volume2, VolumeX, 
    Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    ChevronDown, ChevronLeft, ChevronRight, UserCheck, Eye, Compass, Image as ImageIcon,
    Flower2, Shield, Leaf, Diamond, Crown, Star, Mail, Facebook, Instagram, Mouse,
    Gift as GiftIcon, CreditCard, User
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
    const rawDate = customConfig.value?.event?.date || '2026-09-15';
    const title = encodeURIComponent((customConfig.value?.groom?.nickname || 'Galuh') + ' & ' + (customConfig.value?.bride?.nickname || 'Puspa') + ' Wedding');
    const venue = encodeURIComponent(customConfig.value?.event?.venueName || customConfig.value?.event?.venue || 'Serenade Green Garden');
    const details = encodeURIComponent('Undangan Pernikahan Digital');
    const startDate = rawDate.replace(/-/g, '') + 'T080000Z';
    const endDate = rawDate.replace(/-/g, '') + 'T120000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${venue}`;
});

// Hero Slider State for Template 2 (serenade-green / rose-romance)
const heroSlideIndex = ref(0);
let heroSlideTimer = null;

const heroPhotos = computed(() => {
    if (customConfig.value?.gallery?.photos?.length) {
        return customConfig.value.gallery.photos;
    }
    return [
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
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
    if (tId === 'rose-romance' || tId === 'serenade-green') {
        return {
            id: 'rose-romance',
            name: 'Serenade Green',
            bgClass: 'bg-[#e2e8db] text-[#3d4a34]',
            coverBg: 'bg-[#48553d]',
            cardBg: 'bg-[#637454] border-[#8a9e79]/40 rounded-tr-[40px] rounded-tl-2xl rounded-b-2xl shadow-[0_15px_40px_rgba(40,50,30,0.3)]',
            accentText: 'text-[#e2ebda]',
            accentBorder: 'border-[#8a9e79]/50',
            accentBg: 'bg-[#4e5d41]/60',
            buttonBg: 'bg-gradient-to-r from-[#5a6b4c] via-[#4e5c41] to-[#3f4b34] text-white shadow-lg hover:scale-105',
            badgeBg: 'bg-[#637454] text-white',
            iconColor: 'text-emerald-200',
            heroTitleClass: 'font-serif text-4xl sm:text-5xl md:text-7xl font-normal text-[#f4f7f1] tracking-wide',
            photoFrameClass: 'rounded-tr-[70px] border-4 border-[#8a9e79]/50 shadow-2xl p-1 bg-[#4e5d41]'
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
    const rawDateStr = customConfig.value?.event?.date || '2026-09-15';
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
    { name: 'gjhg', text: 'dgf', status: 'Hadir', date: '14 hours, 1 min ago' },
    { name: 'tes', text: 'gfhg', status: 'Hadir', date: '14 hours, 12 mins ago' },
    { name: 'jhgj', text: 'jghjg', status: 'Hadir', date: '21 hours, 39 mins ago' }
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
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        gsap.utils.toArray('.gsap-scale-up').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        gsap.utils.toArray('.gsap-slide-left').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, x: -60 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        gsap.utils.toArray('.gsap-slide-right').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, x: 60 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        gsap.utils.toArray('.gsap-rotate-in').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, scale: 0.6, rotation: -20 },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 1.1,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
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
        monogram: 'GP',
        paletteId: 'sage',
        fontId: 'serif',
        components: { music: true, quote: true, mempelai: true, acara: true, countdown: true, story: true, gallery: true, gift: true, rsvp: true },
        groom: {
            name: 'Aria Galuh Arandaka',
            nickname: 'Galuh',
            father: 'Bpk. (Alm)',
            mother: 'Ibu Sri Rahayu Intan Bayduri',
            orderText: 'Putra Tunggal dari',
            instagram: '@aria_galuh',
            facebook: 'aria.galuh',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
        },
        bride: {
            name: 'Puspa Rema',
            nickname: 'Puspa',
            father: 'Bapak Andi Sugandi',
            mother: 'Ibu Rosiah (Alm)',
            orderText: 'Putri Keempat dari',
            instagram: '@pusparema',
            facebook: 'puspa.rema',
            photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        },
        quote: {
            customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir.'
        },
        event: {
            date: '2024-01-21',
            akadTime: 'Pukul 10.00 s.d 12.00 WIB',
            akadVenue: 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)',
            resepsiTime: 'Pukul 12.00 s.d 21.00 WIB',
            venueName: 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)',
            locationCity: 'Jakarta Pusat',
            address: 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)',
            mapsUrl: 'https://maps.google.com'
        },
        loveStories: [
            { year: '2016', description: 'Kita dipertemukan setelah lulus dari SMA dan menjalin komitmen untuk masa depan.', bgImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
            { year: 'Januari 2023', description: 'Dengan izin Allah SWT dan restu dari kedua keluarga. Saya berniat untuk melamar dan memintanya untuk menikah dengan saya.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
            { year: 'Januari 2024', title: 'Akad Nikah', description: 'Hingga diputuskanlah Akad nikah pada tanggal 3 Juni 2023.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
        ],
        gallery: {
            photos: [
                'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80'
            ]
        },
        gift: {
            bankName1: 'Bank BCA',
            accountNo1: '0123456789',
            accountName1: 'Puspa Rema',
            bankName2: 'DANA',
            accountNo2: '081234567890',
            accountName2: 'Puspa Rema',
            shippingAddress: 'Jl. Cinta Gg. Damai No. 001'
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

    // 4. Default Fallback: Use the SPECIFIC preset for this template slug
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
    <Head :title="`Undangan Pernikahan (${templateStyle.name}) - ${customConfig?.groom?.nickname || 'Galuh'} & ${customConfig?.bride?.nickname || 'Puspa'}`" />

    <audio ref="audioRef" loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113064.mp3" type="audio/mpeg" />
    </audio>

    <div :class="[templateStyle.bgClass, {'h-screen overflow-hidden': !isOpen}]" class="font-sans min-h-screen relative overflow-x-hidden transition-colors duration-700">
        
        <div v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.background?.useImage !== false)" class="parallax-bg fixed -inset-x-0 -top-[15vh] h-[135vh] w-full bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none z-0 filter brightness-90 saturate-125 transition duration-700" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80'})` }"></div>
        <div v-if="activeTemplateId === 'midnight-gold'" class="fixed inset-0 bg-gradient-to-b from-[#061811]/90 via-[#061811]/75 to-[#092219]/95 z-0 pointer-events-none"></div>

        <!-- ENVELOPE COVER (RESPONSIVE MATCHING USER DESIGN) -->
        <div id="envelope-cover" class="fixed inset-0 z-50 flex flex-col justify-between items-center px-4 sm:px-6 py-8 sm:py-10 md:py-14 text-center shadow-2xl overflow-y-auto bg-slate-900">
            <img :src="customConfig?.background?.imageUrl || customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80'" 
                 class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.95] contrast-[1.02] transition duration-700" />

            <div v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" class="absolute inset-0 bg-gradient-to-b from-black/20 via-[#49573e]/50 to-[#3b4732]/95 pointer-events-none"></div>
            <div v-else class="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-950/90 pointer-events-none"></div>

            <div class="relative z-10 pt-4 sm:pt-6 md:pt-10 space-y-2 sm:space-y-3 max-w-lg mx-auto w-full">
                <p class="font-serif text-amber-100/90 text-xs sm:text-sm md:text-base font-medium tracking-[0.25em] uppercase drop-shadow">THE WEDDING OF</p>
                
                <h1 class="font-serif text-4xl sm:text-5xl md:text-7xl font-normal text-white tracking-wide leading-tight drop-shadow-lg break-words px-2">
                    {{ customConfig?.groom?.nickname || 'Galuh' }} &amp; {{ customConfig?.bride?.nickname || 'Puspa' }}
                </h1>
            </div>

            <div class="relative z-10 pb-6 sm:pb-8 md:pb-12 space-y-3.5 max-w-sm mx-auto w-full flex flex-col items-center">
                <div class="text-center text-white drop-shadow px-2 space-y-1">
                    <p class="font-serif italic text-xs sm:text-sm text-amber-100/90">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                    <h3 class="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide break-words">
                        {{ props.guestName || 'Nama Tamu' }}
                    </h3>
                    <p class="text-[10px] italic text-amber-100/70 pt-1">
                        *Mohon maaf apabila ada kesalahan pada penulisan nama dan gelar
                    </p>
                </div>

                <button @click="openInvitation" class="mt-3 bg-[#4e5d41]/90 hover:bg-[#3d4a32] active:scale-95 text-white font-medium text-xs sm:text-sm px-7 py-3 rounded-full shadow-2xl transition duration-300 flex items-center justify-center space-x-2 cursor-pointer border border-white/30 backdrop-blur-md">
                    <span>[</span>
                    <Mail class="w-4 h-4 text-amber-200" />
                    <span class="tracking-wide">Open Invitation</span>
                    <span>]</span>
                </button>
            </div>
        </div>

        <!-- FLOATING MUSIC CONTROLLER & MOUSE SCROLL INDICATOR -->
        <div v-if="isOpen" class="fixed top-4 right-4 sm:top-6 sm:right-6 z-40 flex flex-col space-y-2">
            <button @click="toggleMusic" 
                    class="bg-[#4e5d41]/95 text-white border border-white/30 p-2.5 sm:p-3 rounded-full shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center backdrop-blur-md">
                <Volume2 v-if="isPlayingMusic" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-spin" style="animation-duration: 4s;" />
                <VolumeX v-else class="w-4 h-4 sm:w-5 sm:h-5 opacity-60" />
            </button>
        </div>

        <!-- FLOATING MOBILE BOTTOM NAVIGATION DOCK -->
        <div v-if="isOpen" class="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 flex justify-center px-3 sm:px-4">
            <div class="bg-[#637454]/95 border border-white/30 backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 shadow-2xl flex items-center space-x-3 sm:space-x-5 text-white max-w-full overflow-x-auto scrollbar-none">
                <button @click="scrollToSection('hero')" :class="{'bg-white text-[#4e5d41] font-bold': activeTabNav === 'hero'}" class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center shrink-0">
                    <Sparkles class="w-4 h-4" />
                </button>
                <button v-if="!customConfig || customConfig.components?.mempelai !== false" @click="scrollToSection('mempelai')" :class="{'bg-white text-[#4e5d41]': activeTabNav === 'mempelai'}" class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center shrink-0">
                    <Heart class="w-4 h-4" />
                </button>
                <button v-if="!customConfig || customConfig.components?.acara !== false" @click="scrollToSection('acara')" :class="{'bg-white text-[#4e5d41]': activeTabNav === 'acara'}" class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center shrink-0">
                    <Calendar class="w-4 h-4" />
                </button>
                <button v-if="!customConfig || customConfig.components?.gallery !== false" @click="scrollToSection('galeri')" :class="{'bg-white text-[#4e5d41]': activeTabNav === 'galeri'}" class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center shrink-0">
                    <ImageIcon class="w-4 h-4" />
                </button>
                <button v-if="!customConfig || customConfig.components?.gift !== false" @click="scrollToSection('gift')" :class="{'bg-white text-[#4e5d41]': activeTabNav === 'gift'}" class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center shrink-0">
                    <Gift class="w-4 h-4" />
                </button>
                <button v-if="!customConfig || customConfig.components?.rsvp !== false" @click="scrollToSection('rsvp')" :class="{'bg-white text-[#4e5d41]': activeTabNav === 'rsvp'}" class="p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center shrink-0">
                    <MessageSquare class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- MAIN HERO SECTION FOR TEMPLATE 1 (midnight-gold) -->
        <section v-if="activeTemplateId === 'midnight-gold'" id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-4 sm:p-6 md:p-12 overflow-hidden bg-[#f7f5f0]">
            <div class="absolute -top-10 -left-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 opacity-20 pointer-events-none mix-blend-multiply bg-contain bg-no-repeat bg-left-top" style="background-image: url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80')"></div>

            <div class="max-w-xl w-full mx-auto relative z-10 pt-6 sm:pt-8 pb-10 sm:pb-12">
                <p class="font-script text-3xl sm:text-4xl md:text-6xl text-[#2c3746] font-normal mb-2 sm:mb-3">Menuju Hari Bahagia</p>

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

        <!-- MAIN HERO SECTION FOR TEMPLATE 2 (SERENADE GREEN - MATCHING IMAGE 2 EXACTLY) -->
        <section v-else-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="hero" class="min-h-screen relative flex flex-col justify-end p-4 sm:p-6 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden z-0">
                <div class="flex h-full w-full transition-transform duration-1000 ease-in-out" :style="{ transform: `translateX(-${heroSlideIndex * 100}%)` }">
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

        <!-- MONOGRAM & QUOTE SECTION FOR SERENADE GREEN (MATCHING IMAGE 3) -->
        <section v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="ayat" class="relative">
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

        <!-- MEMPELAI SECTION FOR SERENADE GREEN (MATCHING IMAGE 4 & IMAGE 5 EXACTLY) -->
        <section v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="mempelai" class="py-12 sm:py-16 bg-white text-slate-900 px-4 sm:px-6">
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
                        
                        <div class="flex items-center space-x-2 pt-2">
                            <a href="#" class="w-8 h-8 rounded-lg bg-[#637454] text-white flex items-center justify-center hover:bg-[#4e5d41] transition">
                                <Facebook class="w-4 h-4" />
                            </a>
                            <a href="#" class="w-8 h-8 rounded-lg bg-[#637454] text-white flex items-center justify-center hover:bg-[#4e5d41] transition">
                                <Instagram class="w-4 h-4" />
                            </a>
                        </div>
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
                        
                        <div class="flex items-center justify-end space-x-2 pt-2">
                            <a href="#" class="w-8 h-8 rounded-lg bg-[#637454] text-white flex items-center justify-center hover:bg-[#4e5d41] transition">
                                <Facebook class="w-4 h-4" />
                            </a>
                            <a href="#" class="w-8 h-8 rounded-lg bg-[#637454] text-white flex items-center justify-center hover:bg-[#4e5d41] transition">
                                <Instagram class="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ACARA SECTION FOR SERENADE GREEN -->
        <section v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="acara" class="py-12 sm:py-16 bg-[#e2e8db] text-[#3d4a34] px-4 sm:px-6 border-t border-[#4e5d41]/20">
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
                        <img :src="heroPhotos[0] || 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover" />
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
                                    {{ customConfig?.event?.akadVenue || customConfig?.event?.address || 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)' }}
                                </p>
                            </div>

                            <div class="pt-1">
                                <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="inline-flex items-center space-x-2 bg-[#637454] hover:bg-[#4e5d41] text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow">
                                    <Compass class="w-4 h-4 text-amber-200" />
                                    <span>Google Maps Lokasi</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-3 gsap-slide-right">
                    <div class="w-full aspect-[16/10] rounded-tl-[60px] overflow-hidden bg-slate-300 border-2 border-[#637454] shadow-md">
                        <img :src="heroPhotos[1] || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover" />
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
                                    {{ customConfig?.event?.venueName || customConfig?.event?.address || 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)' }}
                                </p>
                            </div>

                            <div class="pt-1">
                                <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="inline-flex items-center space-x-2 bg-[#637454] hover:bg-[#4e5d41] text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow">
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

        <!-- OUR STORY TIMELINE FOR SERENADE GREEN -->
        <section v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="story" class="py-12 sm:py-16 bg-[#637454] text-white px-4 sm:px-6">
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
                                <p class="text-xs text-slate-700 leading-relaxed font-sans">
                                    {{ story.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- OUR MOMENT GALLERY FOR SERENADE GREEN -->
        <section v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="galeri" class="py-12 sm:py-16 bg-[#e2e8db] text-[#3d4a34] px-4 sm:px-6">
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

                    <div class="grid grid-cols-5 gap-2">
                        <div class="col-span-3 aspect-[4/3] rounded-lg overflow-hidden border border-white bg-slate-300 cursor-pointer" @click="activeLightbox = heroPhotos[0]">
                            <img :src="heroPhotos[0]" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        </div>
                        <div class="col-span-2 aspect-[3/4] rounded-lg overflow-hidden border border-white bg-slate-300 cursor-pointer" @click="activeLightbox = heroPhotos[1]">
                            <img :src="heroPhotos[1]" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- VIDEO PREWEDDING & WEDDING GIFT SECTION FOR SERENADE GREEN (MATCHING NEW IMAGE 1 & IMAGE 2) -->
        <section v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="gift" class="py-12 sm:py-16 bg-[#e2e8db] text-[#3d4a34] px-4 sm:px-6 border-t border-[#4e5d41]/20">
            <div class="max-w-lg mx-auto space-y-12">
                
                <!-- 1. Youtube Prewedding Video Embed -->
                <div class="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-[#637454] bg-slate-900 gsap-scale-up">
                    <iframe class="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Prewedding Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>

                <!-- 2. WEDDING Gift Header -->
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

                <!-- 3. Bank Cards Stack (Matching Image 1 & 2) -->
                <div class="space-y-4">
                    
                    <!-- Bank BCA Credit Card -->
                    <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 relative overflow-hidden space-y-4 text-left gsap-slide-left">
                        <div class="flex justify-between items-center">
                            <!-- Microchip Icon -->
                            <div class="w-11 h-8 rounded-md bg-amber-200 border border-amber-400/60 flex items-center justify-center shadow-inner">
                                <div class="w-8 h-5 border border-amber-500/40 rounded"></div>
                            </div>
                            <!-- BCA Logo -->
                            <span class="font-extrabold text-blue-800 text-lg sm:text-xl tracking-tighter flex items-center">
                                <span class="text-blue-600 mr-1">💳</span> BCA
                            </span>
                        </div>

                        <div class="space-y-1">
                            <p class="font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-800">
                                {{ customConfig?.gift?.accountNo1 || '0123456789' }}
                            </p>
                            <p class="text-xs font-bold text-slate-600 font-sans">
                                {{ customConfig?.gift?.accountName1 || 'Puspa Rema' }}
                            </p>
                        </div>

                        <div>
                            <button @click="copyToClipboard(customConfig?.gift?.accountNo1 || '0123456789', 'bank1')" class="bg-[#637454] hover:bg-[#4e5d41] text-white font-medium text-xs px-4 py-2 rounded-xl transition inline-flex items-center space-x-1.5 shadow">
                                <Copy class="w-3.5 h-3.5" />
                                <span>{{ copiedBank === 'bank1' ? 'Tersalin!' : 'Salin No. Rekening' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- DANA E-Wallet Card -->
                    <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 relative overflow-hidden space-y-4 text-left gsap-slide-right">
                        <div class="flex items-center space-x-2">
                            <span class="w-7 h-7 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">D</span>
                            <span class="font-extrabold text-blue-500 text-lg tracking-wider">DANA</span>
                        </div>

                        <div class="space-y-1">
                            <p class="font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-800">
                                {{ customConfig?.gift?.accountNo2 || '081234567890' }}
                            </p>
                            <p class="text-xs font-bold text-slate-600 font-sans">
                                {{ customConfig?.gift?.accountName2 || customConfig?.gift?.accountName1 || 'Puspa Rema' }}
                            </p>
                        </div>

                        <div>
                            <button @click="copyToClipboard(customConfig?.gift?.accountNo2 || '081234567890', 'bank2')" class="bg-[#637454] hover:bg-[#4e5d41] text-white font-medium text-xs px-4 py-2 rounded-xl transition inline-flex items-center space-x-1.5 shadow">
                                <Copy class="w-3.5 h-3.5" />
                                <span>{{ copiedBank === 'bank2' ? 'Tersalin!' : 'Salin Nomor' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Kirim Hadiah Card -->
                    <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 relative overflow-hidden space-y-3 text-left gsap-fade-up">
                        <div class="flex items-center space-x-2 text-[#4e5d41]">
                            <GiftIcon class="w-6 h-6" />
                            <span class="font-serif font-bold text-sm uppercase tracking-wider text-slate-900">KIRIM HADIAH</span>
                        </div>

                        <div class="space-y-1 text-xs text-slate-700 font-sans">
                            <p class="font-bold text-slate-900">{{ customConfig?.gift?.accountName1 || 'Puspa Rema' }}</p>
                            <p>Alamat : {{ customConfig?.gift?.shippingAddress || 'Jl. Batu Jajar RT3 RW1 (Samping MCD HAYAM WURUK)' }}</p>
                        </div>
                    </div>

                </div>

            </div>
        </section>

        <!-- UCAPAN & DOA SECTION FOR SERENADE GREEN (MATCHING NEW IMAGE 3) -->
        <section v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" id="rsvp" class="py-12 sm:py-16 bg-[#637454] text-white px-4 sm:px-6">
            <div class="max-w-lg mx-auto space-y-8">
                
                <!-- Section Title Header -->
                <div class="space-y-2 text-center gsap-fade-up">
                    <div class="flex items-center space-x-3 justify-center">
                        <div>
                            <span class="font-serif text-2xl sm:text-3xl font-extrabold text-white tracking-wider block">UCAPAN &amp; DOA</span>
                            <span class="font-script text-3xl sm:text-4xl text-amber-100 block -mt-3 ml-12">Wishes</span>
                        </div>
                    </div>
                    <p class="text-xs text-amber-100/90 font-sans">
                        Berikan ucapan terbaik untuk kedua mempelai
                    </p>
                </div>

                <!-- Inner Container (Matching Image 3) -->
                <div class="bg-[#e2e8db] text-slate-800 rounded-2xl p-5 sm:p-6 border border-white/60 shadow-xl space-y-5 text-left gsap-scale-up">
                    <div class="flex items-center space-x-2 font-serif font-bold text-sm text-[#4e5d41] border-b border-slate-300 pb-3">
                        <Mail class="w-4 h-4" />
                        <span>{{ wishesList.length }} Ucapan</span>
                    </div>

                    <!-- Form -->
                    <form @submit.prevent="submitRSVP" class="space-y-3">
                        <div>
                            <input v-model="rsvpForm.name" type="text" required placeholder="Nama Anda" 
                                   class="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#637454]" />
                        </div>

                        <div>
                            <textarea v-model="rsvpForm.message" rows="3" required placeholder="Berikan Ucapan & Doa" 
                                      class="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#637454]"></textarea>
                        </div>

                        <div>
                            <button type="submit" :disabled="isSubmittingRSVP" class="bg-[#4e5d41] hover:bg-[#3d4a32] text-white font-bold text-xs px-5 py-2 rounded-lg transition shadow cursor-pointer">
                                <span>{{ isSubmittingRSVP ? 'Mengirim...' : 'Kirim' }}</span>
                            </button>
                        </div>
                    </form>

                    <div class="h-[1px] bg-slate-300"></div>

                    <!-- Wishes Comments Feed List -->
                    <div class="space-y-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                        <div v-for="(wish, index) in wishesList" :key="index" class="flex items-start space-x-3 text-xs border-b border-slate-200/80 pb-3">
                            <div class="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center shrink-0 font-bold">
                                <User class="w-4 h-4" />
                            </div>
                            <div class="space-y-1">
                                <div class="font-bold text-slate-900 flex items-center space-x-2">
                                    <span>{{ wish.name }}</span>
                                </div>
                                <div class="text-[10px] text-slate-500">{{ wish.date || wish.time || '14 hours, 1 min ago' }}</div>
                                <p class="text-xs text-slate-700 leading-relaxed pt-0.5">{{ wish.message || wish.text }}</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>

        <!-- FOOTER & CLOSING FOR SERENADE GREEN (MATCHING NEW IMAGE 4) -->
        <footer v-if="activeTemplateId === 'rose-romance' || activeTemplateId === 'serenade-green'" class="bg-[#e2e8db] text-[#3d4a34] pt-12 pb-24 sm:pb-28 px-4 sm:px-6 relative text-center space-y-10 border-t border-[#4e5d41]/20">
            <div class="max-w-lg mx-auto space-y-8">
                
                <!-- 4 Photo Thumbnails -->
                <div class="grid grid-cols-4 gap-2 gsap-fade-up">
                    <div v-for="(photo, idx) in heroPhotos.slice(0, 4)" :key="idx" class="aspect-[3/4] rounded-lg overflow-hidden border border-white shadow">
                        <img :src="photo" class="w-full h-full object-cover" />
                    </div>
                </div>

                <!-- Thank You & Wassalamu'alaikum Text -->
                <div class="space-y-3 max-w-md mx-auto gsap-fade-up">
                    <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                        Atas kehadiran dan doa restu dari Bapak/Ibu/Saudara/i sekalian, kami mengucapkan Terima Kasih.
                    </p>
                    <h2 class="font-script text-3xl sm:text-4xl text-[#4e5d41] font-normal pt-2">
                        Wassalamu'alaikum Wr. Wb.
                    </h2>
                </div>

                <!-- Full Width Bottom Photo -->
                <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#637454] bg-slate-300 relative gsap-scale-up">
                    <img :src="heroPhotos[0]" class="w-full h-full object-cover" />
                </div>

                <!-- Floating Bottom White Card with Rounded Top-Right Corner (Matching Image 4) -->
                <div class="bg-white p-6 sm:p-8 rounded-tr-[50px] rounded-tl-xl rounded-b-xl shadow-2xl border border-slate-200 text-left space-y-1 gsap-slide-left">
                    <p class="font-serif italic text-xs sm:text-sm text-slate-500">Kami yang berbahagia</p>
                    <h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-[#4e5d41] tracking-wide">
                        {{ customConfig?.groom?.nickname || 'Galuh' }} &amp; {{ customConfig?.bride?.nickname || 'Puspa' }}
                    </h1>
                </div>

                <div class="text-[10px] font-bold uppercase tracking-widest text-[#4e5d41] pt-4">
                    Powered by Serenade Green
                </div>
            </div>
        </footer>

        <!-- FOOTER FOR OTHER TEMPLATES -->
        <footer v-else class="py-12 px-4 sm:px-6 bg-[#3b4732] text-center border-t border-white/10 text-xs text-slate-300">
            <p class="font-serif text-lg text-white mb-1 font-bold">{{ customConfig?.groom?.nickname || 'Galuh' }} &amp; {{ customConfig?.bride?.nickname || 'Puspa' }}</p>
            <p class="text-slate-400 mb-4">Terima kasih atas doa &amp; kehadiran Bapak/Ibu/Saudara/i sekalian.</p>
            <div class="text-[10px] font-bold uppercase tracking-widest text-amber-200">
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
