import express, { type Express } from "express";
import cors from "cors";
import { NoteStore } from "./store.js";

export function createApp(store: NoteStore): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "quiet-paper", time: new Date().toISOString() });
  });

  app.get("/api/notes", (_req, res) => {
    res.json(store.list());
  });

  app.get("/api/notes/:id", (req, res) => {
    const note = store.get(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  });

  app.post("/api/notes", (req, res) => {
    const { title, body } = req.body ?? {};
    if (typeof title !== "string" && typeof body !== "string") {
      return res.status(400).json({ error: "title or body is required" });
    }
    const note = store.create({ title: title ?? "", body: body ?? "" });
    res.status(201).json(note);
  });

  app.put("/api/notes/:id", (req, res) => {
    const { title, body } = req.body ?? {};
    const note = store.update(req.params.id, { title, body });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  });

  app.delete("/api/notes/:id", (req, res) => {
    const removed = store.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: "Note not found" });
    res.status(204).end();
  });

  return app;
}
