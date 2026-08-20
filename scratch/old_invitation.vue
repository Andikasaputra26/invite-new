<script setup>
import { ref, onMounted, onUnmounted, reactive, computed, nextTick } from 'vue';
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
    } else if (tId === 'boho-terracotta') {
        return {
            id: 'boho-terracotta',
            name: 'Terracotta Rustic Warmth',
            bgClass: 'bg-[#1c0f0a] text-[#fbf4ee]',
            coverBg: 'bg-[#140a07]',
            cardBg: 'bg-[#291710]/95 border-2 border-[#d97706]/40 rounded-3xl shadow-[0_15px_40px_rgba(217,119,6,0.18)]',
            accentText: 'text-[#f59e0b]',
            accentBorder: 'border-[#d97706]/40',
            accentBg: 'bg-[#d97706]/15',
            buttonBg: 'bg-gradient-to-r from-[#d97706] via-[#b45309] to-[#92400e] text-white font-extrabold shadow-lg shadow-[#d97706]/30 hover:scale-105',
            badgeBg: 'bg-[#d97706] text-white',
            iconColor: 'text-[#f59e0b]',
            heroTitleClass: 'font-serif text-5xl md:text-7xl font-bold tracking-tight text-amber-100 italic',
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
            heroTitleClass: 'font-sans text-5xl md:text-7xl font-light tracking-[0.2em] text-zinc-100 uppercase',
            photoFrameClass: 'rounded-none border border-zinc-500 shadow-2xl p-1 bg-zinc-900'
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

// Gallery Carousel & Gift Modal State
const activeGalleryIndex = ref(0);
const showBankModal = ref(true);

const allGalleryPhotos = computed(() => {
    if (heroPhotos && heroPhotos.length > 0) return heroPhotos;
    if (customConfig.value?.gallery?.photos && customConfig.value.gallery.photos.length > 0) {
        return customConfig.value.gallery.photos;
    }
    return [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
    ];
});

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
        ]
);

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
    nextTick(() => {
        ScrollTrigger.refresh();

        // Parallax background effect for Template 1
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

        // Fade Up Animation
        gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
            gsap.fromTo(el, 
                { y: 55, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1.1,
                    ease: 'power3.out'
                }
            );
        });

        // Fade Left Animation
        gsap.utils.toArray('.gsap-fade-left').forEach((el) => {
            gsap.fromTo(el, 
                { x: -60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse'
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1.1,
                    ease: 'power3.out'
                }
            );
        });

        // Fade Right Animation
        gsap.utils.toArray('.gsap-fade-right').forEach((el) => {
            gsap.fromTo(el, 
                { x: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse'
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1.1,
                    ease: 'power3.out'
                }
            );
        });

        // Scale Up Animation
        gsap.utils.toArray('.gsap-scale-up').forEach((el) => {
            gsap.fromTo(el, 
                { scale: 0.86, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse'
                    },
                    scale: 1,
                    opacity: 1,
                    duration: 1.1,
                    ease: 'back.out(1.6)'
                }
            );
        });
    });
};

