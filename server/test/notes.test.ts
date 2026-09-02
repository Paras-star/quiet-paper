import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { NoteStore } from "../src/store.js";

describe("quiet-paper notes API", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp(new NoteStore(":memory:"));
  });

  it("reports health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("starts with no notes", async () => {
    const res = await request(app).get("/api/notes");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("creates, reads, updates and deletes a note", async () => {
    const created = await request(app)
      .post("/api/notes")
      .send({ title: "First note", body: "hello world" });
    expect(created.status).toBe(201);
    expect(created.body.id).toBeTruthy();
    const id = created.body.id;

    const read = await request(app).get(`/api/notes/${id}`);
    expect(read.status).toBe(200);
    expect(read.body.title).toBe("First note");

    const updated = await request(app)
      .put(`/api/notes/${id}`)
      .send({ body: "updated body" });
    expect(updated.status).toBe(200);
    expect(updated.body.body).toBe("updated body");

    const removed = await request(app).delete(`/api/notes/${id}`);
    expect(removed.status).toBe(204);

    const missing = await request(app).get(`/api/notes/${id}`);
    expect(missing.status).toBe(404);
  });

  it("defaults an empty title to 'Untitled'", async () => {
    const res = await request(app).post("/api/notes").send({ body: "no title" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Untitled");
  });
});
