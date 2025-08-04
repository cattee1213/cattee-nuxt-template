<script setup lang="ts">
definePageMeta({
  layout: 'base-layout'
});

const count = ref<number[]>([]);

function addHandle(): void {
  count.value.push(count.value.length + 1);
}

function removeHandle(index: number): void {
  count.value.splice(index, 1);
}
</script>

<template>
  <div class="h-full">
    <v-btn @click="addHandle">add</v-btn>
    <TransitionGroup name="list">
      <div
        v-for="(num, index) in count"
        :key="num"
        border
        class="w-[200px] h-[50px] border-[1px] rounded-md flex items-center justify-between px-4 my-2">
        <span>{{ num }}</span>
        <Icon class="w-6 h-6 ml-2" name="mdi:close" @click="removeHandle(index)" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  // transform: translateX(-10%);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
