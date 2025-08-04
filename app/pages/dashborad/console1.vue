<script setup lang="ts">
definePageMeta({
  layout: 'base-layout'
});

function clickHandle() {
  console.log('Button clicked!');
  useRouter().push('/');
}
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center gap-4">
    <p class="text-2xl">This is a application console1</p>
    <v-btn @click="clickHandle">back to index</v-btn>
  </div>
</template>

<style scoped lang="scss"></style>
