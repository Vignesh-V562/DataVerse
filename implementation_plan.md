# Natural Language to Data Analysis Platform

This document outlines the architecture, features, and implementation plan for building a highly efficient, sophisticated Natural Language to Code Analysis Tool. The plan ensures compliance with the strict constraints provided, focusing on free-tier optimization, memory efficiency, and a modular iterative approach.

## 🎯 Goal Description
The objective is to build a production-grade full-stack web application from scratch. Users can upload datasets (CSV, Excel) or provide a URL for scraping, then ask natural language questions about their data. An LLM (Gemini 3.1 Pro) will generate Python/SQL code, which is securely executed on the backend using DuckDB/Pandas. The results, including dynamic Plotly visualizations, will be rendered interactively on the frontend.

## ⚠️ User Review Required

> [!IMPORTANT]  
> Please review this plan before we begin the implementation of Phase 1. As requested, no code will be written until you give the specific command to start a phase. 

> [!NOTE]  
> You mentioned that you will remove the current `Insight-Engine-main` files shortly. I have reviewed the existing repository's `README.md` and understand the previous architecture (React, FastAPI, Gemini, SQLite, Render). We will build the new platform from scratch with the upgraded stack (Vite/Tailwind, FastAPI, DuckDB/Pandas, MongoDB Atlas, Plotly) as specified.

## ❓ Open Questions
1. **MongoDB Connection:** For Phase 4 (State Management), do you have an existing MongoDB Atlas (M0 Free Tier) URI ready, or will you set one up during that phase?
2. **Directory Structure:** Should we initialize the new project (Vite frontend, FastAPI backend) in the current `c:\Users\SSN\Downloads\Insight-Engine-main` directory, replacing the old files after you delete them, or would you prefer a new directory?

---

## 🛠️ Proposed Architecture & Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + Plotly.js (`react-plotly.js`). Optimized for Vercel/Netlify.
- **Backend:** FastAPI (Python) + Uvicorn + Pandas + DuckDB + BeautifulSoup4. Optimized for Oracle Cloud Free Tier.
- **AI Engine:** Google Gemini API.
- **Database:** MongoDB Atlas (M0 Free Tier) for session state and chat history.
- **Execution Strategy:** 
  - DuckDB for fast SQL execution on files.
  - Pandas via sandboxed `exec()` for pure Python operations.

## 🚀 Core Features & Implementation Phases

The development will be strictly iterative, separating UI skeleton, core logic, and styling.

### Phase 1: Project Setup & UI Skeleton
*Goal: Initialize the monorepo structure, set up the frontend and backend servers, and build the basic UI.*
- **Backend (`/backend`)**: Initialize FastAPI with CORS middleware. Create a basic health-check endpoint.
- **Frontend (`/frontend`)**: Initialize Vite React app. Setup Tailwind CSS.
- **UI Skeleton**: Build a sleek, modern chat interface with a drag-and-drop file upload zone. Focus on structural layout first.

### Phase 2: Data Ingestion API
*Goal: Handle dataset uploads and URL scraping, returning a statistical summary.*
- **Endpoint (`/api/upload`)**: Accept multipart form data (CSV/Excel) or JSON (URL).
- **Processing**: Load the file/URL into memory (Pandas).
- **Output**: Compute total rows, columns, data types, and null counts. Return this summary to the frontend to display.

### Phase 3: The LLM Agent & Execution Loop
*Goal: Integrate the AI engine, build the context router, and implement the self-healing execution loop.*
- **Context Builder**: Extract schema (columns, types, first 3 rows) to build a strict system prompt.
- **Prompt Router**: Instruct LLM to use a predefined DataFrame/Table variable. Output should be Python/SQL code or Plotly JSON configuration.
- **Execution Engine**:
  - Secure sandboxed `exec()` for Pandas.
  - `duckdb.query()` for SQL.
- **Self-Healing Loop**: Catch tracebacks from `exec()`, append to a new prompt, and ask the LLM to fix it. Max 3 retries.

### Phase 4: State Management & Plotly Integration
*Goal: Finalize the frontend-backend communication and interactive rendering.*
- **Database**: Integrate MongoDB to save session states and chat history.
- **Frontend State**: Handle chat bubbles, loading animations, and file upload states.
- **Interactive Visualizations**: Render the JSON configuration returned by the backend using `react-plotly.js`.

---

## 🧪 Verification Plan

### Automated/Local Testing
- Start the FastAPI backend and verify endpoints using Swagger UI (`/docs`).
- Upload test CSV and Excel files to verify ingestion and statistical summary computation.
- Test the self-healing loop by intentionally prompting the LLM for a complex query that might require a retry.

### Manual Verification
- Review the modern UI aesthetics, ensuring drag-and-drop works flawlessly.
- Test the end-to-end chat flow: Upload dataset -> Ask question -> Receive Plotly chart or text answer.
- Verify memory consumption remains low by monitoring the FastAPI process when loading large files with DuckDB.
