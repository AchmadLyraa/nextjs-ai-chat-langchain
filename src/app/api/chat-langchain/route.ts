import { UIMessage, createUIMessageStreamResponse } from "ai";
import { toUIMessageStream } from "@ai-sdk/langchain";

import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";

export const dynamic = "force-dynamic";

const TEMPLATE = `You MUST respond in Indonesian, using casual Indonesian slang.
DO NOT use English unless the user uses English.
Current conversation:
{chat_history}

user: {input}
assistant:
`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

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

  console.log(formattedPreviousMessages);
  console.log(lastMessage);
  console.log(input);

  // === TEMPLATE PROMPT ===
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  const promptValue = await prompt.invoke({
    chat_history: formattedPreviousMessages,
    input,
  });

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
  });

  // === LANGCHAIN STREAM===
  const stream = await model.stream(promptValue.toChatMessages());

  // === Format that useChat() can understand ===
  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
