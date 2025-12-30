import { ModelMessage, UIMessage, UIMessagePart } from "ai"; // Hanya import tipe yang diperlukan
import { groq } from "@ai-sdk/groq";

import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const dynamic = "force-dynamic";

// basic memory formatter that stringifies and passes message history directly into model
const formatMessage = (message: UIMessage) => {
  const text = message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  return `${message.role}: ${text}`;
};

const TEMPLATE = `You are a madman, all responses must be extremely verbose!
  Current conversation:
  {chat_history}

  user: {input}
  assistant:
  `;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    console.log(messages);
    console.log(formatMessage);

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const input = messages.at(-1);

    const currentMessageContent = input?.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    console.log(formattedPreviousMessages);
    console.log(currentMessageContent);

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
      streaming: true,
    });

    // chat models stream message chunks rather than bytes, so this output parser handles serialization and encoding
    const parser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(parser);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(`0:${chunk}\n`));
          }
          controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (e: any) {
    console.error("API Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
