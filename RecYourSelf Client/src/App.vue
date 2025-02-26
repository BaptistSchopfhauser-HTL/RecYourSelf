<script setup>

</script>

<template>
  <q-layout view="hHh lpR fFf" class="cont">
    <q-header elevated class="bg-secondary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title class="q-mt-md">
          <q-avatar>
            <img src="/RecYourSelfIcon.svg" />
          </q-avatar>
          RecYourSelf
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Home" icon="home" />
        <q-route-tab to="/newrecord" label="new Record" icon="mic" />
        <q-route-tab to="/about" label="About" icon="person" />
      </q-tabs>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" side="left" bordered>

    </q-drawer> -->

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="background-overlay"></div>
        <div class="content row justify-center">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style>
cont {
  background-color: red;
}
.q-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: url('/img/carouselPic1.jpg') no-repeat center center fixed;
  background-size: cover;
}

.overlay-card {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  padding: 20px;
  border-radius: 10px;
}
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay */
  backdrop-filter: blur(10px); /* Blur effect */
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1300px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
