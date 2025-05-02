<template>
    <main class="flex h-screen overflow-hidden" :class="{ 'dark': isDark }">
        <div class="w-1/3 p-6 bg-gray-50 border-r dark:bg-gray-800 dark:border-gray-700 overflow-y-auto">
            <div class="flex flex-col gap-8">
                <div class="flex justify-between items-center">
                    <h1 class="text-3xl font-semibold dark:text-white">{{ $t('dashboard.title') }}</h1>

                    <div class="relative settings-dropdown">
                        <button @click.stop="isSettingsOpen = !isSettingsOpen"
                            class="flex items-center p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors dark:text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </button>

                        <div v-if="isSettingsOpen" v-click-outside="closeSettings"
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
                                        <span
                                            class="inline-block w-4 h-4 transform transition-transform duration-200 rounded-full bg-white"
                                            :class="isDark ? 'translate-x-6' : 'translate-x-1'">
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <section class="p-4 bg-white rounded-lg shadow dark:bg-gray-700">
                    <h2 class="text-xl font-semibold mb-4 dark:text-white">{{ $t('dashboard.manualTimer.title') }}</h2>
                    <div
                        class="flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-600">
                        <input type="number" v-model="manualTimer.minutes" name="minutes" id="minutes" min="0"
                            class="p-2 border w-20 rounded remove-arrow text-center text-3xl dark:bg-gray-900 dark:text-white dark:border-gray-600">
                        <span class="mx-2 text-3xl dark:text-white">:</span>
                        <input type="number" v-model="manualTimer.seconds" name="seconds" id="seconds" min="0"
                            class="p-2 border w-20 rounded remove-arrow text-center text-3xl dark:bg-gray-900 dark:text-white dark:border-gray-600">
                    </div>
                    <div class="mt-4">
                        <label for="manualSpeakerLang"
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
                            $t('dashboard.speakerlang') }}</label>
                        <select v-model="manualTimer.speakerLang" id="manualSpeakerLang"
                            class="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white">
                            <option value="en">{{ $t('dashboard.langs.en') }}</option>
                            <option value="fr">{{ $t('dashboard.langs.fr') }}</option>
                            <option value="no">{{ $t('dashboard.langs.no') }}</option>
                        </select>
                    </div>
                    <button
                        class="mt-4 px-6 py-3 w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-sm transition"
                        @click="startManualTimer" :disabled="isQueueRunning">{{ $t('dashboard.manualTimer.start')
                        }}</button>
                </section>

                <section class="p-4 bg-white rounded-lg shadow dark:bg-gray-700 flex flex-col h-full">
                    <h2 class="text-xl font-semibold mb-4 dark:text-white">{{ $t('dashboard.queue.title') }}</h2>
                    <form @submit.prevent="addToQueue" class="flex flex-col gap-4 mb-4">
                        <input v-model="newTimer.speaker" type="text" :placeholder="$t('dashboard.queue.speaker')"
                            class="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600" required />
                        <div class="flex gap-4 items-center w-full">
                            <div class="flex items-center gap-2">
                                <input v-model.number="newTimer.minutes" type="number"
                                    :placeholder="$t('dashboard.queue.minutes')"
                                    class="p-2 border w-20 rounded remove-arrow text-center dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                    required />
                                <span class="text-xl dark:text-white">:</span>
                                <input v-model.number="newTimer.seconds" type="number"
                                    :placeholder="$t('dashboard.queue.seconds')"
                                    class="p-2 border w-20 rounded remove-arrow text-center dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                    required />
                            </div>
                            <div class="w-full">
                                <label for="queueSpeakerLang"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
                                        $t('dashboard.speakerlang') }}</label>
                                <select v-model="newTimer.speakerLang" id="queueSpeakerLang"
                                    class="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white">
                                    <option value="en">{{ $t('dashboard.langs.en') }}</option>
                                    <option value="fr">{{ $t('dashboard.langs.fr') }}</option>
                                    <option value="no">{{ $t('dashboard.langs.no') }}</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded self-end"
                            :disabled="isManualRunning">{{ $t('dashboard.queue.add') }}</button>
                    </form>

                    <div
                        class="flex-1 overflow-y-auto bg-gray-300 dark:bg-gray-800 rounded-md divide-y max-h-36 dark:divide-gray-700">
                        <ul>
                            <li v-for="(timer, index) in queue" :key="index"
                                class="flex justify-between items-center p-2 dark:text-white"
                                :class="{ 'bg-green-100 dark:bg-green-800': activeQueueIndex === index }">
                                <div>
                                    <strong>{{ timer.speaker }}</strong>: {{ timer.minutes }}m {{ timer.seconds }}s
                                </div>
                                <div class="flex gap-2">
                                    <button @click="removeFromQueue(index)"
                                        class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded">{{ $t('dashboard.queue.remove')
                                        }}</button>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-4">
                        <button
                            class="px-6 py-3 w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow-sm transition"
                            @click="startNextTimer" :disabled="isManualRunning || isQueueRunning">{{
                            $t('dashboard.queue.startNext') }}</button>
                    </div>
                </section>
            </div>
        </div>

        <div class="w-2/3 bg-white dark:bg-gray-900 relative">
            <Preview :isDark="isDark" :speakerLang="currentSpeakerLang" :speakerName="activeSpeakerName" />

            <div v-if="isManualRunning || isQueueRunning"
                class="absolute bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <h2 class="text-lg font-semibold mb-2 dark:text-white">{{ $t('dashboard.generalControls.title') }}</h2>
                <div class="flex gap-4">
                    <button
                        class="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm transition"
                        @click="stopTimer">{{ $t('dashboard.generalControls.stop') }}</button>
                    <button v-if="!isPaused"
                        class="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition"
                        @click="pauseTimer">{{ $t('dashboard.generalControls.pause') }}</button>
                    <button v-else
                        class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm transition"
                        @click="resumeTimer">{{ $t('dashboard.generalControls.resume') }}</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { useI18n } from 'vue-i18n'
