<script setup>
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Heart, Calendar, MapPin, Clock, Volume2, VolumeX, 
    Copy, Check, Gift, MessageSquare, Send, Sparkles, 
    ChevronDown, UserCheck, Eye, Compass, Image as ImageIcon
} from 'lucide-vue-next';

gsap.registerPlugin(ScrollTrigger);

// --- State ---
const isOpen = ref(false);
const isPlayingMusic = ref(false);
const audioRef = ref(null);
const copiedBank = ref(null);
const activeLightbox = ref(null);
const activeTabNav = ref('home');

// Custom Config from LocalStorage (Customer Customizer)
const customConfig = ref(null);

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
    
    // Play Background Audio
    playAudio();

    // GSAP Envelope opening timeline
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

    // Hero entrance
    tl.from('.hero-content > *', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out'
    }, '-=0.5');
};

// Play/Pause Audio
const playAudio = () => {
    if (audioRef.value && (!customConfig.value || customConfig.value.components?.music !== false)) {
        audioRef.value.play().then(() => {
            isPlayingMusic.value = true;
        }).catch(err => {
            console.log('Audio autoplay prevented or error:', err);
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

// Copy Bank Account
const copyToClipboard = (text, bankKey) => {
    navigator.clipboard.writeText(text);
    copiedBank.value = bankKey;
    setTimeout(() => {
        copiedBank.value = null;
    }, 2500);
};

// Submit RSVP
const submitRSVP = () => {
    if (!rsvpForm.name || !rsvpForm.message) return;
    isSubmittingRSVP.value = true;
    
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

        setTimeout(() => {
            rsvpSubmitted.value = false;
        }, 4000);
    }, 800);
};

// Smooth Scroll to Section
const scrollToSection = (id) => {
    activeTabNav.value = id;
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
};

// Initialize GSAP ScrollTrigger Animations
const initScrollAnimations = () => {
    gsap.utils.toArray('.gsap-fade-up').forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });

    gsap.utils.toArray('.gsap-scale-up').forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.1,
            ease: 'back.out(1.7)'
        });
    });
};

onMounted(() => {
    const params = new URLSearchParams(window.location.search);
    const invitationId = params.get('id');

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

    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
    ScrollTrigger.getAll().forEach(t => t.kill());
});
</script>

