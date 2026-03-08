# Full-Stack Take-Home Assignment (3-5 Days)
## Mini-Fleet Monitor for Virtual Robots

## Goal
Build a small but fully working web application that:
- manages a list of virtual robots,
- displays their positions on a map (OpenLayers),
- receives live position updates from the server,
- and secures users via login/token authentication.

## Required Tech Stack
### Backend
- Node.js + Express
- PostgreSQL as persistent database
- Redis as cache + (optional) Pub/Sub for live updates
- JWT authentication (login + protected routes)
- HTTPS or HTTP with CORS (no self-signed certificate required)
- REST + WebSocket for server-client communication
- Docker Compose with Postgres + Redis

### Frontend
- React (JavaScript) with HTML/CSS
- OpenLayers map integration
- Login form and protected dashboard page
- Robots shown as map markers with live position updates

## Minimum Requirements

### Data Model (simple)
#### `users`
- `id`
- `email`
- `password_hash`
- `created_at`

#### `robots`
- `id`
- `name`
- `status` (`idle | moving`)
- `lat`
- `lon`
- `updated_at`

### Backend Endpoints
| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/login` | Login with email/password, return JWT |
| `GET` | `/robots` | Return all robots (JWT-protected) |
| `POST` | `/robots/:id/move` | Simulate a new random position |

### Required Runtime Behavior
- Robot movement must run automatically.
- Robot position updates must be pushed to the UI via WebSocket.

### Optional Endpoint Extension
- `POST /robots` to add a robot
- Redis cache for `GET /robots` results (TTL: 10 seconds)

## Authentication
- JWT-based login
- Store token in frontend (memory or `localStorage`)
- Protected API routes must validate JWT via middleware
- No refresh token required (access token only)

## Simulation (Server)
Implement a script or timer that runs every 2 seconds and:
1. generates random new positions for robots,
2. updates robot positions in PostgreSQL,
3. publishes/broadcasts updates to clients (via Redis or direct WebSocket broadcast).

## Frontend Features
### Login Page
- Input fields: email, password
- On successful login: store token and redirect to dashboard

### Dashboard
- OpenLayers map with robot markers
- WebSocket (or SSE) connection for live position updates
- Marker positions update in real time
- Robot list next to map showing:
  - name
  - status
  - latest position

## Setup & Submission Requirements
Running `docker-compose up` should start:
- `api` (Node.js)
- `db` (PostgreSQL)
- `redis`
- optional `frontend`

Include a sample user:
- `admin@test.com` / `test123`

Provide a `README.md` containing:
- setup steps
- short architecture explanation (1 paragraph)
- sample screenshots (login, map with robots)

## Bonus Points (Optional)
- Redis Pub/Sub instead of in-memory broadcast

- Deployment-ready setup with `Dockerfile` + `docker-compose`

## Evaluation Focus
- Correctness of required functionality
- Clean code structure and readability
- Reliable real-time update flow
- Reasonable API/security implementation for scope
- Clear setup instructions and developer experience

## Deliverable
A runnable repository that can be started via Docker Compose and demonstrates login, protected robot APIs, and live map updates.
