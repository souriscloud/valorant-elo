import Vue from 'vue'
import VueI18n from 'vue-i18n'

import cs from '@/i18n/cs.json'
import en from '@/i18n/en.json'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'cs',
  fallbackLocale: 'en',
  messages: {
    en,
    cs
  }
})
