<script setup>
import { ref, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useRouter} from 'vue-router';
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
  isRecording.value = true;
  isPaused.value = false;
  audioChunks = [];
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      audioUrl.value = reader.result;
      $q.notify({
        type: 'positive',
        message: 'Audio created successfully!',
      });
    };
  };
  mediaRecorder.start();
};

const pauseRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.pause();
    isPaused.value = true;
  }
};

const resumeRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'paused') {
    mediaRecorder.resume();
    isPaused.value = false;
  }
};

const stopRecording = () => {
  isRecording.value = false;
  isPaused.value = false;
  mediaRecorder.stop();
};

const handleSubmit = async () => {
  if (!audioUrl.value) {
    $q.notify({
      type: 'negative',
      message: 'Please record audio before submitting.',
    });
    return;
  }

  // Ensure the audio data is correctly formatted
  const audioBase64 = audioUrl.value;

  try {
    const response = await axios.post('http://localhost:3000/recordings', {
      title: title.value,
      description: description.value,
      audio: audioBase64, // Send the full base64 string with prefix
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
            <q-btn @click="startRecording" :disable="isRecording" icon="mic" :color="isRecording ? 'red' : 'primary'" />
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
