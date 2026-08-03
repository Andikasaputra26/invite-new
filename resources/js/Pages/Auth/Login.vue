<script setup>
import { ref } from 'vue';
import Checkbox from '@/Components/Checkbox.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Mail, KeyRound, Eye, EyeOff } from 'lucide-vue-next';

defineProps({
    canResetPassword: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const showPassword = ref(false);

const togglePassword = () => {
    showPassword.value = !showPassword.value;
};

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <GuestLayout title="Login">
        <Head title="Log in" />

        <template #top-button>
            <Link
                :href="route('register')"
                class="px-6 py-2.5 bg-[#FCE282] hover:bg-[#fad85e] active:scale-95 text-gray-900 font-semibold text-sm rounded-xl shadow-xs transition duration-200 cursor-pointer inline-flex items-center justify-center"
            >
                Register
            </Link>
        </template>

        <!-- Form Title & Subtitle -->
        <div class="text-center mb-7">
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Login</h1>
            <p class="text-xs text-gray-500 mt-2 font-normal">
                Hey, Enter your details to sign in to your account
            </p>
        </div>

        <div v-if="status" class="mb-4 text-xs font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-200 text-center">
            {{ status }}
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <!-- Email Field -->
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
                        autofocus
                        autocomplete="username"
                        class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200 shadow-2xs"
                    />
                </div>
                <InputError class="mt-1.5 text-xs text-red-500" :message="form.errors.email" />
            </div>

            <!-- Password Field -->
            <div>
                <div class="relative flex items-center">
                    <div class="absolute left-3.5 pointer-events-none text-gray-400">
                        <KeyRound class="w-4 h-4" />
                    </div>
                    <input
                        id="password"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="form.password"
                        placeholder="Enter your password here"
                        required
                        autocomplete="current-password"
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

            <div class="text-center pt-1">
                <Link
                    v-if="canResetPassword"
                    :href="route('password.request')"
                    class="text-xs text-gray-600 hover:text-gray-900 font-medium transition cursor-pointer inline-block"
                >
                    Having trouble signing in?
                </Link>
            </div>

            <div class="flex items-center justify-between text-xs text-gray-600 pt-1">
                <label class="flex items-center cursor-pointer select-none">
                    <Checkbox name="remember" v-model:checked="form.remember" class="rounded border-gray-300 text-amber-500 focus:ring-amber-400" />
                    <span class="ms-2 text-xs text-gray-600">Remember me</span>
                </label>
            </div>

            <div>
                <button
                    type="submit"
                    :disabled="form.processing"
                    class="w-full bg-[#FCE282] hover:bg-[#fad85e] active:scale-[0.99] text-gray-900 font-bold py-3.5 rounded-xl shadow-xs transition-all duration-200 text-sm cursor-pointer flex items-center justify-center disabled:opacity-50"
                >
                    <span v-if="form.processing">Logging in...</span>
                    <span v-else>Login</span>
                </button>
            </div>

            <div class="text-center pt-1">
                <button
                    type="button"
                    class="text-xs font-semibold text-gray-800 hover:text-gray-900 transition cursor-pointer"
                >
                    Single Sign On
                </button>
            </div>

            <div class="flex items-center my-5">
                <div class="flex-1 border-t border-gray-200"></div>
                <span class="px-3 text-xs text-gray-400 font-medium">Or Sign in with</span>
                <div class="flex-1 border-t border-gray-200"></div>
            </div>

            <div class="flex items-center justify-center gap-3">
                <button
                    type="button"
                    title="Sign in with Google"
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

            <div class="text-center pt-4">
                <p class="text-xs text-gray-500 font-normal">
                    Don't have an account?
                    <Link :href="route('register')" class="font-semibold text-gray-900 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </form>
    </GuestLayout>
</template>
