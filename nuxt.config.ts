// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr:false,
    css: [
        'vuetify/lib/styles/main.sass',
        '@mdi/font/css/materialdesignicons.min.css'
    ],
    build: {
      transpile: ['vuetify'],
    },
    vite: {
      define: {
        'process.env.DEBUG': false,
      },
    },
    modules: [
      '@pinia/nuxt',
      '@nathanchase/nuxt-dayjs-module'
    ],
    components: [
      '~/components/form',
      '~/components'
    ],
    app: {
      pageTransition: { name: 'page', mode: 'out-in' }
    },
})