const defaultMasterConfig = {
    templateId: 'midnight-gold',
    paletteId: 'gold',
    fontId: 'serif',
    groom: {
        name: 'Raden Arya Putra, S.T.',
        nickname: 'Arya',
        father: 'Bpk. Hendra Wijaya',
        mother: 'Ibu Ratna Wijaya',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
    },
    bride: {
        name: 'Putri Sekar Saraswati, S.Ked',
        nickname: 'Sekar',
        father: 'Bpk. Bambang Sudiro',
        mother: 'Ibu Rahayu Sudiro',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    },
    event: {
        date: '2026-08-24',
        locationCity: 'Jakarta Pusat',
        akadVenue: 'Masjid Agung Sunda Kelapa',
        akadTime: '08:00 WIB',
        venueName: 'Hotel Indonesia Kempinski (Bali Room)',
        resepsiTime: '11:00 - 14:00 WIB',
        address: 'Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat, DKI Jakarta 10310',
        mapsUrl: 'https://maps.google.com'
    },
    quote: {
        selectedPresetIndex: 0,
        customText: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.'
    },
    loveStories: [
        { year: '2020', title: 'Pertemuan Pertama', description: 'Pertama kali bertemu di bangku kuliah Universitas Indonesia.', bgImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80' },
        { year: '2023', title: 'Momen Lamaran', description: 'Arya meminang Sekar secara resmi di hadapan kedua keluarga besar.', bgImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80' },
        { year: '2026', title: 'Menuju Pernikahan', description: 'Mengikat janji suci pernikahan untuk sehidup semati.', bgImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' }
    ],
    gallery: {
        layout: 'grid',
        photos: [
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
        ]
    },
    gift: {
        bankName1: 'Bank Central Asia (BCA)',
        accountNo1: '8830912384',
        accountName1: 'Arya Putra',
        shippingAddress: 'Jl. Wijaya Kusuma No. 45, Kebayoran Baru, Jakarta Selatan (UP: Arya & Sekar)'
    },
    components: {
        music: true,
        countdown: true,
        story: true,
        gallery: true,
        gift: true,
        rsvp: true
    }
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
    // CRITICAL: Only load customized customer invitation if an explicit customer invitation ID is provided in query params or props!
    if (invitationId) {
        stored = localStorage.getItem(`customer_invitation_${invitationId}`) || localStorage.getItem('customInvitationData');
    }

    if (stored && invitationId) {
        try {
            customConfig.value = JSON.parse(stored);
        } catch(e) {
            console.error('Failed parsing custom config:', e);
            customConfig.value = JSON.parse(JSON.stringify(defaultMasterConfig));
        }
    } else {
        // Pure Master Demo Preview: Use default master config object
        customConfig.value = JSON.parse(JSON.stringify(defaultMasterConfig));
    }

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

        <div id="envelope-cover" class="fixed inset-0 z-50 flex flex-col justify-between items-center px-6 py-10 md:py-14 text-center shadow-2xl overflow-hidden bg-slate-100">
            <!-- Full Height Couple Background Image (Beach Scene matching exact design) -->
            <img :src="customConfig?.background?.imageUrl || customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80'" 
                 class="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.97] contrast-[1.02] transition duration-700" />

            <!-- Soft Top & Bottom Vignette Overlay for High Legibility -->
            <div class="absolute inset-0 bg-gradient-to-b from-slate-200/80 via-transparent to-slate-900/65 pointer-events-none"></div>

            <!-- TOP SECTION: Wedding Invitation Header, Names & Date -->
            <div class="relative z-10 pt-4 md:pt-8 space-y-3 max-w-lg mx-auto">
                <p class="font-serif text-[#3f4b59] text-2xl md:text-3xl font-normal tracking-wide drop-shadow-sm">Wedding Invitation</p>
                
                <h1 class="font-serif text-4xl md:text-6xl font-extrabold text-[#2b3545] tracking-[0.08em] uppercase leading-[1.12] drop-shadow">
                    {{ customConfig?.groom?.nickname || 'AMANDA' }} &amp;<br />
                    {{ customConfig?.bride?.nickname || 'ADITYA' }}
                </h1>

                <p class="font-sans text-xs md:text-sm font-bold tracking-[0.25em] text-[#2b3545] uppercase pt-1">
                    {{ customConfig?.event?.date ? customConfig.event.date.toUpperCase() : 'SABTU, 30 JANUARI 2027' }}
                </p>
            </div>

            <!-- BOTTOM SECTION: Recipient & Dark Pill Open Button -->
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
        <button v-if="isOpen && (!customConfig || customConfig.components?.music !== false)" @click="toggleMusic" 
                :class="activeTemplateId === 'midnight-gold' ? 'bg-[#2c3746] border-white/20 text-white' : templateStyle.accentBorder + ' bg-black/80 text-white'" 
                class="fixed top-6 right-6 z-40 backdrop-blur border p-3 rounded-full shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center">
            <div :class="[activeTemplateId === 'midnight-gold' ? 'text-amber-300' : templateStyle.accentText, {'animate-spin': isPlayingMusic}]" style="animation-duration: 4s;">
                <Volume2 v-if="isPlayingMusic" class="w-5 h-5" />
                <VolumeX v-else class="w-5 h-5 opacity-50" />
            </div>
        </button>

        <!-- FLOATING MOBILE BOTTOM NAVIGATION DOCK -->
        <div v-if="isOpen" class="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
            <div :class="activeTemplateId === 'midnight-gold' ? 'bg-[#2c3746]/95 border-white/20' : templateStyle.accentBorder + ' bg-black/90'" 
                 class="backdrop-blur-xl border rounded-full px-5 py-2.5 shadow-2xl flex items-center space-x-6 text-white">
                <button @click="scrollToSection('hero')" :class="{'text-amber-300 font-bold': activeTabNav === 'hero'}" class="hover:text-amber-200 transition flex flex-col items-center">
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

        <!-- MAIN HERO SECTION FOR TEMPLATE 1 (midnight-gold) MATCHING USER SCREENSHOT DESIGN -->
        <section v-if="activeTemplateId === 'midnight-gold'" id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-6 md:p-12 overflow-hidden bg-[#f7f5f0]">
            <!-- Leaf Shadow Motif Overlay Top-Left -->
            <div class="absolute -top-10 -left-10 w-72 md:w-96 h-72 md:h-96 opacity-20 pointer-events-none mix-blend-multiply bg-contain bg-no-repeat bg-left-top" style="background-image: url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80')"></div>

            <div class="max-w-xl w-full mx-auto relative z-10 pt-8 pb-12">
                <!-- Subheader Script -->
                <p class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal mb-3">Menuju Hari Bahagia</p>

                <!-- Compact Countdown Line -->
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

                <!-- Center Landscape Photo Box -->
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

        <section v-else id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-6 overflow-hidden">
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

                <div v-if="activeTemplateId === 'rose-romance'" class="relative w-full max-w-xs md:max-w-sm mx-auto h-72 md:h-80 rounded-t-[140px] rounded-b-[40px] overflow-hidden border-4 border-[#f472b6]/50 shadow-[0_15px_40px_rgba(244,114,182,0.35)] my-6 group">
                    <div v-for="(photo, idx) in heroPhotos" :key="idx" 
                         :class="['absolute inset-0 transition-opacity duration-1000 ease-in-out', heroSlideIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0']">
                        <img :src="photo" class="w-full h-full object-cover" />
                        <div class="absolute inset-0 bg-gradient-to-t from-[#1f1318] via-transparent to-transparent opacity-60"></div>
                    </div>
                    
                    <button @click="prevHeroSlide" class="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#f472b6] text-white p-2 rounded-full backdrop-blur-md transition shadow-lg">
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button @click="nextHeroSlide" class="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-[#f472b6] text-white p-2 rounded-full backdrop-blur-md transition shadow-lg">
                        <ChevronRight class="w-4 h-4" />
                    </button>
                    
                    <div class="absolute bottom-3 inset-x-0 z-20 flex justify-center space-x-1.5">
                        <span v-for="(p, idx) in heroPhotos" :key="idx" @click="heroSlideIndex = idx"
                              :class="['h-2 rounded-full transition-all duration-300 cursor-pointer shadow', heroSlideIndex === idx ? 'w-6 bg-[#f472b6]' : 'w-2 bg-white/60']"></span>
                    </div>
                </div>

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

        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.quote !== false)" id="ayat" class="py-20 px-6 text-center relative bg-[#f7f5f0] border-t border-b border-[#2c3746]/15">
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

        <section v-else-if="!customConfig || customConfig.components?.quote !== false" id="ayat" class="py-24 px-6 text-center relative border-t border-b border-white/10">
            <div class="max-w-3xl mx-auto gsap-fade-up">
                <div :class="[templateStyle.accentBg, templateStyle.accentBorder]" class="w-14 h-14 rounded-full border flex items-center justify-center mx-auto mb-6">
                    <Heart :class="templateStyle.iconColor" class="w-7 h-7 fill-current" />
                </div>
                
                <p class="font-serif italic text-lg md:text-2xl text-white leading-relaxed mb-6">
                    "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...' }}"
                </p>
                <p :class="templateStyle.accentText" class="text-xs font-extrabold tracking-widest uppercase">KUTIPAN &amp; AYAT SUCI</p>
            </div>
        </section>

        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.mempelai !== false)" id="mempelai" class="py-24 px-6 relative overflow-hidden bg-[#f7f5f0]">
            <div class="max-w-3xl mx-auto text-center">
                <div class="mb-14 gsap-fade-up">
                    <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal">Bride and Groom</h2>
                </div>

                <div class="space-y-20">
                    
                    <div class="gsap-scale-up text-center max-w-md mx-auto">
                        <div class="w-full max-w-xs md:max-w-sm mx-auto aspect-[3/4] border-4 border-[#2c3746] shadow-xl overflow-hidden mb-5 bg-slate-200">
                            <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'" 
                                 class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                        </div>

                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-[#2c3746] mb-2">
                            {{ customConfig?.bride?.name || 'Amanda Putri' }}
                        </h3>
                        
                        <div class="mb-3">
                            <a :href="`https://instagram.com/${(customConfig?.bride?.instagram || 'amandaput').replace('@','')}`" target="_blank" class="inline-flex items-center space-x-2 bg-[#2c3746] hover:bg-[#1b232e] text-white text-xs font-medium px-4 py-2 rounded-md shadow transition">
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
                            <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'" 
                                 class="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02]" />
                        </div>

                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-[#2c3746] mb-2">
                            {{ customConfig?.groom?.name || 'Aditya Kusuma' }}
                        </h3>
                        
                        <div class="mb-3">
                            <a :href="`https://instagram.com/${(customConfig?.groom?.instagram || 'adityakusuma').replace('@','')}`" target="_blank" class="inline-flex items-center space-x-2 bg-[#2c3746] hover:bg-[#1b232e] text-white text-xs font-medium px-4 py-2 rounded-md shadow transition">
                                <Eye class="w-3.5 h-3.5" />
                                <span>{{ customConfig?.groom?.instagram || '@adityakusuma' }}</span>
                            </a>
                        </div>

                        <div class="flex items-center justify-center space-x-3 my-3 max-w-xs mx-auto text-[#2c3746]">
                            <div class="h-0.5 w-12 bg-[#2c3746]/60"></div>
                            <span class="text-xs font-bold uppercase tracking-wider">{{ customConfig?.groom?.orderText || 'Putra Pertama dari' }}</span>
                            <div class="h-0.5 w-12 bg-[#2c3746]/60"></div>
                        </div>

                        <p class="text-sm md:text-base text-[#4a5668] leading-relaxed max-w-xs mx-auto font-normal">
                            {{ customConfig?.groom?.father || 'Bapak Hendra Wijaya' }} dan {{ customConfig?.groom?.mother || 'Ibu Ratna Wijaya' }}
                        </p>
                    </div>

                </div>
            </div>
        </section>

        <!-- COMPONENT: MEMPELAI / COUPLE SECTION FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.mempelai !== false" id="mempelai" class="py-28 px-6 relative overflow-hidden">
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
        <section v-if="activeTemplateId !== 'midnight-gold' && (!customConfig || customConfig.components?.countdown !== false)" class="py-20 px-6 text-center border-t border-b border-white/10 relative overflow-hidden">
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

        <!-- COMPONENT: RANGKAIAN ACARA (EVENT & LOCATION) FOR TEMPLATE 1 (midnight-gold) MATCHING USER SCREENSHOT DESIGN -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.acara !== false)" id="acara" class="py-24 px-6 relative overflow-hidden bg-[#f7f5f0]">
            <div class="max-w-3xl mx-auto">
                <!-- Section Title -->
                <div class="text-center mb-16 gsap-fade-up">
                    <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal">Wedding Ceremonial</h2>
                </div>

                <div class="space-y-16">
                    
                    <!-- Row 1: Holy Matrimony (Photo Left, Text Right) -->
                    <div class="grid md:grid-cols-2 gap-8 items-center gsap-scale-up">
                        <!-- Left Photo Frame (Arch Top Left) -->
                        <div class="flex justify-center md:justify-end">
                            <div class="w-48 md:w-56 aspect-[3/4] rounded-tl-[120px] rounded-br-[20px] overflow-hidden shadow-2xl bg-slate-200 border-2 border-white">
                                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover filter brightness-[0.98]" />
                            </div>
                        </div>

                        <!-- Right Event Details -->
                        <div class="text-center md:text-left space-y-3">
                            <h3 class="font-serif text-xl md:text-2xl font-bold text-[#2c3746] uppercase tracking-wider">HOLY MATRIMONY</h3>
                            
                            <!-- Date Block with Vertical Lines -->
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

                    <!-- Row 2: Reception (Text Left, Photo Right) -->
                    <div class="grid md:grid-cols-2 gap-8 items-center gsap-scale-up">
                        <!-- Left Event Details -->
                        <div class="text-center md:text-right space-y-3 order-2 md:order-1">
                            <h3 class="font-serif text-xl md:text-2xl font-bold text-[#2c3746] uppercase tracking-wider">RECEPTION</h3>
                            
                            <!-- Date Block with Vertical Lines -->
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

                        <!-- Right Photo Frame (Arch Top Right) -->
                        <div class="flex justify-center md:justify-start order-1 md:order-2">
                            <div class="w-48 md:w-56 aspect-[3/4] rounded-tr-[120px] rounded-bl-[20px] overflow-hidden shadow-2xl bg-slate-200 border-2 border-white">
                                <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80" class="w-full h-full object-cover filter brightness-[0.98]" />
                            </div>
                        </div>
                    </div>

                    <!-- Venue Name & Full Address Section -->
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
            </div>
        </section>

        <!-- COMPONENT: RANGKAIAN ACARA (EVENT & LOCATION) FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.acara !== false" id="acara" class="py-28 px-6 relative overflow-hidden">
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

        <!-- COMPONENT: LOVE STORY FOR TEMPLATE 1 (midnight-gold) MATCHING USER SCREENSHOT DESIGN -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.story !== false)" id="story" class="py-24 px-6 relative overflow-hidden bg-[#f7f5f0]">
            <!-- Dynamic Background Photo Overlay with Soft Vignette -->
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.92] contrast-[1.02] pointer-events-none transition-all duration-700 opacity-40 mix-blend-multiply" 
                 :style="{ backgroundImage: `url('${customConfig?.loveStories?.[0]?.bgImage || heroPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#f7f5f0]/90 via-[#f7f5f0]/80 to-[#f7f5f0]/95 pointer-events-none"></div>

            <div class="max-w-xl mx-auto text-center relative z-10">
                <!-- Large Header Image Card with "Our love Journey" Overlay -->
                <div class="w-full max-w-lg mx-auto aspect-[16/9] rounded-2xl border-4 border-[#2c3746] shadow-2xl overflow-hidden mb-12 relative bg-slate-200 group hover:scale-[1.01] transition duration-500 gsap-scale-up">
                    <img :src="customConfig?.loveStories?.[0]?.bgImage || heroPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'" 
                         class="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05] group-hover:scale-105 transition-transform duration-700" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40 flex items-center justify-center">
                        <h2 class="font-script text-5xl md:text-7xl text-white font-normal drop-shadow-lg tracking-wide">Our love Journey</h2>
                    </div>
                </div>

                <!-- Story Items Centered & Stacked -->
                <div class="space-y-10 max-w-lg mx-auto">
                    <div v-for="(story, idx) in (customConfig?.loveStories || [
                        { year: '2020', title: 'Awal Bertemu', description: '2020 Kami bertemu di sebuah acara kampus. Meski hanya singkat, kami merasa saling tertarik dan saling ingin mengenal lebih lanjut satu sama lain. Sejak itu, kami mulai semakin dekat.' },
                        { year: '2022', title: 'Menjalin Kasih', description: '2022 Kami mulai berkencan dan membangun komitmen bersama untuk saling mendukung dalam suka dan duka.' },
                        { year: '2026', title: 'Hari Pernikahan', description: '2026 Mengikat janji suci pernikahan di hadapan keluarga dan sahabat tercinta.' }
                    ])" :key="idx" class="gsap-fade-up text-center space-y-2">
                        
                        <h3 class="font-serif text-2xl md:text-3xl font-bold text-[#2c3746] tracking-wide">
                            {{ story.title }} - {{ story.year }}
                        </h3>

                        <p class="text-xs md:text-sm text-[#4a5668] leading-relaxed max-w-md mx-auto font-normal">
                            {{ story.description }}
                        </p>

                    </div>
                </div>
            </div>
        </section>

        <!-- COMPONENT: LOVE STORY FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.story !== false" id="story" class="py-24 px-6 relative">
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

        <!-- COMPONENT: OUR GALLERY FOR TEMPLATE 1 (midnight-gold) MATCHING USER SCREENSHOT DESIGN -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.gallery !== false)" id="galeri" class="py-24 px-6 relative text-center overflow-hidden min-h-screen flex flex-col justify-center bg-[#f7f5f0]">
            <!-- Dynamic Background Photo with Soft Vignette Overlay matching full beach photo -->
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.9] contrast-[1.02] pointer-events-none transition-all duration-700" 
                 :style="{ backgroundImage: `url('${allGalleryPhotos[activeGalleryIndex] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#f7f5f0]/85 via-black/30 to-[#f7f5f0]/90 pointer-events-none"></div>

            <div class="max-w-xl mx-auto relative z-10">
                <!-- Section Title: Our Gallery -->
                <div class="mb-8 gsap-fade-up">
                    <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal drop-shadow-sm">Our Gallery</h2>
                </div>

                <!-- Main Display Portrait Carousel Frame -->
                <div class="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-[#2c3746] mb-4 group gsap-scale-up">
                    <img :src="allGalleryPhotos[activeGalleryIndex]" @click="activeLightbox = allGalleryPhotos[activeGalleryIndex]" class="w-full h-full object-cover transition-all duration-500 cursor-pointer" />
                    
                    <!-- Left Prev Arrow -->
                    <button @click.stop="prevGalleryPhoto" class="absolute left-3 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition shadow-lg cursor-pointer">
                        <ChevronLeft class="w-6 h-6" />
                    </button>

                    <!-- Right Next Arrow -->
                    <button @click.stop="nextGalleryPhoto" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition shadow-lg cursor-pointer">
                        <ChevronRight class="w-6 h-6" />
                    </button>
                </div>

                <!-- Thumbnails Strip below Main Frame -->
                <div class="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-w-md mx-auto gsap-fade-up">
                    <div v-for="(photo, idx) in allGalleryPhotos" :key="idx" 
                         @click="activeGalleryIndex = idx" 
                         :class="activeGalleryIndex === idx ? 'border-4 border-[#2c3746] scale-105 shadow-xl' : 'border-2 border-white/60 opacity-70 hover:opacity-100'" 
                         class="aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-slate-200 shadow">
                        <img :src="photo" class="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </section>

        <!-- COMPONENT: GALERI FOTO FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.gallery !== false" id="galeri" class="py-28 px-6">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-16 gsap-fade-up">
                    <span :class="templateStyle.accentText" class="text-xs font-extrabold tracking-[0.3em] uppercase">MOMEN INDAH</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Galeri Foto</h2>
                    <div :class="templateStyle.badgeBg" class="w-16 h-1 mx-auto mt-4 rounded-full"></div>
                </div>

                <!-- DEDICATED EDITORIAL MASONRY GRID FOR TEMPLATE 2 (rose-romance) -->
                <div v-if="activeTemplateId === 'rose-romance'" class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-left">
                    <div v-if="heroPhotos[0]" @click="activeLightbox = heroPhotos[0]" 
                         class="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl border-2 border-[#f472b6]/40 shadow-[0_15px_40px_rgba(244,114,182,0.25)] hover:border-[#f472b6] transition duration-500 cursor-pointer group bg-[#2a1720] min-h-[360px] md:min-h-[480px]">
                        <img :src="heroPhotos[0]" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div class="p-3.5 bg-[#f472b6] text-slate-950 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                                <Eye class="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div v-if="heroPhotos[1]" @click="activeLightbox = heroPhotos[1]" 
                         class="relative overflow-hidden rounded-2xl border-2 border-[#f472b6]/40 shadow-xl hover:border-[#f472b6] transition duration-500 cursor-pointer group bg-[#2a1720] h-56 md:h-[228px]">
                        <img :src="heroPhotos[1]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div class="p-3 bg-[#f472b6] text-slate-950 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                <Eye class="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div v-if="heroPhotos[2]" @click="activeLightbox = heroPhotos[2]" 
                         class="relative overflow-hidden rounded-2xl border-2 border-[#f472b6]/40 shadow-xl hover:border-[#f472b6] transition duration-500 cursor-pointer group bg-[#2a1720] h-56 md:h-[228px]">
                        <img :src="heroPhotos[2]" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <div class="p-3 bg-[#f472b6] text-slate-950 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                <Eye class="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- DEDICATED ARCHITECTURAL GRID FOR TEMPLATE 6 (minimalist-monochrome) -->
                <div v-else-if="activeTemplateId === 'minimalist-monochrome'" class="grid grid-cols-2 md:grid-cols-4 gap-3 text-left font-mono">
                    <div v-for="(img, idx) in (customConfig?.gallery?.photos || [
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80'
                    ])" :key="idx" @click="activeLightbox = img" class="gsap-scale-up aspect-[3/4] bg-zinc-900 border border-zinc-700 relative overflow-hidden cursor-pointer group">
                        <img :src="img" class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition duration-700" />
                        <div class="absolute bottom-2 left-2 z-10 bg-black/80 px-2 py-0.5 border border-zinc-700 text-[10px] text-zinc-300">
                            0{{ idx + 1 }} // PHOTO
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

        <!-- COMPONENT: LOVE GIFT FOR TEMPLATE 1 (midnight-gold) MATCHING USER SCREENSHOT DESIGN -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.gift !== false)" id="gift" class="py-24 px-6 text-center bg-[#f7f5f0] relative border-t border-[#2c3746]/10">
            <div class="max-w-xl mx-auto gsap-fade-up">
                <!-- Section Title: love Gift -->
                <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal mb-3">love Gift</h2>
                
                <!-- Subtitle Text -->
                <p class="text-xs md:text-sm text-[#4a5668] max-w-md mx-auto leading-relaxed font-normal mb-6">
                    Tanpa mengurangi rasa hormat, bagi tamu undangan yang ingin memberikan tanda kasih , dapat melalui virtual account atau E-wallet di bawah ini
                </p>

                <!-- Rekening Button -->
                <button @click="showBankModal = !showBankModal" class="bg-[#2c3746] hover:bg-[#1c2430] text-white text-xs font-medium px-6 py-2.5 rounded-lg shadow-md inline-flex items-center space-x-2 cursor-pointer transition mb-6">
                    <span>💳 Rekening</span>
                </button>

                <!-- Expandable Bank Card Details -->
                <transition name="fade">
                    <div v-if="showBankModal" class="max-w-md mx-auto bg-[#2c3746] p-6 text-white rounded-2xl shadow-xl text-left space-y-4 border border-white/20">
                        <div class="flex justify-between items-center pb-2 border-b border-white/10">
                            <span class="text-amber-300 font-bold text-base">{{ customConfig?.gift?.bankName1 || 'Bank Central Asia (BCA)' }}</span>
                            <span class="text-[10px] text-gray-300 font-mono">Transfer Bank</span>
                        </div>
                        <div>
                            <p class="text-[10px] text-gray-300 uppercase tracking-wider mb-0.5">Nomor Rekening:</p>
                            <p class="font-mono text-lg font-bold text-white tracking-widest">{{ customConfig?.gift?.accountNo1 || '8830192834' }}</p>
                            <p class="text-xs text-gray-300 mt-1">a.n. {{ customConfig?.gift?.accountName1 || 'Raden Arya Putra' }}</p>
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

        <!-- COMPONENT: AMPLOP DIGITAL FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.gift !== false" id="gift" class="py-24 px-6 text-center border-t border-b border-white/10">
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
            </div>
        </section>

        <!-- COMPONENT: LOVE WISHES & RSVP FORM FOR TEMPLATE 1 (midnight-gold) MATCHING USER SCREENSHOT DESIGN -->
        <section v-if="activeTemplateId === 'midnight-gold' && (!customConfig || customConfig.components?.rsvp !== false)" id="rsvp" class="py-24 px-6 pb-32 relative overflow-hidden bg-[#f7f5f0]">
            <!-- Dynamic Background Photo Overlay with Soft Vignette -->
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.92] contrast-[1.02] pointer-events-none transition-all duration-700 opacity-60 mix-blend-multiply" 
                 :style="{ backgroundImage: `url('${allGalleryPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#f7f5f0]/90 via-[#f7f5f0]/75 to-[#f7f5f0]/95 pointer-events-none"></div>

            <div class="max-w-xl mx-auto relative z-10">
                <!-- Title & Intro Paragraph -->
                <div class="text-center mb-10 gsap-fade-up">
                    <h2 class="font-script text-4xl md:text-6xl text-[#2c3746] font-normal mb-3 drop-shadow-sm">love Wishes</h2>
                    <p class="text-xs md:text-sm text-[#4a5668] max-w-lg mx-auto leading-relaxed font-normal">
                        Do'a restu keluarga, sahabat, serta rekan-rekan semua dipernikahan kami sudah sangat cukup sebagai hadiah, tetapi jika memberi merupakan tanda kasih, kami dengan senang hati menerimanya dan tentunya semakin melengkapi kebahagiaan kami
                    </p>
                </div>

                <!-- Upper Dark Navy Form Card -->
                <div class="max-w-md mx-auto bg-[#2c3746] p-6 md:p-8 rounded-3xl shadow-xl text-white mb-8 text-left gsap-scale-up border border-white/20">
                    <form @submit.prevent="submitRSVP" class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-white mb-1.5">Nama Tamu:</label>
                            <input v-model="rsvpForm.name" type="text" required placeholder="" 
                                   class="w-full bg-white text-[#2c3746] font-medium rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-white mb-1.5">Ucapan &amp; Doa:</label>
                            <textarea v-model="rsvpForm.message" rows="4" required placeholder="" 
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

                <!-- Lower Dark Navy Wishes Feed Container -->
                <div class="max-w-md mx-auto bg-[#2c3746] p-6 md:p-8 rounded-3xl shadow-xl text-white text-center gsap-fade-up border border-white/20">
                    <h3 class="font-serif text-lg md:text-xl font-bold text-white mb-3">Ucapan dan Doa Para Tamu</h3>
                    
                    <div class="mb-6">
                        <span class="bg-[#e67e22] text-white text-xs font-bold px-4 py-1.5 rounded-xl inline-block shadow">
                            Jumlah: {{ wishesList.length }} Ucapan
                        </span>
                    </div>

                    <!-- Scrollable Feed -->
                    <div class="max-h-[380px] overflow-y-auto space-y-4 pr-1 text-left custom-scrollbar">
                        <div v-for="(wish, index) in wishesList" :key="index" class="bg-[#202936] border border-white/10 p-4 rounded-2xl shadow-inner">
                            <h4 class="font-bold text-sm text-white mb-1">{{ wish.name }}</h4>
                            <p class="text-xs text-slate-200 leading-relaxed">{{ wish.message || wish.text }}</p>
                            <span class="text-[10px] text-slate-400 font-medium block mt-2">{{ wish.date || '5 menit yang lalu' }}</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <!-- COMPONENT: RSVP FORM FOR OTHER TEMPLATES -->
        <section v-else-if="!customConfig || customConfig.components?.rsvp !== false" id="rsvp" class="py-28 px-6 pb-32">
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
                            <p class="text-xs text-gray-300 leading-relaxed italic">"{{ wish.message || wish.text }}"</p>
                            <span class="block text-[10px] text-gray-500 mt-3 text-right">{{ wish.date || wish.time }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER FOR TEMPLATE 1 (midnight-gold) MATCHING USER SCREENSHOT DESIGN -->
        <footer v-if="activeTemplateId === 'midnight-gold'" class="relative min-h-screen flex flex-col justify-between items-center text-center p-8 overflow-hidden bg-slate-900">
            <!-- Full-bleed Couple Background Photo with Dark Vignette Gradient -->
            <div class="absolute inset-0 bg-cover bg-center filter brightness-[0.75] contrast-[1.05] pointer-events-none" 
                 :style="{ backgroundImage: `url('${customConfig?.bride?.photo || heroPhotos[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'}')` }"></div>
            <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 pointer-events-none"></div>

            <!-- Top Header & Names -->
            <div class="relative z-10 pt-16 md:pt-24 space-y-4 max-w-xl mx-auto gsap-fade-up">
                <p class="font-script text-4xl md:text-6xl text-white font-normal drop-shadow-md">Thankyou</p>
                
                <h2 class="font-serif text-3xl md:text-5xl font-extrabold text-white uppercase tracking-[0.2em] leading-tight drop-shadow-xl">
                    {{ customConfig?.bride?.nickname || 'AMANDA' }} &amp;<br />
                    {{ customConfig?.groom?.nickname || 'ADITYA' }}
                </h2>
            </div>

            <!-- Bottom Powered By Badge -->
            <div class="relative z-10 pb-8 text-[11px] font-bold uppercase tracking-widest text-white/70 drop-shadow">
                Powered by {{ templateStyle.name }}
            </div>
        </footer>

        <!-- FOOTER FOR OTHER TEMPLATES -->
        <footer v-else class="py-12 px-6 bg-black/80 text-center border-t border-white/10 text-xs text-gray-400">
            <p class="font-serif text-lg text-white mb-2 font-bold">{{ customConfig?.groom?.nickname || 'Raden Arya' }} &amp; {{ customConfig?.bride?.nickname || 'Putri Sekar' }}</p>
            <p class="text-gray-500 mb-6">Terima kasih atas doa &amp; kehadiran Bapak/Ibu/Saudara/i sekalian.</p>
            <div :class="templateStyle.accentText" class="text-[11px] font-bold uppercase tracking-widest">
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
</style>
