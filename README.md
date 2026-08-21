<div align="center">

# 🖥️ Kaalyug OS

**An interactive, macOS-inspired portfolio operating system — built to be explored, not just read.**

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white&style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white&style=flat-square)](https://vite.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?logo=mongodb&logoColor=white&style=flat-square)](https://mongodb.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285f4?logo=google&logoColor=white&style=flat-square)](https://ai.google.dev)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel&logoColor=white&style=flat-square)](https://vercel.com)

> **By [Dirghraj Giri](https://github.com/drj7zz)** — BIT Student | Frontend Developer | Madhesh, Nepal 🇳🇵

</div>

---

## 📸 Two Views — One OS

> Kaalyug OS automatically adapts to your device. It renders as a full **macOS desktop** on larger screens, and as a native **iOS-style home screen** on mobile.

| macOS Desktop View | iOS Mobile View |
|---|---|
| Floating draggable windows | Bottom-sheet slide-up panels |
| macOS menu bar + dock | iOS status bar + frosted dock |
| Traffic-light window controls | Drag handle + swipe to dismiss |
| Spotlight search (⌘K) | Full-screen app grid |

---

## ✨ Features

| App | Description |
|---|---|
| 🤖 **Yug AI** | Gemini-powered AI with full portfolio context — ask anything |
| 💬 **Yug Chat** | MongoDB-backed global chat — all visitors share one room |
| 📊 **GitHub Analytics** | Live stat cards + repo browser from GitHub API |
| 🐍 **Snake** | Canvas game — keyboard on desktop, swipe + d-pad on mobile |
| 🔮 **Liquid Glass Lockscreen** | Animated blobs + frosted glass unlock, lockscreen-only Support |
| 🔔 **Notification Center** | Dismissible cards + browser push permission request |
| 📖 **Tutorial** | 4-step onboarding modal with progress indicators |
| 🌐 **Browser** | Embedded iframe browser with external-open fallback |
| 💻 **Terminal** | Fake shell with portfolio-specific commands |
| 🗂️ **Finder** | Browse and launch all applications |
| ⚙️ **Settings** | Dark / Blue / Pink themes + Kaalyug OS v1.0 info |

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client ["🌐 Client (Vercel CDN)"]
        direction TB
        LS["🔮 LockScreen\n──────────────\nLiquid glass blobs\nSupport overlay"]
        DE["🖥️ Desktop\n──────────────\nMenu bar · Dock\nNotifications · Tutorial"]
        WI["📦 Window\n──────────────\nAll app renderers\n12 apps total"]
        LS -->|unlock| DE
        DE -->|open app| WI
    end

    subgraph Backend ["⚙️ Backend (Render)"]
        direction TB
        EX["Express Server\nPort 10000"]
        CH["/api/chat\nYug AI endpoint"]
        MS["/api/messages\nYug Chat endpoint"]
        EX --> CH
        EX --> MS
    end

    subgraph Services ["🔌 External Services"]
        GEM["✨ Google Gemini\ngemini-flash-latest"]
        MON["🍃 MongoDB Atlas\nMessages collection"]
        GH["🐙 GitHub API\nPublic · No auth"]
    end

    WI -->|"POST question"| CH
    WI -->|"GET/POST"| MS
    WI -->|"public fetch"| GH
    CH -->|generateContent| GEM
    MS <-->|read/write| MON
```

---

## 🔄 User Flow

```mermaid
flowchart LR
    A([Visit URL]) --> B{Device?}
    B -->|Desktop| C[macOS View\nFloating windows]
    B -->|Mobile| D[iOS View\nBottom sheets]

    C --> E[LockScreen\nLiquid glass]
    D --> E

    E -->|Click / Enter| F[Desktop\nDock + Menu bar]
    F --> G{Choose app}

    G -->|Yug AI| H[Chat with\nGemini AI]
    G -->|Yug Chat| I[Global chat\nMongoDB]
    G -->|Analytics| J[GitHub\nLive stats]
    G -->|Snake| K[Play game\nKeyboard or touch]
    G -->|Other| L[Browse portfolio\ncontent]

    H & I & J & K & L --> F
```

---

## 📂 Project Structure

```
giridirghraj/
├── 🌐 frontend/               → Vite + React (→ Vercel)
│   ├── public/
│   │   ├── bg.jpeg            Wallpaper
│   │   ├── drj1.jpg           Profile photo
│   │   └── context.txt        Yug AI system prompt
│   ├── src/components/
│   │   ├── LockScreen.jsx     Liquid glass lockscreen
│   │   ├── Desktop.jsx        Menu, dock, notifications, tutorial
│   │   └── Window.jsx         All 12 app renderers
│   ├── .env.example           → set VITE_API_BASE_URL
│   └── package.json
│
├── ⚙️ backend/                → Express + Node.js (→ Render)
│   ├── server.js              Chat + messages API
│   ├── .env.example           → fill MONGODB_URI + GEMINI_API_KEY
│   └── package.json
│
├── .gitignore                 Blocks all .env files
└── README.md                  You are here!
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Gemini API key — [get one free →](https://aistudio.google.com/apikey)

### 1. Clone

```bash
git clone https://github.com/drj7zz/giridirghraj.git
cd giridirghraj
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # fill in real values
npm install
node server.js
# → Kaalyug backend listening on http://localhost:10000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# Set: VITE_API_BASE_URL=http://localhost:10000/api
npm install
npm run dev
# → http://localhost:5173
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Connect GitHub repo to [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Add env variable in Vercel dashboard:

```
VITE_API_BASE_URL = https://YOUR_RENDER_BACKEND.onrender.com/api
```

### Backend → Render

1. New **Web Service** on [render.com](https://render.com)
2. Root directory: `backend`
3. Start command: `node server.js`
4. Environment variables:

| Variable | Value |
|---|---|
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `MONGODB_DB` | `kaalyug` |
| `FRONTEND_ORIGIN` | `https://your-project.vercel.app` |
| `GEMINI_API_KEY` | Your Gemini key |

---

## 🔒 Security

- ✅ All secrets in environment variables — never hardcoded
- ✅ `.gitignore` blocks all `*.env*` except `.env.example`
- ✅ CORS restricted to `FRONTEND_ORIGIN` in production
- ✅ JSON body limit: 20kb per request
- ✅ Old credentials invalidated and credentials file deleted
- ✅ No MongoDB driver in frontend bundle

---

## 🛠️ Tech Stack

**Frontend** · React 19, Vite 8, react-rnd, react-markdown, Lucide icons, Vanilla CSS

**Backend** · Node.js, Express, MongoDB Atlas, `@google/generative-ai`

**Hosting** · Vercel (frontend) · Render (backend) · MongoDB Atlas (DB) · Google AI Studio (AI)

---

## 📬 Contact

**Dirghraj Giri** · Madhesh, Nepal

[![Email](https://img.shields.io/badge/Email-giridirghraj%40gmail.com-red?logo=gmail&style=flat-square)](mailto:giridirghraj@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-drj7zz-181717?logo=github&style=flat-square)](https://github.com/drj7zz)
[![Instagram](https://img.shields.io/badge/Instagram-@drj7zz-E1306C?logo=instagram&style=flat-square)](https://www.instagram.com/drj7zz)

---
