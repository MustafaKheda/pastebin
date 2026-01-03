# Pastebin-Lite (NestJS)

A lightweight Pastebin-like application built with **NestJS**.  
Users can create text pastes, receive a shareable URL, and view the paste until it expires or exceeds its view limit.

This project is designed to pass automated tests for the take-home assignment.

---

## Run the Project Locally

### 1. Install dependencies
``` bash
npm install
```
###  Create a .env file in the project root
REDIS_URL=rediss://<your-redis-url>
TEST_MODE=1
### 3. Start the application
``` bash
npm run start:dev
http://localhost:5000
```
## Persistence Layer
This application uses Redis as its persistent storage layer.

Redis is used to store paste data so that it persists across requests and works correctly in serverless environments where in-memory storage cannot be relied upon.

Each paste is stored as a JSON object under a Redis key in the format:
``` bash
paste:<id>
```

##  Features

- Create a text paste
- Generate a shareable URL
- View paste content via API or HTML page
- Optional constraints:
  - Time-to-live (TTL)
  - Maximum view count
- Deterministic expiry support for automated testing
- Redis-backed persistence (serverless-safe)

---

## 🛠 Tech Stack

- **Backend:** NestJS (Node.js, TypeScript)
- **Persistence:** Redis (Upstash compatible)
- **Runtime:** Node.js 18+
- **Deployment-ready:** Vercel / Railway / Fly.io

