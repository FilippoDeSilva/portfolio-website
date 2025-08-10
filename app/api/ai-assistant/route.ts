import { NextRequest } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";

// Available models on GitHub AI - ordered by capability (best first)
const availableModels = {
  "gpt-4o": "openai/gpt-4o",           // GPT-4 Omni - Latest and most capable
  "gpt-4o-mini": "openai/gpt-4o-mini", // GPT-4 Omni Mini - Fast and efficient
  "gpt-4-turbo": "openai/gpt-4",       // GPT-4 Classic - Reliable and powerful
  "gpt-3.5-turbo": "openai/gpt-3.5-turbo" // GPT-3.5 Turbo - Fastest and cheapest
};

const systemPrompt = `
You are a helpful AI writing assistant for a personal blog, chatting with the blog's author.

- If the author greets you or makes small talk, reply briefly, warmly, and creatively—use emojis and keep it casual.
- If the author asks you to write, brainstorm, or outline a blog post, respond with a professional, engaging, and detailed answer in their voice and style.
- For general questions, answer helpfully and concisely.
- Never refer to yourself as an AI or mention the writing process.
- When writing a blog post, use proper formattings, styles, headings etc... and keep it engaging, fun easy to read and eye-catching, Depending on the topic of the blog you can be more creative, funny, cozy, modern, shakespear, serious, professional etc...
- Always use eye-catching titles for the blogs.
`;

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model: requestedModel = "gpt-4o", stream = false } = await req.json();
    const token = process.env["GITHUB_TOKEN"];
    if (!token) {
      return new Response(JSON.stringify({ error: "GitHub API token not set." }), { status: 500 });
    }

    // Validate and get the model
    const model = availableModels[requestedModel as keyof typeof availableModels];
    if (!model) {
      return new Response(JSON.stringify({ 
        error: `Invalid model. Available models: ${Object.keys(availableModels).join(", ")}` 
      }), { status: 400 });
    }

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });
    console.log(`[AI API] Sending request to GitHub AI with model: ${requestedModel} (${model})...`);
    
    if (stream) {
      // Handle streaming response
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        model: model,
        stream: true
      });

      console.log(`[AI API] Streaming response from ${requestedModel}`);
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                controller.enqueue(new TextEncoder().encode(content));
              }
            }
            controller.close();
          } catch (error) {
            console.error("[AI API] Streaming error:", error);
            controller.error(error);
          }
        }
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive"
        }
      });
    } else {
      // Handle non-streaming response
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        model: model
      });

      console.log(`[AI API] Response received successfully from ${requestedModel}`);
      
      // Return the response content directly (no streaming)
      const content = response.choices[0].message.content || "No response content";
      return new Response(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache"
        }
      });
    }
  } catch (err: any) {
    console.error("[AI API] Handler error:", err);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), { status: 500 });
  }
} 