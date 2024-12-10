<script setup>
import { ref } from 'vue';

const title = ref('');
const description = ref('');
const isRecording = ref(false);
const r = ref({ audio: '' });
</script>

<template>
  <div class="q-ma-md">
    <q-card class="q-ma-md">
      <q-card-section>
        <q-item>
          <q-item-section>
            <q-item-label>
              <div class="text-h6">New Record</div>
              <div class="text-caption">Record your voice here</div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-section class="row">
        <q-btn @click="isRecording ? stopRecording() : startRecording()">
          {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
        </q-btn>
      </q-card-section>
      <q-card-section class="row">
        <audio controls class="col">
          <source :src="r.audio" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </q-card-section>
      <q-card-section class="row">
        <q-item class="col col-12">
          <q-item-section>
            <q-item-label>
              <q-input v-model="title" label="Title" />
              <q-input v-model="description" label="Description" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" />
        <q-btn color="primary" label="Save" @click="saveRecording" />
      </q-card-actions>
    </q-card>
  </div>
</template>
