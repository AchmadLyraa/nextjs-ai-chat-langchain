## Note: Hugging Face Spaces (IMPORTANT)

**Hugging Face Spaces is NOT a Next.js hosting platform.**

**Runtime provided by HF Spaces:**

* Python runtime
* Gradio / Streamlit
* Simple static HTML
* Backend logic + LLM / model inference

**It is NOT:**

* A Node.js server
* A Next.js runtime
* A fullstack React environment


## Note: Input Output Process (IMPORTANT)

## Note 1: `convertToModelMessages(messages)`

Does it store the chat history? **No.** This function only performs a runtime conversion:

* **Input:** array of messages from the frontend (currently in browser memory / React state)
* **Output:** array of objects ready for the LLM, for example:

```ts
[
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
]
```

It **does not persist chat history**; once the page is refreshed or closed, all data is lost unless stored elsewhere.

---

## Note 2: `HttpResponseOutputParser` and `StreamingTextResponse`

* **`HttpResponseOutputParser`**: formats and serializes the raw LLM output into a structured, streamable format. It ensures the response is properly chunked and readable.
* **`StreamingTextResponse`**: takes the parsed LLM output and sends it as a live HTTP stream to the client. Think of it as the vehicle that delivers the formatted LLM response to the browser in real time.
adapter antara raw LLM stream dan client UI.
* **`createStreamDataTransformer`**: An adapter between the raw LLM stream and the client UI.

Together, they allow the frontend to **render the LLM response live**, chunk by chunk, rather than waiting for the entire answer.

---

## Note 3: PromptTemplate

* `PromptTemplate` is used to create **dynamic prompts** for the LLM.
* Templates can include placeholders like `{chat_history}` and `{input}` to build the final prompt dynamically.
* Example:

```ts
const TEMPLATE = `You are a comedian. Conversation:
{chat_history}
user: {input}
assistant:`;

const prompt = PromptTemplate.fromTemplate(TEMPLATE);
```

* It enables **role-playing** and **prompt engineering** to control the style and tone of the LLM response.
* This is **still without any retrieval**; it only formats input for the model.

---

## Note 4: Input-Output Flow

**Flow of data:**

Frontend messages → `convertToModelMessages` → Prompt/Chain → LLM generates response → `HttpResponseOutputParser` → `StreamingTextResponse` → Client UI

* `convertToModelMessages` handles formatting for the model
* `PromptTemplate` builds the actual prompt with chat history and current input
* LLM generates the response in real time
* `HttpResponseOutputParser` formats it for streaming
* `StreamingTextResponse` delivers it live to the client
