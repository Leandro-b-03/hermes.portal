// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema'
import path from 'path'
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'pt'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { "http-equiv": "Content-Security-Policy", content: "upgrade-insecure-requests" },
        { name: 'author', content: 'Tetralist' },
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
    }
  },
  hooks: {
    'pages:extend' (pages) {
      function setMiddleware (pages: NuxtPage[]) {
        for (const page of pages) {
          console.log(page);
          if (page.name != 'login' && page.name != 'teste') {
            page.meta ||= {}
            // Note that this will override any middleware set in `definePageMeta` in the page
            page.meta.middleware = ['auth']
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    }
  },
  plugins: [
    '@/plugins/primevue-toastservice.ts',
  ],
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['@/assets/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],
  primevue: {
    options: {  
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: false
        },
      }
    },
    components: {
      include: '*', // Include all components
    },
    directives: {
      include: '*', // Include all directives
    }
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  i18n:{
    langDir: 'i18n/',
    locales: [
      { code: 'pt', file: 'pt.json' },
      { code: 'en', file: 'en.json' },
    ],
    defaultLocale: 'pt',
  },
  runtimeConfig: {
    apiGateway: import.meta.env.API_GATEWAY_URL,
    apiGatewayKey: import.meta.env.API_GATEWAY_KEY,
    apiGatewaySecret: import.meta.env.API_GATEWAY_SECRET,
  },
  nitro: {
    compressPublicAssets: {
      brotli: true,
      gzip: true,
    },
    storage: {
      redis: {
        driver: 'redis',
        /* redis connector options */
        port: 6379, // Redis port
        host: "redis", // Redis host
        // username: "", // needs Redis >= 6
        // password: "hasd($j2jd832%G1",
        db: 1, // Defaults to 0
      }
    }
  },
})