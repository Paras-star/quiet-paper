import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  body: string;
}

/**
 * A tiny JSON-file backed note store. Persistence is intentionally
 * dependency-free (no native modules) so the environment installs cleanly.
 * Pass `":memory:"` to keep everything in-process (used by tests).
 */
export class NoteStore {
  private notes: Note[] = [];
  private readonly filePath: string | null;

  constructor(filePath: string | null) {
    this.filePath = filePath === ":memory:" ? null : filePath;
    this.load();
  }

  private load(): void {
    if (!this.filePath || !existsSync(this.filePath)) return;
    try {
      this.notes = JSON.parse(readFileSync(this.filePath, "utf8"));
    } catch {
      this.notes = [];
    }
  }

  private persist(): void {
    if (!this.filePath) return;
    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(this.filePath, JSON.stringify(this.notes, null, 2));
  }

  list(): Note[] {
    return [...this.notes].sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt),
    );
  }

  get(id: string): Note | undefined {
    return this.notes.find((n) => n.id === id);
  }

  create(input: NoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title: input.title.trim() || "Untitled",
      body: input.body ?? "",
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    this.persist();
    return note;
  }

  update(id: string, input: Partial<NoteInput>): Note | undefined {
    const note = this.get(id);
    if (!note) return undefined;
    if (input.title !== undefined) note.title = input.title.trim() || "Untitled";
    if (input.body !== undefined) note.body = input.body;
    note.updatedAt = new Date().toISOString();
    this.persist();
    return note;
  }

  remove(id: string): boolean {
    const before = this.notes.length;
    this.notes = this.notes.filter((n) => n.id !== id);
    const removed = this.notes.length !== before;
    if (removed) this.persist();
    return removed;
  }
}
