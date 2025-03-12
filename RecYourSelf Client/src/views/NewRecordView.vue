<script setup>
import { ref, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const router = useRouter();
const title = ref('');
const description = ref('');
const isRecording = ref(false);
const isPaused = ref(false);
const audioUrl = ref(null);

let mediaRecorder;
let audioChunks = [];

const startRecording = async () => {
  isRecording.value = true; // Aufnahme als gestartet markieren
  isPaused.value = false; // Aufnahme nicht pausiert
  audioChunks = []; // Frühere Audio-Chunks löschen
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Mikrofonzugriff anfordern
  mediaRecorder = new MediaRecorder(stream); // MediaRecorder erstellen
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data); // Audio-Daten speichern
  };
  mediaRecorder.onstop = () => {
    // Wenn Aufnahme stoppt, Daten verarbeiten
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // Blob aus Audio-Chunks erstellen
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob); // Blob in Base64 konvertieren
    reader.onloadend = () => {
      audioUrl.value = reader.result; // Base64-Audio speichern
      $q.notify({
        type: 'positive',
        message: 'Audio created successfully!',
      });
    };
  };
  mediaRecorder.start(); // Aufnahme starten
};

const pauseRecording = () => {
  // Aufnahme pausieren, wenn läuft
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.pause(); // pausieren
    isPaused.value = true; // Status pausiert
  }
};

const resumeRecording = () => {
  // Aufnahme fortsetzen, wenn pausiert
  if (mediaRecorder && mediaRecorder.state === 'paused') {
    mediaRecorder.resume(); // fortsetzen
    isPaused.value = false; // Pausiert-Status entfernen
  }
};

const stopRecording = () => {
  // Aufnahme stoppen
  isRecording.value = false; // Aufnahme-Status zurücksetzen
  isPaused.value = false; // Pausiert-Status zurücksetzen
  mediaRecorder.stop(); // MediaRecorder stoppen
};

const handleSubmit = async () => {
  if (!audioUrl.value) {
    // Wenn Audio nicht aufgenommen, Fehler Nachricht
    $q.notify({
      type: 'negative',
      message: 'Please record audio before submitting.',
    });
    return;
  }

  const audioBase64 = audioUrl.value;

  try {
    // Daten an Server senden
    const response = await axios.post('http://localhost:3000/recordings', {
      title: title.value,
      description: description.value,
      audio: audioBase64, // Base64-String senden
    });
    console.log('Recording saved:', response.data);
  } catch (error) {
    console.error('Error saving recording:', error);
    $q.notify({
      type: 'negative',
      message: 'Error saving recording.',
    });
  }
  $q.notify({
    type: 'positive',
    message: 'Recording saved successfully!',
  });
  router.push('/');
};

const warnUnsavedChanges = (event) => {
  // Warnung, wenn ungespeicherte Änderungen vorliegen
  if (isRecording.value || audioUrl.value) {
    event.preventDefault();
    event.returnValue = '';
  }
};

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', warnUnsavedChanges);
});

window.addEventListener('beforeunload', warnUnsavedChanges);
</script>

<template>
  <div class="overlay-card q-pa-md q-mb-md col-md-7 col-12">
    <q-card-section>
      <div class="text-h6">New Audio Record</div>
      <div class="text-subtitle2">Record your voice and save it</div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="handleSubmit">
        <q-input v-model="title" label="Title" required />
        <q-input v-model="description" label="Description" type="textarea" required />

        <div class="audio-recorder q-mt-md">
          <div class="controls">
            <q-btn
              @click="startRecording"
              :disable="isRecording"
              icon="mic"
              :color="isRecording ? 'red' : 'primary'"
            />
            <q-btn
              @click="pauseRecording"
              :disable="!isRecording || isPaused"
              icon="pause"
              color="primary"
            />
            <q-btn
              @click="resumeRecording"
              :disable="!isPaused"
              icon="play_arrow"
              color="primary"
            />
            <q-btn @click="stopRecording" :disable="!isRecording" icon="stop" color="primary" />
          </div>
          <audio v-if="audioUrl" :src="audioUrl" controls class="q-mt-md"></audio>
        </div>

        <q-btn type="submit" label="Save Recording" color="primary" class="q-mt-md text-center" />
      </q-form>
    </q-card-section>
  </div>
</template>

<style scoped>
.audio-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
</style>
