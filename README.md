<div align="center">
  <img src="frontend/public/dataverse-logo.png" alt="DataVerse Logo" width="120" />
  <h1>DataVerse Enterprise</h1>
  <p><strong>AI-powered natural language data analytics platform</strong></p>
</div>

---

**DataVerse** is a modern data analytics workspace that allows users to upload datasets (CSV/Excel) and query them using natural English. By securely sandboxing AI-generated Python code, DataVerse performs complex data processing, extracts hidden business insights, and renders interactive visual charts—all instantly.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![DUCKDB](https://img.shields.io/badge/Duck-DB?style=flat-square&logo=duckdb)](https://duckdb.org/)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203.3-orange?style=flat-square&logo=groq)](https://groq.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%204-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Pandas](https://img.shields.io/badge/Data_Analysis-Pandas-150458?style=flat-square&logo=pandas)](https://pandas.pydata.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

## ✨ Key Features

- 🧠 **Conversational Analytics**: Ask questions in plain English. The AI generates and executes Pandas/DuckDB queries to find the answer.
- 📊 **Interactive Visualizations**: Automatically generates Plotly charts with high-resolution export capabilities (PNG/SVG).
- ⚡ **Blazing Fast Processing**: Leverages in-memory Pandas combined with DuckDB for advanced SQL-like aggregations.
- 🔒 **Secure Execution**: AI-generated code is executed in a controlled Python sandbox environment.
- 🎨 **Premium UI/UX**: A dark-mode, glassmorphism interface built with React and TailwindCSS.
- 🔐 **Robust Authentication**: Powered by Supabase (OAuth support for Google & GitHub).
- 💾 **Session Management**: Chat histories and uploaded files are saved via MongoDB, allowing seamless continuation of past analytical sessions.

---

## 🛠️ Technology Stack

**Frontend:**
- React 19 + Vite
- TailwindCSS 4 (Dark Theme UI)
- Plotly.js (Data Visualization)
- Supabase Auth

**Backend:**
- Python + FastAPI
- Pandas & DuckDB (Data Processing)
- Groq Async API (LLM Code Generation)
- MongoDB Atlas (State & History Persistence)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MongoDB Atlas account
- Supabase account (for Auth)
- Groq API Key (for Llama 3 models)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dataverse.git
cd dataverse
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
MONGODB_URL=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
MODEL_NAME=llama-3.1-8b-instant
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
```

Start the Vite development server:
```bash
npm run dev
```

---

## 🏗️ Architecture Flow

1. **Upload**: User uploads a CSV/XLSX file via the React frontend.
2. **Profile**: Backend processes the file, caches it, and builds a schema summary.
3. **Query**: User asks a question. The prompt (along with the schema) is sent to Groq.
4. **Generate**: The LLM writes Python code (using Pandas/DuckDB and Plotly) designed to extract insights and generate a `result_text` and `plot_json`.
5. **Execute**: The backend runs the Python code in a safe `exec()` sandbox. If it crashes, the error trace is sent back to the LLM for self-correction (up to 3 retries).
6. **Render**: The processed data and chart configs are sent to the frontend, which renders the markdown and interactive Plotly chart.

---

## 🛡️ License

This project is licensed under the MIT License.
