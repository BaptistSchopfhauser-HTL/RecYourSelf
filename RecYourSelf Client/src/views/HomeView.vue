<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const recordings = ref([]);

const fetchdata = async () => {
  try {
    const response = await axios.get('http://localhost:3000/recordings');
    recordings.value = response.data;
    console.log('recordings:', recordings.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

onMounted(() => {
  setTimeout(() => {
    Loding.value = false;
  }, 500);

  Loding.value = true;
  fetchdata();
  sortRecordings();
});

const sortRecordings = () => {
  recordings.value.sort((a, b) => {
    if (sortOrder.value === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });
};

const sortOrder = ref('asc');
const itemsPerRow = ref(3);

const Loding = ref(true);
</script>

<template>
  <div v-if="Loding">
    <q-spinner size="100px" color="primary" />
  </div>

  <div v-else class="row justify-center wrap">
    <q-card class="overlay-card text-center q-pa-md q-mb-md col-sm-7 col-12">
      <div class="text-h4 text-weight-light">Welcome to</div>
      <div class="text-bold text-h3" style="font-family: 'Times New Roman', Times, serif">
        RecYourSelf
      </div>
    </q-card>

    <div bordered class=" col-12 q-pa-md overlay-card shadow-10">
      <q-item-label class="text-h4 q-mb-md text-weight-light">Recordings:</q-item-label>
 
      <div class="row justify-center wrap">
        <div class="q-pa-md col-12 gt-sm">
          <q-select
            v-model="itemsPerRow"
            :options="[1, 2, 3, 4]"
            label="Items per row"
            color="primary"
            class="q-mb-md"
          />
          <q-btn
            @click="
              sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
              sortRecordings();
            "
            label="Sort"
            icon="sort"
            color="primary"
            class="q-mb-md"
          />
        </div>

        <q-item
          v-for="recording in recordings"
          :key="recording.id"
          :class="`col-12 col-md-${12 / itemsPerRow}`"
        >
          <q-card bordered class="q-pa-md col recording-card" style="">
            <q-card-section>
              <div class="text-h6">{{ recording.title }}</div>
              <div class="text-subtitle2">{{ recording.description }}</div>
              <div class="text-caption q-mb-md">Created at: {{ recording.createdAt }}</div>
              <audio
                :src="'data:audio/wav;base64,' + recording.audio"
                controls
                class="q-mt-md q-mb-md"
                style="background-color: #f1f4f5"
              ></audio>
            </q-card-section>
          </q-card>
        </q-item>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-card {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  padding: 20px;
  border-radius: 10px;
}

.recording-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */

  /* Smooth transition for hover effect */
}

.recording-card:hover {
  transform: translateY(-5px); /* Lift the card slightly on hover */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

  transition: transform 0.3s, box-shadow 0.3s;
}

.recording-card audio {
  width: 100%;
  background-color: #f1f4f5; /* Light gray background */
  border-radius: 5px;

  /* Smooth transition for hover effect */

  transition: background-color 0.3s;

  /* Prevent the audio player from being too tall */

  max-height: 50px;

  /* Center the audio player */

  margin: 0 auto;

  /* Add some space above and below the audio player */

  margin-top: 10px;

  margin-bottom: 10px;
}
</style>
