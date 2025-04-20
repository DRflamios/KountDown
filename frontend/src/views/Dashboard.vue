<template>
    <main class="flex h-screen" :class="{ 'dark': isDark }">
        <div class="w-1/3 p-6 bg-gray-50 border-r dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-semibold dark:text-white">{{ $t('dashboard.title') }}</h1>
                
                <div class="relative settings-dropdown">
                    <button @click.stop="isSettingsOpen = !isSettingsOpen" 
                            class="flex items-center p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors dark:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </button>
                    
                    <div v-if="isSettingsOpen" 
                         v-click-outside="closeSettings"
                         class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 z-50">
                        <div class="p-4">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {{ $t('dashboard.userLang') }}
                                </label>
                                <select v-model="userLang" 
                                        class="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white">
                                    <option value="en">{{ $t('dashboard.langs.en') }}</option>
                                    <option value="fr">{{ $t('dashboard.langs.fr') }}</option>
                                    <option value="no">{{ $t('dashboard.langs.no') }}</option>
                                </select>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {{ $t('dashboard.darkmode') }}
                                </span>
                                <button @click="toggleDarkMode" 
                                        class="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
                                        :class="isDark ? 'bg-blue-600' : 'bg-gray-200'">
                                    <span class="sr-only">Toggle dark mode</span>
                                    <span class="inline-block w-4 h-4 transform transition-transform duration-200 rounded-full bg-white"
                                          :class="isDark ? 'translate-x-6' : 'translate-x-1'">
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="space-y-6">
                <div>
                    <label class="block text-xl font-semibold mb-2 dark:text-white">{{ $t('dashboard.settimer') }}</label>
                    <div class="flex items-center justify-center bg-white dark:bg-gray-700 p-4 rounded-lg border dark:border-gray-600">
                        <input type="number" v-model="minutes" name="minutes" id="minutes" min="0" class="p-2 border w-20 rounded remove-arrow text-center text-3xl dark:bg-gray-800 dark:text-white dark:border-gray-600">
                        <span class="mx-2 text-3xl dark:text-white">:</span>
                        <input type="number" v-model="seconds" name="seconds" id="seconds" min="0" class="p-2 border w-20 rounded remove-arrow text-center text-3xl dark:bg-gray-800 dark:text-white dark:border-gray-600">
                    </div>
                </div>

                <div>
                    <label for="speakerlang" class="block text-xl font-semibold mb-2 dark:text-white">{{ $t('dashboard.speakerlang') }}</label>
                    <select v-model="speakerLang" id="speakerlang" class="p-2 border rounded w-full bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option value="en">{{ $t('dashboard.langs.en') }}</option>
                        <option value="fr">{{ $t('dashboard.langs.fr') }}</option>
                        <option value="no">{{ $t('dashboard.langs.no') }}</option>
                    </select>
                </div>

                <div class="space-y-3 pt-4">
                    <button v-if="!isStarted" 
                            class="px-6 py-3 w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-sm transition" 
                            @click="startTimer">{{ $t('dashboard.start') }}</button>
                    <div v-else class="space-y-3">
                        <button class="px-6 py-3 w-full rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-lg shadow-sm transition" 
                                @click="stopTimer">{{ $t('dashboard.stop') }}</button>
                        <button v-if="!isPaused" 
                                class="px-6 py-3 w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg shadow-sm transition" 
                                @click="pauseTimer">{{ $t('dashboard.pause') }}</button>
                        <button v-else 
                                class="px-6 py-3 w-full rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-lg shadow-sm transition" 
                                @click="resumeTimer">{{ $t('dashboard.resume') }}</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="w-2/3 bg-white dark:bg-gray-900">
            <Preview :isDark="isDark" :speakerLang="speakerLang" />
        </div>
    </main>
</template>

<script>
import { useI18n } from 'vue-i18n'
import socket from '../services/socket'
import Preview from './Preview.vue'

const clickOutsideDirective = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
    },
};

export default {
    components: {
        Preview
    },
    directives: {
        'click-outside': clickOutsideDirective
    },
    setup() {
        const i18n = useI18n()
        return { i18n }
    },
    data() {
        return {
            isStarted: false,
            isPaused: false,
            minutes: 0,
            seconds: 0,
            isDark: false,
            isSettingsOpen: false,
            userLang: 'en',
            speakerLang: 'en'
        }
    },
    methods: {
        startTimer() {
            socket.emit('timer:start', {
                minutes: parseInt(this.minutes) || 0,
                seconds: parseInt(this.seconds) || 0
            })
            this.isStarted = true
        },
        stopTimer() {
            socket.emit('timer:stop', {
                minutes: this.minutes,
                seconds: this.seconds
            })
            this.isStarted = false
            this.isPaused = false
        },
        pauseTimer() {
            socket.emit('timer:pause')
            this.isPaused = true
        },
        resumeTimer() {
            socket.emit('timer:resume')
            this.isPaused = false
        },
        toggleDarkMode() {
            this.isDark = !this.isDark
            localStorage.setItem('darkMode', this.isDark)
            if (this.isDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        },
        closeSettings() {
            this.isSettingsOpen = false
        }
    },
    watch: {
        userLang: {
            handler(newLang) {
                this.i18n.locale.value = newLang
                localStorage.setItem('userLang', newLang)
            },
            immediate: true
        },
        speakerLang: {
            handler(newLang) {
                localStorage.setItem('speakerLang', newLang)
            },
            immediate: true
        },
        minutes(newVal) {
            socket.emit('timer:input', {
                minutes: parseInt(newVal) || 0,
                seconds: parseInt(this.seconds) || 0
            })
        },
        seconds(newVal) {
            socket.emit('timer:input', {
                minutes: parseInt(this.minutes) || 0,
                seconds: parseInt(newVal) || 0
            })
        },
    },
    created() {
        this.isDark = localStorage.getItem('darkMode') === 'true'
        this.userLang = localStorage.getItem('userLang') || 'en'
        this.speakerLang = localStorage.getItem('speakerLang') || 'en'
        
        this.i18n.locale.value = this.userLang
        if (this.isDark) {
            document.documentElement.classList.add('dark')
        }

        socket.on('timer:state', (state) => {
            this.isStarted = state.isRunning
            this.isPaused = state.isPaused
            this.minutes = state.minutes
            this.seconds = state.seconds
        })
    },
    beforeUnmount() {
        socket.off('timer:state')
    }
}
</script>

<style scoped>
.remove-arrow::-webkit-inner-spin-button,
.remove-arrow::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.remove-arrow {
    -moz-appearance: textfield;
    appearance: textfield;
}
</style>