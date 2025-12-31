# Next.js AI Chat App with RAG

AI chat application built with **Next.js App Router**, powered by **LangChain**, **AI-SDK 6**, and **Groq** for ultra-fast inference.

This project demonstrates how to build a modern LLM-powered web app with **RAG (Retrieval-Augmented Generation)** using JSON data as knowledge base.

---

## Tech Stack

* **Next.js (App Router)** – fullstack React framework
* **LangChain** – LLM orchestration, prompt handling & document loading
* **Groq API** – fast inference (LLaMA 3.1 models)
* **TypeScript** – type safety
* **Tailwind CSS** – styling
* **Server Actions / Route Handlers** – backend logic inside Next.js
* **JSONLoader** – load structured data for RAG

---

## Features

*  AI chat interface with streaming support
*  Server-side LLM calls (API key never exposed to client)
*  Groq-powered LLaMA 3.1 models
*  **RAG implementation with JSON data source**
*  Indonesian language support with casual slang
*  Chat history context management
*  Clean separation between UI and AI logic

---

## Environment Variables

Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

⚠️ **Never expose this key to the client.**
All LLM calls are handled server-side via API routes.

---

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # RAG-enabled chat API => chat-rag/route.ts
│   └── page.tsx              # Chat UI
└── data/
    └── data.json             # Knowledge base (JSON)
```

---

## Getting Started

Install dependencies:
```bash
npm install
# or
pnpm install
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

## How RAG Works

1. **User sends a message** from the chat UI
2. **Frontend calls** `/api/chat` (POST request)
3. **JSONLoader loads** documents from `src/data/data.json`
4. **Documents are formatted** into context string
5. **LangChain chains together:**
   - User question
   - Chat history
   - Document context
6. **Prompt is sent** to Groq LLM (LLaMA 3.1)
7. **Streaming response** returns to client

### RAG Flow Diagram:
```
User Input → Load JSON Docs → Format Context → Build Prompt → 
LLM (Groq) → Stream Response → Client UI
```

---

## Data Source Configuration

Current JSON structure supports these fields:
- `/state`
- `/code`
- `/nickname`
- `/website`
- `/admission_date`
- `/admission_number`
- `/capital_city`
- `/capital_url`
- `/population`
- `/population_rank`
- `/constitution_url`
- `/twitter_url`
- ....

To modify data source, edit:
```typescript
const loader = new JSONLoader("src/data/data.json", [
  "/your_field_here",
]);
```

---

## Model Configuration

Default model:
* `llama-3.1-8b-instant` (Groq)

Change model in `route.ts`:
```typescript
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-70b-versatile", // or other Groq models
});
```

---

## Performance Notes

### Token Usage
- Current implementation loads **all documents** into context
- Suitable for small-medium datasets (<5K tokens)
- For larger datasets (10K+ tokens), consider:
  - Vector store (Pinecone, Chroma)
  - Semantic search
  - Document filtering

### When to Optimize
 **Keep current approach if:**
- JSON file < 100 entries
- Each document < 500 characters
- Total context < 5,000 tokens

⚠️ **Consider vector store if:**
- JSON file > 1,000 entries
- Documents contain long text
- Total context > 10,000 tokens

---

## Deployment

Deployable on:
* **Vercel**
* **Node.js server**
* Any platform supporting Next.js 14+

### Deployment Checklist:
- [x] Set `GROQ_API_KEY` in production environment
- [x] Ensure `src/data/data.json` is included in build
- [x] Test streaming responses in production
- [x] Monitor token usage via Groq dashboard

---

## Troubleshooting

**Issue:** "Cannot find module 'src/data/data.json'"
- Ensure JSON file exists at correct path
- Check file permissions

**Issue:** Slow responses
- Check Groq API status
- Reduce context size (filter documents)
- Consider upgrading Groq tier

**Issue:** Responses not in Indonesian
- Verify TEMPLATE prompt in `route.ts`
- Check if model supports Indonesian well

---

## Future Improvements

* [ ] Vector database integration (Supabase Vector, Pinecone)
* [ ] Semantic search for document retrieval
* [ ] Multiple data source support (PDF, CSV, etc.)
* [ ] Conversation memory with persistence
* [ ] Authentication & user sessions
* [ ] Rate limiting
* [ ] Caching for repeated queries
* [ ] A/B testing different prompts
* [ ] Analytics dashboard

---

## Author

**Achmad Bayhaqi**  
GitHub: [@achmadlyraa](https://github.com/achmadlyraa)

This project is for personal/educational purposes.

---

## Contributing

PRs welcome! Please ensure:
- Code follows existing patterns
- TypeScript types are properly defined
- RAG chain logic is well-documented


created at 31 December 2025