import socket from '../services/socket'
import Preview from './Preview.vue'

export default {
    components: {
        Preview
    },
    setup() {
        const i18n = useI18n()
        return { i18n }
    },
    data() {
        return {
            isStarted: false,
            isPaused: false,
            isDark: false,
            isSettingsOpen: false,
            userLang: 'en',
            manualTimer: {
                minutes: 0,
                seconds: 0,
                speakerLang: 'en'
            },
            newTimer: {
                speaker: '',
                minutes: 0,
                seconds: 0,
                speakerLang: 'en'
            },
            queue: [],
            isManualRunning: false,
            isQueueRunning: false,
            currentSpeakerLang: 'en',
            activeQueueIndex: null,
            activeSpeakerName: null
        }
    },
    methods: {
        startManualTimer() {
            if (this.isQueueRunning) return
            socket.emit('timer:start', {
                minutes: parseInt(this.manualTimer.minutes) || 0,
                seconds: parseInt(this.manualTimer.seconds) || 0
            })
            this.isManualRunning = true
            this.currentSpeakerLang = this.manualTimer.speakerLang
        },
        addToQueue() {
            if (this.isManualRunning) return
            socket.emit('queue:add', { ...this.newTimer })
            this.newTimer.speaker = ''
            this.newTimer.minutes = 0
            this.newTimer.seconds = 0
        },
        removeFromQueue(index) {
            if (index === this.activeQueueIndex) {
                this.stopTimer();
            }
            this.queue.splice(index, 1);
            this.saveQueue();
        },
        startNextTimer() {
            if (this.isManualRunning || this.isQueueRunning) return;
            if (this.queue.length > 0) {
                const nextTimer = this.queue[0];
                this.activeQueueIndex = 0;
                this.currentSpeakerLang = nextTimer.speakerLang;
                this.activeSpeakerName = nextTimer.speaker;

                socket.emit('speaker:update', {
                    speakerName: this.activeSpeakerName,
                    speakerLang: this.currentSpeakerLang
                });

                socket.emit('timer:start', {
                    minutes: nextTimer.minutes,
                    seconds: nextTimer.seconds
                });
                this.isQueueRunning = true;
            }
        },
        startTimer() {
            if (this.isManualRunning || this.isQueueRunning) return;

            if (this.queue.length > 0) {
                this.startNextTimer();
            } else if (this.manualTimer.minutes > 0 || this.manualTimer.seconds > 0) {
                this.startManualTimer();
            }
        },
        stopTimer() {
            socket.emit('timer:stop', {
                minutes: 0,
                seconds: 0
            });
            this.isManualRunning = false;
            this.isQueueRunning = false;

            if (this.activeQueueIndex !== null) {
                this.queue.splice(this.activeQueueIndex, 1);
                this.activeQueueIndex = null;
                this.activeSpeakerName = null;
            }
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
        },
        closeSettings() {
            this.isSettingsOpen = false
        },
        saveQueue() {
            socket.emit('queue:save', this.queue);
        },
        loadQueue() {
            socket.emit('queue:load');
        },
        handleTimerEnd() {
            this.isPaused = true;
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
        isDark: {
            handler(newVal) {
                if (newVal) {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            },
            immediate: true
        },
        queue: {
            handler() {
                this.saveQueue();
            },
            deep: true
        }
    },
    created() {
        this.isDark = localStorage.getItem('darkMode') === 'true'
        this.userLang = localStorage.getItem('userLang') || 'en'
        this.i18n.locale.value = this.userLang
        this.loadQueue();
        socket.on('queue:update', (updatedQueue) => {
            this.queue = updatedQueue
        })
        socket.on('timer:ended', this.handleTimerEnd);
        socket.on('queue:loaded', (loadedQueue) => {
            this.queue = loadedQueue;
        });
    },
    beforeUnmount() {
        socket.off('queue:update')
        socket.off('timer:ended', this.handleTimerEnd);
        socket.off('queue:loaded');
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
.scrollbar-hide {
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
}
</style>