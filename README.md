# quiet-paper

A calm, minimal note-taking app. It is a small full-stack TypeScript project used
to demonstrate a working Cloud Agent development environment.

- **client/** — Vite + React + TypeScript single-page app (dev server on port `5173`).
- **server/** — Express + TypeScript REST API with JSON-file persistence (port `3001`).

## Prerequisites

- Node.js 22+
- npm 10+

## Getting started

```bash
npm install        # install all workspace dependencies
npm run dev        # run the API and the web client together
```

Then open http://localhost:5173. The Vite dev server proxies `/api/*` requests to
the API on port `3001`.

## Common commands

| Command             | Description                                        |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Run the API and web client concurrently            |
| `npm run dev:server`| Run only the API (Express, hot-reloaded via tsx)   |
| `npm run dev:client`| Run only the web client (Vite)                     |
| `npm run typecheck` | Type-check both workspaces                          |
| `npm run lint`      | Lint the codebase with ESLint                      |
| `npm test`          | Run the server test suite (Vitest + Supertest)     |
| `npm run build`     | Build the API and the web client for production     |

## API

Base URL: `http://localhost:3001`

| Method   | Path              | Description        |
| -------- | ----------------- | ------------------ |
| `GET`    | `/api/health`     | Health check       |
| `GET`    | `/api/notes`      | List notes         |
| `POST`   | `/api/notes`      | Create a note      |
| `GET`    | `/api/notes/:id`  | Get a single note  |
| `PUT`    | `/api/notes/:id`  | Update a note      |
| `DELETE` | `/api/notes/:id`  | Delete a note      |

Notes are persisted to `server/data/notes.json` (git-ignored). Set `NOTES_FILE`
to override the location, or `PORT` to change the API port.

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm install` and starts two
terminals (`server` and `client`) running the dev servers.
