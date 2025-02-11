<script setup>
import { ref } from 'vue';
// import axios from 'axios';

// server:
// onMounted(() => {
//   fetchdata();
// });
// const fetchdata = async () => {
//   const response = await axios.get('http://localhost:3000/data');
//   recordings.value = response.data;
// };

import data from '../assets/db.json';

const recordings = ref([]);
recordings.value = data;
const slide = ref(1);

const createdAtdate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};
</script>

<template>
  <div class="column">
    <q-carousel animated v-model="slide" :autoplay="3000" infinite class="shadow-11">
      <q-carousel-slide :name="1" img-src="/img/carouselPic1.jpg" />
      <q-carousel-slide :name="2" img-src="/img/carouselPic2.jpg" />
      <q-carousel-slide :name="3" img-src="/img/carouselPic3.jpg" />
    </q-carousel>
    <div class="">
      <q-card class="text-h3 q-pa-md fixed-center" style="background: rgba(255, 255, 255, 0.7)">
        Welcome to
        <span class="text-bold" style="font-family: 'Times New Roman', Times, serif"
          >RecYourSelf</span
        >
      </q-card>

      <div class="row wrap justify-center">
        <div v-for="r in recordings" :key="r.id" class="q-pb-md">
          <q-card class="q-ma-md col-5">
            <q-card-section>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <div class="text-h6">{{ r.title }}</div>
                    <div class="text-caption">{{ r.description }}</div>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat icon="more_vert" />
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section class="row">
              <audio controls class="col">
                <source :src="r.audio" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </q-card-section>

            <q-card-section class="row">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <div class="text-caption">Länge: {{ r.duration }}</div>
                    <div class="text-caption">Erstellt: {{ createdAtdate(r.createdAt) }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fixed-center {
  position: absolute;
  top: 48vh;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
