import { UIMessage, createUIMessageStreamResponse } from "ai";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { JSONLoader } from "@langchain/classic/document_loaders/fs/json";
import { RunnableSequence } from "@langchain/core/runnables";
import { Document } from "@langchain/core/documents";

// Helper function buat format dokumen jadi string
function formatDocumentsAsString(docs: Document[]): string {
  return docs
    .map((doc, i) => {
      const content = JSON.stringify(doc.pageContent, null, 2);
      return `Document ${i + 1}:\n${content}`;
    })
    .join("\n\n");
}

const loader = new JSONLoader("src/data/data.json", [
  "/state",
  "/code",
  "/nickname",
  "/website",
  "/admission_date",
  "/admission_number",
  "/capital_city",
  "/capital_url",
  "/population",
  "/population_rank",
  "/constitution_url",
  "/twitter_url",
  "/name",
  "/who",
  "/address",
  "/school",
]);

export const dynamic = "force-dynamic";

const TEMPLATE = `You are a helpful assistant that answers questions based on the provided context.
You MUST respond in Indonesian, using casual Indonesian slang.
DO NOT use English unless the user uses English.

Context:
{context}

Chat History:
{chat_history}

User: {question}
Assistant:`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // === LOAD DOCUMENTS FROM JSON ===
  const docs = await loader.load();
  console.log(`Loaded ${docs.length} documents`);

  // === CHAT HISTORY FORMAT ===
  const formattedPreviousMessages = messages
    .slice(0, -1)
    .map(
      (m) =>
        `${m.role}: ${m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("")}`,
    )
    .join("\n");

  const lastMessage = messages.at(-1);
  const input = lastMessage?.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  console.log("Chat History:", formattedPreviousMessages);
  console.log("User Input:", input);

  // === TEMPLATE PROMPT ===
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
  });

  // === RAG CHAIN ===
  const chain = RunnableSequence.from([
    {
      question: (input: { question: string; chat_history: string }) =>
        input.question,
      chat_history: (input: { question: string; chat_history: string }) =>
        input.chat_history,
      context: () => formatDocumentsAsString(docs),
    },
    prompt,
    model,
  ]);

  // === INVOKE CHAIN WITH STREAM ===
  const stream = await chain.stream({
    question: input || "",
    chat_history: formattedPreviousMessages,
  });

  // === Format that useChat() can understand ===
  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
