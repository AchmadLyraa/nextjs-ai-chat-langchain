# Next.js AI Chat App

AI chat application built with **Next.js App Router**, powered by **LangChain** and **Groq** for ultra-fast inference.
This project demonstrates how to build a modern LLM-powered web app using server-side API routes and a clean client UI.

---

## Tech Stack

* **Next.js (App Router)** – fullstack React framework
* **LangChain** – LLM orchestration & prompt handling
* **Groq API** – fast inference (LLaMA 3.1 models)
* **TypeScript** – type safety
* **Tailwind CSS** – styling
* **Server Actions / Route Handlers** – backend logic inside Next.js

---

## Features

* AI chat interface (stream-ready architecture)
* Server-side LLM calls (API key never exposed to client)
* Groq-powered LLaMA 3.1 models
* Clean separation between UI and AI logic
* Ready for RAG (Retrieval-Augmented Generation) extension

---

## Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

⚠️ **Never expose this key to the client.**
All LLM calls are handled server-side via API routes.

---

## Getting Started

Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open:

```
http://localhost:3000
```

---

## How It Works (High Level)

1. User sends a message from the chat UI
2. Frontend calls `/api/chat`
3. API route uses **LangChain** to format the prompt
4. LangChain sends the request to **Groq LLM**
5. Model response is returned to the client

No client-side LLM calls. No API key leaks. Clean.

---

## Model

Default model example:

* `llama-3.1-8b-instant` (Groq)

Model can be swapped easily in the LangChain configuration.

---

## Deployment Notes

* Can be deployed on **Vercel**, **Node server**, or any platform that supports Next.js
* Groq API works without credit card (free tier available)
* Suitable for demos, prototypes, and learning projects

---

## Future Improvements

* Streaming responses
* RAG with vector database
* Conversation memory
* Authentication
* Rate limit handling
