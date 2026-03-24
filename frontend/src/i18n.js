import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEN from './locales/en/translation.json'
import translationHI from './locales/hi/translation.json'
import translationMR from './locales/mr/translation.json'
import translationTA from './locales/ta/translation.json'
import translationTE from './locales/te/translation.json'
import translationBN from './locales/bn/translation.json'
import translationOR from './locales/or/translation.json'

const resources = {
  en: { translation: translationEN },
  hi: { translation: translationHI },
  mr: { translation: translationMR },
  ta: { translation: translationTA },
  te: { translation: translationTE },
  bn: { translation: translationBN },
  or: { translation: translationOR }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('userLanguage') || 'hi',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  })

export default i18n
