<script setup>
import { ref } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Mail, KeyRound, User, Eye, EyeOff } from 'lucide-vue-next';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
};

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <GuestLayout title="Register">
        <Head title="Register" />

        <template #top-button>
            <Link
                :href="route('login')"
                class="px-6 py-2.5 bg-[#FCE282] hover:bg-[#fad85e] active:scale-95 text-gray-900 font-semibold text-sm rounded-xl shadow-xs transition duration-200 cursor-pointer inline-flex items-center justify-center"
            >
                Login
            </Link>
        </template>

        <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Register</h1>
            <p class="text-xs text-gray-500 mt-2 font-normal">
                Hey, Enter your details to create your account
            </p>
        </div>

        <form @submit.prevent="submit" class="space-y-3.5">
            <div>
                <div class="relative flex items-center">
                    <div class="absolute left-3.5 pointer-events-none text-gray-400">
                        <User class="w-4 h-4" />
                    </div>
                    <input
                        id="name"
                        type="text"
                        v-model="form.name"
                        placeholder="Enter your full name"
                        required
                        autofocus
                        autocomplete="name"
                        class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 shadow-2xs"
                    />
                </div>
                <InputError class="mt-1.5 text-xs text-red-500" :message="form.errors.name" />
            </div>

            <div>
                <div class="relative flex items-center">
                    <div class="absolute left-3.5 pointer-events-none text-gray-400">
                        <Mail class="w-4 h-4" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        v-model="form.email"
                        placeholder="Enter your email here"
                        required
                        autocomplete="username"
                        class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 shadow-2xs"
                    />
                </div>
                <InputError class="mt-1.5 text-xs text-red-500" :message="form.errors.email" />
            </div>

            <div>
                <div class="relative flex items-center">
                    <div class="absolute left-3.5 pointer-events-none text-gray-400">
                        <KeyRound class="w-4 h-4" />
                    </div>
                    <input
                        id="password"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="form.password"
                        placeholder="Create a password"
                        required
                        autocomplete="new-password"
                        class="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 shadow-2xs"
                    />
                    <button
                        type="button"
                        @click="togglePassword"
                        class="absolute right-3.5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        tabindex="-1"
                    >
                        <EyeOff v-if="showPassword" class="w-4 h-4" />
                        <Eye v-else class="w-4 h-4" />
                    </button>
                </div>
                <InputError class="mt-1.5 text-xs text-red-500" :message="form.errors.password" />
            </div>

            <div>
                <div class="relative flex items-center">
                    <div class="absolute left-3.5 pointer-events-none text-gray-400">
                        <KeyRound class="w-4 h-4" />
                    </div>
                    <input
                        id="password_confirmation"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        v-model="form.password_confirmation"
                        placeholder="Confirm your password"
                        required
                        autocomplete="new-password"
                        class="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 shadow-2xs"
                    />
                    <button
                        type="button"
                        @click="toggleConfirmPassword"
                        class="absolute right-3.5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                        tabindex="-1"
                    >
                        <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
                        <Eye v-else class="w-4 h-4" />
                    </button>
                </div>
                <InputError class="mt-1.5 text-xs text-red-500" :message="form.errors.password_confirmation" />
            </div>

            <div class="pt-1">
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="w-full bg-[#FCE282] hover:bg-[#fad85e] active:scale-[0.99] text-gray-900 font-bold py-3.5 rounded-xl shadow-xs transition-all duration-200 text-sm cursor-pointer flex items-center justify-center disabled:opacity-50"
                >
                    <span v-if="form.processing">Creating account...</span>
                    <span v-else>Register</span>
                </button>
            </div>

            <div class="flex items-center my-4">
                <div class="flex-1 border-t border-gray-200"></div>
                <span class="px-3 text-xs text-gray-400 font-medium">Or Sign up with</span>
                <div class="flex-1 border-t border-gray-200"></div>
            </div>

            <div class="flex items-center justify-center gap-3">
                <button
                    type="button"
                    title="Sign up with Google"
                    class="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition cursor-pointer shadow-2xs"
                >
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                </button>
            </div>

            <div class="text-center pt-3">
                <p class="text-xs text-gray-500 font-normal">
                    Already have an account?
                    <Link :href="route('login')" class="font-semibold text-gray-900 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    </GuestLayout>
</template>
