<script setup>
// const leftDrawerOpen = ref(false);

// const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
</script>

<template>
  <q-layout view="hHh lpR fFf" class="cont">
    <q-header elevated class="bg-secondary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="q-my-md">
          <q-avatar>
            <img src="/RecYourSelfIcon.svg" />
          </q-avatar>
          RecYourSelf
        </q-toolbar-title>
        <q-tabs align="left">
          <q-route-tab to="/" label="Home" icon="home" />
          <q-route-tab to="/newrecord" label="new Record" icon="mic" />
          <q-route-tab to="/about" label="About" icon="person" />
        </q-tabs>
        <q-space />
      </q-toolbar>
    </q-header>

    <q-footer reveal elevated>
      <div>
        <q-toolbar-title class="text-center">
          <q-badge>&copy; 2024-2025 Baptist Schopfhauser</q-badge></q-toolbar-title
        >
      </div>
    </q-footer>

    <!-- <q-drawer v-model="leftDrawerOpen" side="left" bordered>

    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style>
cont {
  background-color: red;
}
</style>
