<template>
    <div class="flex flex-col justify-center items-center h-full transition-colors" 
         :class="{ 
             'warning': isWarning && !isStopped,
             'bg-white dark:bg-gray-900': true
         }">
        <div class="text-lg mb-4 text-gray-600 dark:text-gray-400 text-center">
            {{ $t('preview.speakingIn', { lang: $t(`dashboard.langs.${currentLang}`) }) }}
        </div>
        <h1 class="text-3xl mb-8 text-gray-800 dark:text-gray-100 text-center">{{ localizedMessage }}</h1>
        <b class="text-9xl font-semibold mb-8 text-gray-900 dark:text-white transition-colors" :class="{'time-flash': isTimeZero && !isStopped}">{{ formattedTime }}</b>
        <div v-if="isPaused" class="text-2xl text-amber-500 font-medium text-center">
            {{ pauseMessage }}
        </div>
    </div>
</template>

<script>
import socket from '../services/socket'
import { useI18n } from 'vue-i18n'
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'

export default {
    props: {
        isDark: {
            type: Boolean,
            default: false
        },
        speakerLang: {
            type: String,
            default: null
        }
    },
    setup(props) {
        const i18n = useI18n()
        
        const minutes = ref(0)
        const seconds = ref(0)
        const isWarning = ref(false)
        const isPaused = ref(false)
        const isStopped = ref(true)
        const messageKey = ref('preview.message.start')
        const currentLang = ref(props.speakerLang || localStorage.getItem('speakerLang') || 'en')

        const isTimeZero = computed(() => {
            return minutes.value === 0 && seconds.value === 0 && !isStopped.value
        })

        const handleStorageChange = (e) => {
            if (e.key === 'speakerLang') {
                currentLang.value = e.newValue
            }
            if (e.key === 'darkMode') {
                if (e.newValue === 'true') {
                    document.documentElement.classList.add('dark')
                } else {
                    document.documentElement.classList.remove('dark')
                }
            }
        }

        const formattedTime = computed(() => {
            return `${String(minutes.value).padStart(2, '0')}:${String(seconds.value).padStart(2, '0')}`
        })

        const localizedMessage = computed(() => {
            const messages = i18n.messages.value[currentLang.value]
            const keys = messageKey.value.split('.')
            return keys.reduce((obj, key) => obj[key], messages)
        })

        const pauseMessage = computed(() => {
            const messages = i18n.messages.value[currentLang.value]
            return messages.dashboard.pausemessage
        })

        const updateMessage = (totalSeconds) => {
            if (totalSeconds <= 10 && totalSeconds > 0) {
                messageKey.value = 'preview.message.hurry'
                isWarning.value = true
            } else if (totalSeconds > 0) {
                messageKey.value = 'preview.message.remain'
                isWarning.value = false
            } else {
                messageKey.value = 'preview.message.end'
                isWarning.value = false
            }
        }

        watch(() => props.speakerLang, (newLang) => {
            if (newLang) {
                currentLang.value = newLang
            }
        })

        onMounted(() => {
            if (localStorage.getItem('darkMode') === 'true') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }

            window.addEventListener('storage', handleStorageChange)

            socket.on('timer:state', (state) => {
                minutes.value = state.minutes
                seconds.value = state.seconds
                isPaused.value = state.isPaused
                isStopped.value = !state.isRunning
                
                if (state.isRunning) {
                    const totalSeconds = state.minutes * 60 + state.seconds
                    updateMessage(totalSeconds)
                } else if (!state.isRunning && isStopped.value) {
                    messageKey.value = 'preview.message.start'
                    isWarning.value = false
                }
            })

            socket.on('timer:update', (state) => {
                minutes.value = state.minutes
                seconds.value = state.seconds
                const totalSeconds = state.minutes * 60 + state.seconds
                updateMessage(totalSeconds)
            })

            socket.on('timer:ended', () => {
                messageKey.value = 'preview.message.end'
                isWarning.value = false
                isStopped.value = true
            })
        })

        onBeforeUnmount(() => {
            window.removeEventListener('storage', handleStorageChange)
            socket.off('timer:state')
            socket.off('timer:update')
            socket.off('timer:ended')
        })

        return {
            minutes,
            seconds,
            isWarning,
            isPaused,
            isStopped,
            formattedTime,
            localizedMessage,
            pauseMessage,
            currentLang,
            isTimeZero
        }
    }
}
</script>

<style scoped>
.warning {
    animation: warning-flash 1s ease-in-out infinite alternate;
}

@keyframes warning-flash {
    from {
        background-color: rgb(255, 255, 255);
    }
    to {
        background-color: rgba(239, 68, 68, 0.4);
    }
}

:root.dark .warning {
    animation: warning-flash-dark 1s ease-in-out infinite alternate;
}

@keyframes warning-flash-dark {
    from {
        background-color: rgb(17, 24, 39);
    }
    to {
        background-color: rgba(80, 0, 0, 0.9);
    }
}

.time-flash {
    animation: time-flash 500ms ease-in-out infinite alternate;
}

@keyframes time-flash {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

:root.dark .time-flash {
    animation: time-flash-dark 500ms ease-in-out infinite alternate;
}

@keyframes time-flash-dark {
    from {
        opacity: 1;
    }
    to {
        opacity: 0.3;
    }
}
</style>