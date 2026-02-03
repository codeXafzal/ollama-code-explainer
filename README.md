# 🧠 AI Code Explainer (Local LLM)

A ChatGPT-style web application that explains source code snippets using a **locally hosted Large Language Model (LLM)** powered by **Ollama**.  
Built with **Next.js (TypeScript)** on the frontend and **FastAPI** on the backend.

---

## 🚀 Demo

<!-- TODO: Add demo GIF or video link here -->
<!-- Example:
![Demo](./assets/demo.gif)
-->

---

## 📌 What This Project Does

- Accepts code snippets from the user
- Automatically detects the programming language
- Explains the code in a **clear, beginner-friendly way**
- Uses a **local LLM** (no OpenAI / external APIs)
- ChatGPT-style conversational UI focused only on code explanation

---

## 🧠 Why This Project

This project demonstrates:

- Local AI / LLM integration using Ollama
- Prompt engineering for concise, fast responses
- Full-stack AI application architecture
- Understanding of deployment constraints for LLMs
- Clean Git hygiene and project structure

---

## 🏗️ Architecture

<!-- TODO: Add architecture diagram image -->
<!-- Example:
![Architecture](./assets/architecture.png)
-->

```text
Browser (Next.js + TypeScript)
        |
        | HTTP (JSON)
        v
Backend API (FastAPI)
        |
        | Local inference
        v
Ollama (gemma3 model)
