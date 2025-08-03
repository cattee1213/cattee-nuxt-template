<script setup lang="ts">
const { x, y } = useMouse();

const { data: page } = await useAsyncData(() => {
  return queryCollection('content').path('/').first();
});

const response: CustomResponse<string> = await useEncryptedFetch().get('/data');
</script>

<template>
  <div class="h-screen w-screen bg-gray-800 text-slate-400 flex flex-col items-center justify-center gap-4">
    <p class="text-2xl">This is a paragraph</p>

    <Icon class="w-10 h-10" name="uil:github" />

    <nuxt-img src="https://picsum.photos/200" />

    <p>pointer:{{ x }}, {{ y }}</p>
    <p>fetch data: {{ response.data }}</p>
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>

<style scoped lang="scss"></style>
