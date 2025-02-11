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

// Funktion zum Erstellen eines Backups
function createBackup() {
  const backupFilePath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    `backup-${Date.now()}.json`,
  );
  fs.writeFileSync(backupFilePath, JSON.stringify(recordings, null, 2));
  console.log(`Backup created at ${backupFilePath}`);
}

app.post('/recordings', (req, res, next) => {
  try {
    const { title, description, audio } = req.body;

    if (!title || !description || !audio) {
      throw new Error('Missing required fields');
    }

    const newRecording = {
      id: id++,
      title,
      description,
      audio,
      createdAt: new Date().toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      }).replace(',', ''),
    };

    recordings.push(newRecording);
    writeData({ recordings });
    res.status(201).json(newRecording);
  } catch (error) {
    next(error);
  }
});

app.get('/recordings', (req, res, next) => {
  try {
    res.json(recordings);
  } catch (error) {
    next(error);
  }
});

// Endpunkt zum Erstellen eines Backups
app.post('/backup', (req, res, next) => {
  try {
    createBackup();
    res.status(200).send('Backup created successfully');
  } catch (error) {
    next(error);
  }
});

// Fehlerbehandlungs-Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

app.listen(port, () => {
  console.log(`JSON server running at http://localhost:${port}`);
});
