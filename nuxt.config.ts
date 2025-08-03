// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // The private keys which are only available within server-side
    urlPrefix: '',
    serverPrivateKey: '',
    piniaKey: '',
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase: '',
      serverPublicKey: ''
    }
  },
  app: {
    baseURL: import.meta.env.NUXT_APP_BASE_URL,
    // 缓存路由
    keepalive: true,
    pageTransition: true
  },
  typescript: {
    typeCheck: false
  },

  pages: {
    pattern: ['**/*.vue', '!**/_*']
  },
  components: [
    {
      path: '~/components',
      // 仅通过文件名来命名组件（排除文件夹名称）
      pathPrefix: false
    }
  ],
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxt/content'
  ]
});
