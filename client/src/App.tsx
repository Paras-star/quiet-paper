import { useEffect, useMemo, useState } from "react";
import { api, type Note } from "./api.js";

export function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId],
  );

  async function refresh() {
    try {
      const data = await api.list();
      setNotes(data);
      setStatus("ready");
      return data;
    } catch {
      setStatus("error");
      return [];
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (selected) {
      setTitle(selected.title);
      setBody(selected.body);
    } else {
      setTitle("");
      setBody("");
    }
  }, [selectedId, selected]);

  async function handleNew() {
    const note = await api.create("Untitled", "");
    const data = await refresh();
    setSelectedId(note.id);
    void data;
  }

  async function handleSave() {
    if (!selectedId) return;
    await api.update(selectedId, title, body);
    await refresh();
  }

  async function handleDelete(id: string) {
    await api.remove(id);
    if (selectedId === id) setSelectedId(null);
    await refresh();
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <header className="sidebar__header">
          <h1 className="brand">quiet&nbsp;paper</h1>
          <button className="btn btn--primary" onClick={handleNew}>
            + New note
          </button>
        </header>
        <p className="sidebar__meta">
          {status === "loading" && "Loading…"}
          {status === "error" && "Cannot reach API"}
          {status === "ready" &&
            `${notes.length} note${notes.length === 1 ? "" : "s"}`}
        </p>
        <ul className="note-list">
          {notes.map((n) => (
            <li key={n.id}>
              <button
                className={
                  "note-list__item" +
                  (n.id === selectedId ? " note-list__item--active" : "")
                }
                onClick={() => setSelectedId(n.id)}
              >
                <span className="note-list__title">{n.title || "Untitled"}</span>
                <span className="note-list__preview">
                  {n.body.slice(0, 48) || "No content yet"}
                </span>
              </button>
            </li>
          ))}
          {status === "ready" && notes.length === 0 && (
            <li className="note-list__empty">No notes yet. Create one!</li>
          )}
        </ul>
      </aside>

      <main className="editor">
        {selected ? (
          <>
            <input
              className="editor__title"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="editor__body"
              value={body}
              placeholder="Start writing…"
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="editor__actions">
              <button className="btn btn--primary" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => handleDelete(selected.id)}
              >
                Delete
              </button>
              <span className="editor__timestamp">
                Updated {new Date(selected.updatedAt).toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <div className="editor__empty">
            <h2>Select a note</h2>
            <p>Pick a note from the left, or create a new one to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}
