import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'

import en from './locales/en.json'
import fr from './locales/fr.json'
import no from './locales/no.json'

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        fr,
        no
    }
})

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
