import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const dbFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json');
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

app.use('/public', express.static(publicDir));

// Funktion zum Lesen der Daten aus der db.json-Datei
function readData() {
  if (!fs.existsSync(dbFilePath)) {
    return { recordings: [] };
  }
  const data = fs.readFileSync(dbFilePath);
  return JSON.parse(data);
}

// Funktion zum Schreiben der Daten in die db.json-Datei
function writeData(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

// Initialisiere die Aufnahmen beim Start des Servers
let recordings = readData().recordings;
let id = recordings.length ? recordings[recordings.length - 1].id + 1 : 1;

// Erstelle eine neue Aufnahme
app.post('/recordings', (req, res, next) => {
  try {
    const { title, description, audio } = req.body;

    if (!title || !description || !audio) {
      throw new Error('Missing required fields');
    }

    // Validiere und protokolliere das Audio-Feld
    if (typeof audio !== 'string' || !audio.startsWith('data:audio/wav;base64,')) {
      throw new Error('Invalid audio format');
    }

    // Speichere die Audiodatei als .wav im public-Verzeichnis
    const buffer = Buffer.from(audio.split('base64,')[1], 'base64');
    const audioFileName = `${title}_${id}.wav`;
    const audioFilePath = path.join(publicDir, audioFileName);
    fs.writeFileSync(audioFilePath, buffer);

    const newRecording = {
      id: id++,
      title,
      description,
      audio: `/Public/${audioFileName}`, // Speichere den Dateipfad anstelle von Base64-Daten
      createdAt: new Date()
        .toLocaleString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        .replace(',', ''),
    };

    recordings.push(newRecording);
    writeData({ recordings });
    res.status(201).json(newRecording);
  } catch (error) {
    next(error);
  }
});

// Gibt alle Aufnahmen zurück
app.get('/recordings', (req, res, next) => {
  try {
    res.json(recordings);
  } catch (error) {
    next(error);
  }
});

// Löscht eine Aufnahme anhand der ID
app.delete('/recordings/:id', (req, res, next) => {
  try {
    const recordingId = parseInt(req.params.id, 10);
    const recordingIndex = recordings.findIndex((r) => r.id === recordingId);

    if (recordingIndex === -1) {
      return res.status(404).send({ error: 'Recording not found' });
    }

    const [recording] = recordings.splice(recordingIndex, 1);
    const audioFilePath = path.join(publicDir, path.basename(recording.audio));
    if (fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
    }

    writeData({ recordings });
    res.status(200).send({ message: 'Recording deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

// Starte den Server und lausche auf dem konfigurierten Port
app.listen(port, () => {
  console.log(`JSON server running at http://localhost:${port}`);
});

// Aktualisiert eine bestehende Aufnahme anhand der ID
app.put('/recordings/:id', (req, res, next) => {
  try {
    const recordingId = parseInt(req.params.id, 10);
    const { title, description } = req.body;

    // Lese aktuelle Daten
    const data = readData();
    const idx = data.recordings.findIndex((r) => r.id === recordingId);
    if (idx === -1) {
      return res.status(404).send({ error: 'Recording not found' });
    }

    // Update Werte
    data.recordings[idx].title = title;
    data.recordings[idx].description = description;

    // Speichere Daten und aktualisiere den Array
    writeData(data);
    recordings = data.recordings;

    res.status(200).json(data.recordings[idx]);
  } catch (error) {
    next(error);
  }
});
