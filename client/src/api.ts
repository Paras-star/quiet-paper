export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const api = {
  list: () => fetch("/api/notes").then((r) => json<Note[]>(r)),
  create: (title: string, body: string) =>
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    }).then((r) => json<Note>(r)),
  update: (id: string, title: string, body: string) =>
    fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    }).then((r) => json<Note>(r)),
  remove: (id: string) =>
    fetch(`/api/notes/${id}`, { method: "DELETE" }).then((r) => json<void>(r)),
};