<template>
    <Head :title="`Undangan Pernikahan - ${customConfig?.groom?.nickname || 'Arya'} & ${customConfig?.bride?.nickname || 'Sekar'}`" />

    <!-- Audio BGM -->
    <audio ref="audioRef" loop preload="auto">
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113064.mp3" type="audio/mpeg" />
    </audio>

    <div :class="{'h-screen overflow-hidden': !isOpen}" class="bg-[#092219] text-[#f4efe6] font-sans min-h-screen relative overflow-x-hidden selection:bg-[#d4af37] selection:text-black">
        
        <!-- COVER ENVELOPE OVERLAY -->
        <div id="envelope-cover" class="fixed inset-0 z-50 bg-[#061811] flex flex-col justify-between items-center p-6 text-center shadow-2xl overflow-hidden">
            <div v-if="!customConfig || customConfig.background?.useImage !== false" class="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80'})` }"></div>
            <div class="pt-8 flex flex-col items-center z-10">
                <span class="text-[#d4af37] text-xs font-bold tracking-[0.3em] uppercase mb-2">WALIMATUL 'URSY</span>
                <div class="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent"></div>
            </div>

            <div class="max-w-md w-full bg-[#0d2f23]/80 backdrop-blur-md border border-[#d4af37]/30 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden group z-10">
                <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                
                <p class="text-[#d4af37] font-serif italic text-xl mb-1">The Wedding of</p>
                <h1 class="font-script text-5xl md:text-6xl font-normal text-white tracking-wide mb-6 leading-relaxed">
                    {{ customConfig?.groom?.nickname || 'Raden Arya' }} <br />
                    <span class="text-[#d4af37] font-serif italic text-3xl">&amp;</span> <br />
                    {{ customConfig?.bride?.nickname || 'Putri Sekar' }}
                </h1>

                <!-- Recipient Card Box -->
                <div class="w-full bg-[#051711] border border-[#d4af37]/20 rounded-2xl p-4 mb-8 text-center">
                    <p class="text-xs text-gray-400 mb-1">KEPADA YTH. BAPAK/IBU/SAUDARA/I:</p>
                    <h3 class="text-lg font-bold text-[#f4efe6] tracking-wide">Tamu Undangan Spesial</h3>
                    <p class="text-[10px] text-[#d4af37] mt-1 font-mono">Di Tempat</p>
                </div>

                <!-- Open Button -->
                <button @click="openInvitation" class="relative group/btn bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c5a059] text-[#092219] font-bold px-8 py-3.5 rounded-full shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 hover:scale-105 transition-all duration-300 flex items-center space-x-3 cursor-pointer">
                    <Sparkles class="w-5 h-5 text-[#092219] animate-spin" style="animation-duration: 8s;" />
                    <span class="tracking-wider text-sm font-extrabold uppercase">Buka Undangan</span>
                </button>
            </div>

            <div class="pb-6 text-xs text-gray-400 font-light z-10">
                <p>Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
            </div>
        </div>

        <!-- FLOATING MUSIC CONTROLLER -->
        <button v-if="isOpen && (!customConfig || customConfig.components?.music !== false)" @click="toggleMusic" class="fixed top-6 right-6 z-40 bg-[#0d2f23]/90 border border-[#d4af37]/40 text-[#d4af37] p-3 rounded-full shadow-xl hover:scale-110 transition-all cursor-pointer flex items-center justify-center">
            <div :class="{'animate-spin': isPlayingMusic}" style="animation-duration: 4s;" class="flex items-center justify-center">
                <Volume2 v-if="isPlayingMusic" class="w-5 h-5" />
                <VolumeX v-else class="w-5 h-5 opacity-50" />
            </div>
        </button>

        <!-- FLOATING MOBILE BOTTOM NAVIGATION DOCK -->
        <div v-if="isOpen" class="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4">
            <div class="bg-[#061811]/90 backdrop-blur-lg border border-[#d4af37]/30 rounded-full px-5 py-2.5 shadow-2xl flex items-center space-x-6 text-[#f4efe6]">
                <button @click="scrollToSection('hero')" :class="{'text-[#d4af37]': activeTabNav === 'hero'}" class="hover:text-[#d4af37] transition flex flex-col items-center">
                    <Sparkles class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Home</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.mempelai !== false" @click="scrollToSection('mempelai')" :class="{'text-[#d4af37]': activeTabNav === 'mempelai'}" class="hover:text-[#d4af37] transition flex flex-col items-center">
                    <Heart class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Mempelai</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.acara !== false" @click="scrollToSection('acara')" :class="{'text-[#d4af37]': activeTabNav === 'acara'}" class="hover:text-[#d4af37] transition flex flex-col items-center">
                    <Calendar class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Acara</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.gallery !== false" @click="scrollToSection('galeri')" :class="{'text-[#d4af37]': activeTabNav === 'galeri'}" class="hover:text-[#d4af37] transition flex flex-col items-center">
                    <ImageIcon class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">Galeri</span>
                </button>
                <button v-if="!customConfig || customConfig.components?.rsvp !== false" @click="scrollToSection('rsvp')" :class="{'text-[#d4af37]': activeTabNav === 'rsvp'}" class="hover:text-[#d4af37] transition flex flex-col items-center">
                    <MessageSquare class="w-4 h-4" />
                    <span class="text-[9px] font-bold mt-0.5 uppercase tracking-wider">RSVP</span>
                </button>
            </div>
        </div>

        <!-- MAIN HERO CONTENT -->
        <section id="hero" class="min-h-screen relative flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-[#061811]/90 via-[#092219]/80 to-[#0d2f23]/95 overflow-hidden">
            <div v-if="!customConfig || customConfig.background?.useImage !== false" class="absolute inset-0 bg-cover bg-center bg-fixed opacity-30 mix-blend-overlay pointer-events-none" :style="{ backgroundImage: `url(${customConfig?.background?.imageUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=80'})` }"></div>
            <div class="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

            <div class="hero-content max-w-2xl relative z-10 space-y-6 pt-12">
                <div class="inline-block px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold tracking-[0.25em] uppercase">
                    THE WEDDING INVITATION
                </div>
                
                <h1 class="font-script text-6xl md:text-8xl font-normal tracking-wide text-white leading-tight">
                    {{ customConfig?.groom?.nickname || 'Raden Arya' }} <br />
                    <span class="font-serif italic text-4xl md:text-6xl text-[#d4af37] font-normal">&amp;</span> <br />
                    {{ customConfig?.bride?.nickname || 'Putri Sekar' }}
                </h1>

                <p class="text-sm md:text-base text-gray-300 font-light max-w-md mx-auto leading-relaxed">
                    Kami mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada hari kebahagiaan kami.
                </p>

                <!-- Date Badge -->
                <div class="pt-4">
                    <div class="inline-flex items-center space-x-3 bg-[#051711] border border-[#d4af37]/30 px-6 py-3 rounded-2xl shadow-xl">
                        <Calendar class="w-5 h-5 text-[#d4af37]" />
                        <span class="text-sm font-bold tracking-widest uppercase text-[#f4efe6]">
                            {{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}
                        </span>
                    </div>
                </div>

                <div class="pt-12 flex justify-center">
                    <button @click="scrollToSection('ayat')" class="text-[#d4af37] animate-bounce hover:scale-125 transition">
                        <ChevronDown class="w-8 h-8" />
                    </button>
                </div>
            </div>
        </section>

        <!-- COMPONENT: QUOTE / AYAT SUCI -->
        <section v-if="!customConfig || customConfig.components?.quote !== false" id="ayat" class="py-24 px-6 bg-[#092219] text-center relative border-t border-b border-[#d4af37]/10">
            <div class="max-w-3xl mx-auto gsap-fade-up">
                <div class="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6 text-[#d4af37]">
                    <Heart class="w-6 h-6 fill-[#d4af37]" />
                </div>
                
                <p class="font-serif italic text-lg md:text-xl text-[#f4efe6] leading-relaxed mb-6">
                    "{{ customConfig?.quote?.customText || 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya...' }}"
                </p>
                <p class="text-xs font-bold tracking-widest text-[#d4af37] uppercase">KUTIPAN SUCI</p>
            </div>
        </section>

        <!-- COMPONENT: MEMPELAI / COUPLE SECTION -->
        <section v-if="!customConfig || customConfig.components?.mempelai !== false" id="mempelai" class="py-28 px-6 bg-gradient-to-b from-[#092219]/90 via-[#0b2b20]/80 to-[#092219]/95 relative overflow-hidden">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-16 gsap-fade-up">
                    <span class="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase">PASANGAN MEMPELAI</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Mempelai Pria &amp; Wanita</h2>
                    <div class="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4"></div>
                </div>

                <div class="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    <!-- Mempelai Pria -->
                    <div class="gsap-scale-up bg-[#051711] border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden group">
                        <div class="w-48 h-48 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#d4af37] via-transparent to-[#d4af37] mb-6 shadow-2xl relative">
                            <img :src="customConfig?.groom?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'" class="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 class="font-serif text-2xl font-bold text-white mb-2">{{ customConfig?.groom?.name || 'Raden Arya Kusuma, S.T.' }}</h3>
                        <p class="text-xs text-[#d4af37] font-semibold mb-4 tracking-wider uppercase">Mempelai Pria</p>
                        <p class="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto mb-6">
                            {{ customConfig?.groom?.orderText || 'Putra pertama dari' }} <br />
                            <strong class="text-white">{{ customConfig?.groom?.father || 'Bpk. Hj. Suryo Wijaya' }}</strong> <br />
                            &amp; <strong class="text-white">{{ customConfig?.groom?.mother || 'Ibu Hj. Endang Rahayu' }}</strong>
                        </p>
                        <a href="#" class="inline-flex items-center space-x-2 text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition">
                            <span>{{ customConfig?.groom?.instagram || '@aryawijaya' }}</span>
                        </a>
                    </div>

                    <!-- Mempelai Wanita -->
                    <div class="gsap-scale-up bg-[#051711] border border-[#d4af37]/20 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden group">
                        <div class="w-48 h-48 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#d4af37] via-transparent to-[#d4af37] mb-6 shadow-2xl relative">
                            <img :src="customConfig?.bride?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'" class="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 class="font-serif text-2xl font-bold text-white mb-2">{{ customConfig?.bride?.name || 'Putri Sekar Arum, S.Ked' }}</h3>
                        <p class="text-xs text-[#d4af37] font-semibold mb-4 tracking-wider uppercase">Mempelai Wanita</p>
                        <p class="text-xs text-gray-300 leading-relaxed max-w-xs mx-auto mb-6">
                            {{ customConfig?.bride?.orderText || 'Putri kedua dari' }} <br />
                            <strong class="text-white">{{ customConfig?.bride?.father || 'Bpk. Dr. H. Bambang Subroto' }}</strong> <br />
                            &amp; <strong class="text-white">{{ customConfig?.bride?.mother || 'Ibu Hj. Dewi Lestari' }}</strong>
                        </p>
                        <a href="#" class="inline-flex items-center space-x-2 text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-black transition">
                            <span>{{ customConfig?.bride?.instagram || '@sekararum' }}</span>
                        </a>
                    </div>

                </div>
            </div>
        </section>

        <!-- COMPONENT: COUNTDOWN TIMER -->
        <section v-if="!customConfig || customConfig.components?.countdown !== false" class="py-20 px-6 bg-[#061811]/90 text-center border-t border-b border-[#d4af37]/20 relative overflow-hidden">
            <div class="max-w-4xl mx-auto gsap-fade-up">
                <span class="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase">MENUNGGU HARI BAHAGIA</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-10">Hitung Mundur Acara</h2>

                <div class="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto mb-10">
                    <div class="bg-[#0d2f23] border border-[#d4af37]/30 rounded-2xl p-4 shadow-lg">
                        <div class="font-serif text-3xl md:text-5xl font-bold text-[#d4af37]">{{ countdown.days }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Hari</div>
                    </div>
                    <div class="bg-[#0d2f23] border border-[#d4af37]/30 rounded-2xl p-4 shadow-lg">
                        <div class="font-serif text-3xl md:text-5xl font-bold text-[#d4af37]">{{ countdown.hours }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Jam</div>
                    </div>
                    <div class="bg-[#0d2f23] border border-[#d4af37]/30 rounded-2xl p-4 shadow-lg">
                        <div class="font-serif text-3xl md:text-5xl font-bold text-[#d4af37]">{{ countdown.minutes }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Menit</div>
                    </div>
                    <div class="bg-[#0d2f23] border border-[#d4af37]/30 rounded-2xl p-4 shadow-lg">
                        <div class="font-serif text-3xl md:text-5xl font-bold text-[#d4af37]">{{ countdown.seconds }}</div>
                        <div class="text-[10px] md:text-xs text-gray-300 uppercase mt-1 font-semibold">Detik</div>
                    </div>
                </div>

                <a href="https://calendar.google.com" target="_blank" class="inline-flex items-center space-x-2 bg-[#d4af37] text-black font-bold text-xs uppercase px-6 py-3 rounded-full hover:bg-white transition shadow-lg">
                    <Calendar class="w-4 h-4" />
                    <span>Simpan ke Google Calendar</span>
                </a>
            </div>
        </section>

        <!-- COMPONENT: RANGKAIAN ACARA -->
        <section v-if="!customConfig || customConfig.components?.acara !== false" id="acara" class="py-28 px-6 bg-[#092219]/95 relative overflow-hidden">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-16 gsap-fade-up">
                    <span class="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase">JADWAL PERNIKAHAN</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Rangkaian Acara</h2>
                    <div class="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4"></div>
                </div>

                <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <!-- Akad Nikah -->
                    <div class="gsap-scale-up bg-[#051711] border border-[#d4af37]/30 rounded-3xl p-8 shadow-xl flex flex-col justify-between text-center relative overflow-hidden group">
                        <div>
                            <div class="w-12 h-12 bg-[#d4af37]/10 text-[#d4af37] rounded-2xl border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6">
                                <Sparkles class="w-6 h-6" />
                            </div>
                            <h3 class="font-serif text-2xl font-bold text-white mb-2">Akad Nikah</h3>
                            <p class="text-xs text-[#d4af37] font-semibold tracking-wider uppercase mb-6">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</p>

                            <div class="space-y-3 text-xs text-gray-300 mb-8">
                                <p class="flex items-center justify-center space-x-2">
                                    <Clock class="w-4 h-4 text-[#d4af37]" />
                                    <span>{{ customConfig?.event?.akadTime || 'Pukul 08.00 WIB - 10.00 WIB' }}</span>
                                </p>
                                <p class="flex items-start justify-center space-x-2">
                                    <MapPin class="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                                    <span class="text-left">
                                        <strong class="text-white block">{{ customConfig?.event?.akadVenue || 'Masjid Agung Trans Studio' }}</strong>
                                        <span class="text-[11px] text-slate-300 block mt-0.5">{{ customConfig?.event?.address || 'Jl. Jend. Gatot Subroto No.1, Jakarta Pusat' }}</span>
                                    </span>
                                </p>
                            </div>
                        </div>

                        <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="w-full bg-[#0d2f23] border border-[#d4af37]/40 text-[#d4af37] font-bold text-xs py-3 rounded-xl hover:bg-[#d4af37] hover:text-black transition flex items-center justify-center space-x-2">
                            <Compass class="w-4 h-4" />
                            <span>Petunjuk Lokasi Google Maps</span>
                        </a>
                    </div>

                    <!-- Resepsi -->
                    <div class="gsap-scale-up bg-[#051711] border border-[#d4af37]/30 rounded-3xl p-8 shadow-xl flex flex-col justify-between text-center relative overflow-hidden group">
                        <div>
                            <div class="w-12 h-12 bg-[#d4af37]/10 text-[#d4af37] rounded-2xl border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6">
                                <Heart class="w-6 h-6" />
                            </div>
                            <h3 class="font-serif text-2xl font-bold text-white mb-2">Resepsi Pernikahan</h3>
                            <p class="text-xs text-[#d4af37] font-semibold tracking-wider uppercase mb-6">{{ customConfig?.event?.date || 'Sabtu, 24 Agustus 2026' }}</p>

                            <div class="space-y-3 text-xs text-gray-300 mb-8">
                                <p class="flex items-center justify-center space-x-2">
                                    <Clock class="w-4 h-4 text-[#d4af37]" />
                                    <span>{{ customConfig?.event?.resepsiTime || 'Pukul 11.00 - 14.00 WIB' }}</span>
                                </p>
                                <p class="flex items-start justify-center space-x-2">
                                    <MapPin class="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                                    <span class="text-left">
                                        <strong class="text-white block">{{ customConfig?.event?.venueName || 'Gedung Serbaguna Senayan' }}</strong>
                                        <span class="text-[11px] text-slate-300 block mt-0.5">{{ customConfig?.event?.address || 'Jl. Jend. Gatot Subroto No.1, Jakarta Pusat' }}</span>
                                    </span>
                                </p>
                            </div>
                        </div>

                        <a :href="customConfig?.event?.mapsUrl || 'https://maps.google.com'" target="_blank" class="w-full bg-[#0d2f23] border border-[#d4af37]/40 text-[#d4af37] font-bold text-xs py-3 rounded-xl hover:bg-[#d4af37] hover:text-black transition flex items-center justify-center space-x-2">
                            <Compass class="w-4 h-4" />
                            <span>Petunjuk Lokasi Google Maps</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- COMPONENT: LOVE STORY -->
        <section v-if="!customConfig || customConfig.components?.story !== false" class="py-24 px-6 bg-[#061811] relative">
            <div class="max-w-3xl mx-auto">
                <div class="text-center mb-16 gsap-fade-up">
                    <span class="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase">PERJALANAN CINTA</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Kisah Cinta Kami</h2>
                    <div class="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4"></div>
                </div>

                <div class="relative border-l-2 border-[#d4af37]/30 ml-4 md:ml-32 space-y-12 pl-6 md:pl-10">
                    <div v-for="(story, idx) in (customConfig?.loveStories || [
                        { year: '2021', title: 'Awal Pertemuan', description: 'Kami pertama kali bertemu dalam sebuah kegiatan kampus.' },
                        { year: '2023', title: 'Lamaran Resmi', description: 'Arya melamar Sekar di hadapan keluarga besar.' },
                        { year: '2026', title: 'Hari Pernikahan', description: 'Hari bersejarah awal kehidupan pernikahan kami.' }
                    ])" :key="idx" class="gsap-fade-up relative group">
                        <div class="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#d4af37] border-4 border-[#061811]"></div>
                        <span class="text-xs font-bold text-[#d4af37] uppercase tracking-widest">{{ story.year }}</span>
                        <h4 class="font-serif text-xl font-bold text-white mt-1">{{ story.title }}</h4>
                        <p class="text-xs text-gray-300 mt-2 leading-relaxed">{{ story.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- COMPONENT: GALERI FOTO -->
        <section v-if="!customConfig || customConfig.components?.gallery !== false" id="galeri" class="py-28 px-6 bg-[#092219]">
            <div class="max-w-5xl mx-auto text-center">
                <div class="mb-16 gsap-fade-up">
                    <span class="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase">MOMEN INDAH</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">Galeri Foto</h2>
                    <div class="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4"></div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    <div v-for="(img, idx) in (customConfig?.gallery?.photos || [
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80'
                    ])" :key="idx" @click="activeLightbox = img" class="gsap-scale-up aspect-square rounded-2xl overflow-hidden cursor-pointer group relative border border-[#d4af37]/20">
                        <img :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-[#061811]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#d4af37]">
                            <Eye class="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- LIGHTBOX MODAL -->
        <div v-if="activeLightbox" @click="activeLightbox = null" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md cursor-pointer">
            <img :src="activeLightbox" class="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-[#d4af37]/40" />
        </div>

        <!-- COMPONENT: AMPLOP DIGITAL -->
        <section v-if="!customConfig || customConfig.components?.gift !== false" class="py-24 px-6 bg-[#061811] text-center border-t border-b border-[#d4af37]/20">
            <div class="max-w-3xl mx-auto gsap-fade-up">
                <div class="w-12 h-12 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-6 text-[#d4af37]">
                    <Gift class="w-6 h-6" />
                </div>
                <span class="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase">TANDA KASIH</span>
                <h2 class="font-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Amplop Digital &amp; Kado</h2>
                <p class="text-xs text-gray-300 max-w-md mx-auto mb-10 leading-relaxed">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan hadiah, Anda dapat menggunakan rekening di bawah ini:
                </p>

                <div class="grid md:grid-cols-2 gap-6 max-w-xl mx-auto">
                    <!-- Bank 1 -->
                    <div class="bg-[#051711] border border-[#d4af37]/30 rounded-2xl p-6 shadow-xl text-left relative overflow-hidden">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-lg font-bold text-[#d4af37]">{{ customConfig?.gift?.bankName1 || 'Bank BCA' }}</span>
                            <span class="text-[10px] text-gray-400 font-mono">Transfer Bank</span>
                        </div>
                        <p class="font-mono text-base font-bold text-white tracking-widest mb-1">{{ customConfig?.gift?.accountNo1 || '8830192834' }}</p>
                        <p class="text-xs text-gray-300 mb-4">a.n. {{ customConfig?.gift?.accountName1 || 'Raden Arya Wijaya' }}</p>
                        
                        <button @click="copyToClipboard(customConfig?.gift?.accountNo1 || '8830192834', 'bank1')" class="w-full bg-[#0d2f23] border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold py-2.5 rounded-xl hover:bg-[#d4af37] hover:text-black transition flex items-center justify-center space-x-2">
                            <Check v-if="copiedBank === 'bank1'" class="w-4 h-4 text-green-500" />
                            <Copy v-else class="w-4 h-4" />
                            <span>{{ copiedBank === 'bank1' ? 'Nomor Rekening Disalin!' : 'Salin Nomor Rekening' }}</span>
                        </button>
                    </div>

                    <!-- Physical Address -->
                    <div class="bg-[#051711] border border-[#d4af37]/30 rounded-2xl p-6 shadow-xl text-left relative overflow-hidden">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-lg font-bold text-[#d4af37]">Kirim Kado Fisik</span>
                            <Gift class="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <p class="text-xs text-slate-300 mb-4 leading-relaxed">{{ customConfig?.gift?.shippingAddress || 'Jl. Wijaya Kusuma No. 45, Kebayoran Baru, Jakarta Selatan' }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- COMPONENT: RSVP & BUKU TAMU -->
        <section v-if="!customConfig || customConfig.components?.rsvp !== false" id="rsvp" class="py-28 px-6 bg-[#092219] pb-32">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-16 gsap-fade-up">
                    <span class="text-xs font-bold text-[#d4af37] tracking-[0.3em] uppercase">KONFIRMASI KEHADIRAN</span>
                    <h2 class="font-serif text-3xl md:text-5xl font-bold text-white mt-2">RSVP &amp; Ucapan Selamat</h2>
                    <div class="w-16 h-0.5 bg-[#d4af37] mx-auto mt-4"></div>
                </div>

                <div class="grid lg:grid-cols-2 gap-12 items-start">
                    <div class="gsap-scale-up bg-[#051711] border border-[#d4af37]/30 rounded-3xl p-8 shadow-xl">
                        <h3 class="font-serif text-xl font-bold text-white mb-6 flex items-center">
                            <UserCheck class="w-5 h-5 text-[#d4af37] mr-2" />
                            <span>Form Kehadiran</span>
                        </h3>

                        <form @submit.prevent="submitRSVP" class="space-y-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Nama Lengkap</label>
                                <input v-model="rsvpForm.name" type="text" required placeholder="Masukkan nama Anda" class="w-full bg-[#0d2f23] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]" />
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Konfirmasi Kehadiran</label>
                                <select v-model="rsvpForm.status" class="w-full bg-[#0d2f23] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37]">
                                    <option value="hadir">Hadir</option>
                                    <option value="ragu">Ragu-ragu</option>
                                    <option value="tidak">Tidak Dapat Hadir</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Pesan &amp; Doa Restu</label>
                                <textarea v-model="rsvpForm.message" rows="4" required placeholder="Tuliskan ucapan dan doa hangat Anda..." class="w-full bg-[#0d2f23] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"></textarea>
                            </div>

                            <button type="submit" :disabled="isSubmittingRSVP" class="w-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#c5a059] text-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:scale-105 transition shadow-lg flex items-center justify-center space-x-2">
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
                            <MessageSquare class="w-5 h-5 text-[#d4af37] mr-2" />
                            <span>Ucapan dari Sahabat ({{ wishesList.length }})</span>
                        </h3>

                        <div v-for="(wish, index) in wishesList" :key="index" class="bg-[#051711] border border-[#d4af37]/20 rounded-2xl p-5 shadow-md">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-sm text-white">{{ wish.name }}</h4>
                                <span class="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-2.5 py-0.5 rounded-full font-bold uppercase">{{ wish.status }}</span>
                            </div>
                            <p class="text-xs text-gray-300 leading-relaxed italic">"{{ wish.message }}"</p>
                            <span class="block text-[10px] text-gray-500 mt-3 text-right">{{ wish.date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="py-12 px-6 bg-[#04120d] text-center border-t border-[#d4af37]/20 text-xs text-gray-400">
            <p class="font-serif text-lg text-white mb-2 font-bold">{{ customConfig?.groom?.nickname || 'Raden Arya' }} &amp; {{ customConfig?.bride?.nickname || 'Putri Sekar' }}</p>
            <p class="text-gray-500 mb-6">Terima kasih atas doa &amp; kehadiran Bapak/Ibu/Saudara/i sekalian.</p>
            <div class="text-[11px] text-[#d4af37] font-semibold">
                Powered by Luxe Invitation SaaS
            </div>
        </footer>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

.font-script {
    font-family: 'Great Vibes', cursive;
}

.font-serif {
    font-family: 'Cormorant Garamond', serif;
}

.font-sans {
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d4af37;
    border-radius: 4px;
}
</style>
