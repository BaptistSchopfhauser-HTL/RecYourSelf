<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
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

const deleteRecording = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/recordings/${id}`);
    recordings.value = recordings.value.filter((recording) => recording.id !== id);
    $q.notify({
      type: 'positive',
      message: 'Recording deleted successfully!',
    });
  } catch (error) {
    console.error('Error deleting recording:', error);
    $q.notify({
      type: 'negative',
      message: 'Error deleting recording.',
    });
  }
};

// Für den Edit-Dialog
const showEditDialog = ref(false);
const editId = ref(null);
const editTitle = ref('');
const editDescription = ref('');

const openEdit = (recording) => {
  editId.value = recording.id;
  editTitle.value = recording.title;
  editDescription.value = recording.description;
  showEditDialog.value = true;
};

const saveEdit = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/recordings/${editId.value}`, {
      title: editTitle.value,
      description: editDescription.value,
    });

    // Update das Aufnahme-Array
    const idx = recordings.value.findIndex((r) => r.id === editId.value);
    if (idx !== -1) {
      recordings.value[idx] = response.data;
    }

    $q.notify({
      type: 'positive',
      message: 'Recording updated successfully!',
    });
  } catch (error) {
    console.error('Error updating recording:', error);
    $q.notify({
      type: 'negative',
      message: 'Error updating recording.',
    });
  }

  showEditDialog.value = false;
};

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

onMounted(() => {
  Loding.value = true;
  fetchdata();
  sortRecordings();
  setTimeout(() => {
    Loding.value = false;
  }, 500);
});
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

    <div bordered class="col-12 q-pa-md overlay-card shadow-10">
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
          <q-card bordered class="q-pa-md col recording-card">
            <q-card-section>
              <div class="text-h6">{{ recording.title }}</div>
              <div class="text-subtitle2">{{ recording.description }}</div>
              <div class="text-caption q-mb-md">Created at: {{ recording.createdAt }}</div>
              <audio
                :src="`http://localhost:3000${recording.audio}`"
                controls
                class="q-mt-md q-mb-md"
                style="background-color: #f1f4f5"
              ></audio>
              <div class="row justify-center">
                <q-btn
                  @click="deleteRecording(recording.id)"
                  icon="delete"
                  color="negative"
                  class="q-mt-md"
                />
                <q-btn
                  @click="openEdit(recording)"
                  icon="edit"
                  color="blue"
                  class="q-mt-md q-ml-sm"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-item>
      </div>
    </div>
  </div>

  <!-- Edit Dialog -->
  <q-dialog v-model="showEditDialog">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Edit Recording</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="editTitle" label="Title" filled />
        <q-input
          v-model="editDescription"
          label="Description"
          type="textarea"
          filled
          class="q-mt-md"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="showEditDialog = false" />
        <q-btn flat label="Save" color="primary" @click="saveEdit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.recording-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.recording-card audio {
  width: 100%;
  background-color: #f1f4f5;
  border-radius: 5px;
  transition: background-color 0.3s;
  max-height: 50px;
  margin: 10px auto;
}
</style>
