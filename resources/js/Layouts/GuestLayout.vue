<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    title: {
        type: String,
        default: '',
    },
});
</script>

<template>
    <div class="min-h-screen bg-[#F7F3EB] relative flex flex-col justify-between overflow-x-hidden font-sans text-gray-800 antialiased selection:bg-amber-200">
        <!-- Top Navigation Bar -->
        <header class="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-20">
            <Link href="/" class="flex items-center gap-2 group">
                <div class="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center font-bold text-xl text-gray-900 group-hover:bg-amber-400/40 transition">
                    ⚡
                </div>
            </Link>

            <div>
                <slot name="top-button">
                    <Link
                        :href="route('register')"
                        class="px-6 py-2.5 bg-[#FCE282] hover:bg-[#fad85e] active:scale-95 text-gray-900 font-semibold text-sm rounded-xl shadow-xs transition duration-200 cursor-pointer inline-flex items-center justify-center"
                    >
                        Register
                    </Link>
                </slot>
            </div>
        </header>

        <!-- Main Content Area with Side Vector Illustrations -->
        <main class="flex-1 flex items-center justify-center px-4 py-6 md:py-10 relative z-10">
            <!-- LEFT ILLUSTRATION SECTION (Desktop) -->
            <div class="hidden xl:block absolute left-8 2xl:left-16 bottom-12 w-[340px] pointer-events-none select-none z-0">
                <!-- Floating Social Icons in Geometric Shapes -->
                <div class="relative h-[320px] w-full">
                    <!-- Instagram in Square -->
                    <div class="absolute top-4 left-6 w-11 h-11 rounded-xl border border-gray-400/50 flex items-center justify-center bg-white/40 backdrop-blur-xs text-gray-600 shadow-2xs transform -rotate-6">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                        </svg>
                    </div>

                    <!-- Reddit in Square -->
                    <div class="absolute top-20 left-28 w-11 h-11 rounded-xl border border-gray-400/50 flex items-center justify-center bg-white/40 backdrop-blur-xs text-gray-600 shadow-2xs transform rotate-3">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M17 13c0 1.7-2.2 3-5 3s-5-1.3-5-3"/>
                            <circle cx="9" cy="10" r="1" fill="currentColor"/>
                            <circle cx="15" cy="10" r="1" fill="currentColor"/>
                        </svg>
                    </div>

                    <!-- Pinterest in Triangle -->
                    <div class="absolute top-36 left-4 w-14 h-14 flex items-center justify-center">
                        <svg class="absolute inset-0 w-full h-full text-gray-400/60" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5">
                            <polygon points="30,5 55,50 5,50" />
                        </svg>
                        <svg class="w-5 h-5 text-gray-700 relative z-10 mt-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 .04-2.9.2-.8 1.4-6 1.4-6s-.3-.7-.3-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.7 0-3.8 2.8-7.3 8-7.3 4.2 0 7.5 3 7.5 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1.1 2.5-1.6 3.4C10.2 21.8 11.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
                        </svg>
                    </div>

                    <!-- Facebook in Circle -->
                    <div class="absolute top-52 left-28 w-12 h-12 rounded-full border border-gray-400/50 flex items-center justify-center bg-white/40 backdrop-blur-xs text-gray-600 shadow-2xs">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                    </div>

                    <!-- Twitter in Square -->
                    <div class="absolute top-72 left-52 w-11 h-11 rounded-xl border border-gray-400/50 flex items-center justify-center bg-white/40 backdrop-blur-xs text-gray-600 shadow-2xs transform rotate-6">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                        </svg>
                    </div>

                    <!-- LinkedIn in Triangle -->
                    <div class="absolute top-[210px] left-14 w-14 h-14 flex items-center justify-center">
                        <svg class="absolute inset-0 w-full h-full text-gray-400/60" viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.5">
                            <polygon points="30,5 55,50 5,50" />
                        </svg>
                        <span class="text-xs font-bold text-gray-700 relative z-10 mt-2">in</span>
                    </div>

                    <!-- Decorative Wavy Line -->
                    <svg class="absolute top-60 left-48 w-16 h-8 text-gray-500/60" viewBox="0 0 60 30" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M 0 15 Q 15 0 30 15 T 60 15"/>
                    </svg>
                </div>

                <!-- Bottom Pattern Block & Sphere -->
                <div class="flex items-end gap-3 mt-4">
                    <!-- Memphis Yellow Block -->
                    <div class="w-20 h-28 bg-[#FCE282] rounded-t-lg relative overflow-hidden border border-gray-900/10">
                        <svg class="w-full h-full text-gray-900 opacity-80" viewBox="0 0 80 110" fill="currentColor">
                            <!-- Dots Pattern -->
                            <circle cx="15" cy="15" r="2.5"/><circle cx="40" cy="15" r="2.5"/><circle cx="65" cy="15" r="2.5"/>
                            <circle cx="27" cy="35" r="2.5"/><circle cx="52" cy="35" r="2.5"/>
                            <circle cx="15" cy="55" r="2.5"/><circle cx="40" cy="55" r="2.5"/><circle cx="65" cy="55" r="2.5"/>
                            <circle cx="27" cy="75" r="2.5"/><circle cx="52" cy="75" r="2.5"/>
                            <circle cx="15" cy="95" r="2.5"/><circle cx="40" cy="95" r="2.5"/><circle cx="65" cy="95" r="2.5"/>
                            <!-- Small triangles -->
                            <polygon points="25,22 30,30 20,30"/>
                            <polygon points="58,62 63,70 53,70"/>
                        </svg>
                    </div>

                    <!-- 3D Sphere Outline -->
                    <div class="w-16 h-16 rounded-full border border-gray-900 relative flex items-center justify-center bg-white/20">
                        <div class="absolute inset-0 rounded-full border border-gray-900/40 transform rotate-45 scale-x-50"></div>
                        <div class="absolute inset-0 rounded-full border border-gray-900/40 transform -rotate-45 scale-y-50"></div>
                    </div>
                </div>
            </div>

            <!-- CENTRAL FORM CARD -->
            <div class="w-full max-w-[460px] bg-white rounded-[32px] p-7 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-stone-200/60 relative z-10 transition-all duration-300">
                <slot />
            </div>

            <!-- RIGHT ILLUSTRATION SECTION (Desktop) -->
            <div class="hidden lg:block absolute right-8 2xl:right-20 bottom-12 w-[340px] pointer-events-none select-none z-0">
                <!-- Speech bubble outline wireframe -->
                <div class="absolute top-12 left-10 w-24 h-16 border border-gray-400/70 rounded-xl bg-white/40 p-2 flex flex-col justify-center gap-1.5 shadow-2xs">
                    <div class="w-12 h-1 bg-gray-400/60 rounded-full"></div>
                    <div class="w-8 h-1 bg-gray-300/60 rounded-full"></div>
                    <div class="absolute -bottom-2 left-4 w-2 h-2 rounded-full border border-gray-400/70 bg-white"></div>
                </div>

                <!-- Squiggly line flourish -->
                <svg class="absolute top-4 right-12 w-20 h-10 text-gray-500/60" viewBox="0 0 80 40" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M 0 20 Q 20 0 40 20 T 80 20"/>
                </svg>

                <!-- Vector Character Sitting on Box working on Laptop -->
                <div class="relative mt-24 flex justify-end items-end">
                    <div class="relative w-64 h-[300px]">
                        <!-- Yellow Box Container for character -->
                        <div class="absolute bottom-0 right-4 w-24 h-24 bg-[#FCE282] rounded-t-lg border border-gray-900/10 p-2 overflow-hidden">
                            <svg class="w-full h-full text-gray-900 opacity-70" viewBox="0 0 80 80" fill="currentColor">
                                <circle cx="15" cy="15" r="2.5"/><circle cx="40" cy="15" r="2.5"/><circle cx="65" cy="15" r="2.5"/>
                                <circle cx="27" cy="35" r="2.5"/><circle cx="52" cy="35" r="2.5"/>
                                <circle cx="15" cy="55" r="2.5"/><circle cx="40" cy="55" r="2.5"/><circle cx="65" cy="55" r="2.5"/>
                            </svg>
                        </div>

                        <!-- Character SVG Illustration -->
                        <svg class="absolute bottom-0 right-0 w-64 h-[310px]" viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Legs & Shoes -->
                            <!-- Back leg -->
                            <path d="M 125 185 L 105 240 L 95 242" stroke="#111827" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            <!-- Front leg seated -->
                            <path d="M 140 185 L 180 190 L 195 245 C 195 245 190 255 175 258" stroke="#111827" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="#FFFFFF"/>
                            <!-- Shoes -->
                            <path d="M 88 240 L 98 240 L 100 252 L 85 252 Z" fill="#111827"/>
                            <path d="M 172 255 L 196 252 L 202 265 L 170 268 Z" fill="#111827"/>

                            <!-- Torso & Patterned Top -->
                            <path d="M 140 120 C 150 135 155 155 145 185 L 120 185 C 120 160 125 135 130 120 Z" fill="#111827"/>
                            <!-- White Pattern details on top -->
                            <circle cx="135" cy="140" r="1.5" fill="#FFFFFF"/>
                            <circle cx="145" cy="145" r="1.5" fill="#FFFFFF"/>
                            <circle cx="130" cy="155" r="1.5" fill="#FFFFFF"/>
                            <circle cx="142" cy="165" r="1.5" fill="#FFFFFF"/>

                            <!-- Yellow Laptop on Lap -->
                            <path d="M 115 150 L 150 155 L 140 182 L 110 178 Z" fill="#FCE282" stroke="#111827" stroke-width="2"/>
                            <!-- Screen -->
                            <path d="M 115 150 L 108 120 L 138 125 L 145 155 Z" fill="#FDE68A" stroke="#111827" stroke-width="2"/>

                            <!-- Arms & Hands on Laptop -->
                            <path d="M 132 125 L 118 150 L 126 155" stroke="#111827" stroke-width="3" stroke-linecap="round" fill="none"/>

                            <!-- Head, Face & Hair bun -->
                            <!-- Head -->
                            <circle cx="146" cy="98" r="12" fill="#111827"/>
                            <path d="M 142 92 C 146 82 165 85 162 105 C 160 115 150 120 142 112 C 138 108 138 98 142 92 Z" fill="#111827"/>
                            <!-- Top Hair Bun -->
                            <circle cx="152" cy="84" r="8" fill="#111827"/>
                            <path d="M 158 80 C 162 76 166 84 160 88 Z" fill="#111827"/>
                        </svg>
                    </div>
                </div>
            </div>
        </main>

        <!-- Bottom Baseline Separator -->
        <footer class="w-full border-t border-gray-300/70 py-3 px-6 relative z-10 text-center text-xs text-gray-500">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <span>&copy; {{ new Date().getFullYear() }} All Rights Reserved.</span>
                <div class="flex items-center gap-4">
                    <a href="#" class="hover:text-gray-900 transition">Privacy Policy</a>
                    <a href="#" class="hover:text-gray-900 transition">Terms of Service</a>
                </div>
            </div>
        </footer>
    </div>
</template>
