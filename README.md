# 🗳️ PRATINIDHI

### **AI-Powered Political Avatar & Real-Time Analytics Platform**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-pratinidhi--beta.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://pratinidhi-beta.vercel.app)

---

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## ✨ Features

- 🤖 **AI Political Avatar (JanAvatar)** — Users interact with a personalized AI avatar that represents a political figure or constituency, powered by a FastAPI-hosted LLM backend
- 📊 **Real-Time Sentiment Analytics** — Live political sentiment tracking across topics, visualized as interactive charts and trend graphs
- 🗂️ **Constituency Registration System** — Citizens and candidates register with constituency-level data, enabling hyper-local insights
- 🔗 **RAG-Powered Q&A** — The backend uses Retrieval-Augmented Generation to answer political/policy questions grounded in real document data
- 🌐 **Decoupled Full-Stack Architecture** — React + Vite frontend deployed independently from the Python FastAPI backend, enabling scalable separate deployments

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, JavaScript |
| Styling | CSS Modules / Tailwind CSS |
| Backend | FastAPI (Python 3.11) |
| AI / RAG | Python LLM integration, vector-based retrieval |
| Deployment (Frontend) | Vercel |
| Deployment (Backend) | Render / Railway |

---

## 🏛️ Architecture

```
User (Browser)
  │
  ▼
React + Vite Frontend (Vercel)
  │── /register          ← Constituency registration form
  │── /avatar            ← JanAvatar AI chat interface
  │── /analytics         ← Real-time sentiment dashboard
  │
  │  REST API calls (axios / fetch)
  │
  ▼
FastAPI Backend (Python)
  │── POST /register     ← Store constituency registration
  │── POST /chat         ← JanAvatar AI response (RAG pipeline)
  │── GET  /sentiment    ← Aggregated political sentiment data
  │
  ▼
Vector Store + LLM
  │── Document embeddings (political policy docs)
  │── LLM inference for avatar responses
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18.x
- Python ≥ 3.11
- pip

### 1. Clone the Repository

```bash
git clone https://github.com/OMKAR-PSN/PRATINIDHI.git
cd PRATINIDHI
```

### 2. Start the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

Frontend runs at `http://localhost:5173` (or `http://localhost:3000`).

### 3. Start the Backend

Open a **second terminal**:

```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

Backend API runs at `http://localhost:8000`.  
Interactive API docs available at `http://localhost:8000/docs`.

### 4. Environment Variables

Create a `.env` file inside `backend/`:

```env
OPENAI_API_KEY=your-openai-or-gemini-key-here
VECTOR_STORE_PATH=./data/vectorstore
CORS_ORIGIN=http://localhost:5173
```

> Both terminals must remain open while using the application.

---

## 📸 Screenshots

Shortly coming...

---

## 🚀 Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | [pratinidhi-beta.vercel.app](https://pratinidhi-beta.vercel.app) |
| Backend API | Render / Railway | *(add your API URL here)* |

> ⚠️ If hosted on a free tier, the backend API may take **~30 seconds on cold start**. Refresh if the first request times out.

---

## 👥 Team

| Name | Role | GitHub |
|---|---|---|
| Omkar | Full-Stack Developer | [@OMKAR-PSN](https://github.com/OMKAR-PSN) |
| *Aryan Dalvi* | *AI & ML* | *(link)* |
| *Rohit Shetty* | *Frontend Developer* | *(link)* |
| *Dishan Shaikh* | *Backend Developer* | *(link)* |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <i>PRATINIDHI — giving every citizen a voice, and every voice a platform.</i>
</div>
