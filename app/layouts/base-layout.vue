<script setup lang="ts">
type MenuItem = {
  title: string;
  path: string;
  value: number;
};
const items: MenuItem[] = [
  {
    title: 'Console #1',
    path: '/dashborad/console1',
    value: 1
  },
  {
    title: 'Console #2',
    path: '/dashborad/console2',
    value: 2
  }
];

function menuClickHandle(item: MenuItem) {
  console.log('Menu item clicked:', item);
  useRouter().push(item.path);
}
</script>

<template>
  <v-layout height="100vh">
    <v-app-bar title="Application bar" />

    <v-navigation-drawer>
      <v-list nav :items="items">
        <v-list-item v-for="(item, i) in items" :key="i" :value="item" @click="menuClickHandle(item)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container height="100%" class="bg-gray-100 overflow-y-auto">
        <slot />
      </v-container>
    </v-main>
  </v-layout>
</template>
