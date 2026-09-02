import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createApp } from "./app.js";
import { NoteStore } from "./store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3001);
const DATA_FILE = process.env.NOTES_FILE ?? resolve(__dirname, "../data/notes.json");

const store = new NoteStore(DATA_FILE);
const app = createApp(store);

app.listen(PORT, () => {
  console.log(`[quiet-paper] API listening on http://localhost:${PORT}`);
});
