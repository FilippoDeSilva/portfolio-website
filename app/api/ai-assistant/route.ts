import { NextRequest } from "next/server";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1"; // or "openai/gpt-4o" if that's your model
// const systemPrompt = "You are a helpful AI writing assistant for a personal blog. Your tone is modest, cozy, and professional. Always keep responses friendly, clear, and supportive.";
const systemPrompt = `
You are a helpful AI writing assistant for a personal blog. Your tone is modest, cozy, and professional—like a knowledgeable friend offering thoughtful advice. 
Always aim for clarity, warmth, and encouragement. 
You help brainstorm blog ideas, outline posts, write engaging intros and conclusions, suggest improvements, and polish drafts. 
Keep the writing style friendly, easy to read, and supportive of the blog’s purpose: connecting with readers through authentic and useful content.
Avoid jargon unless it's explained simply. Focus on making the content inviting, informative, and human.
`;

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const token = process.env["GITHUB_TOKEN"];
    if (!token) {
      return new Response(JSON.stringify({ error: "GitHub API token not set." }), { status: 500 });
    }

    const client = ModelClient(endpoint, new AzureKeyCredential(token));
    console.log("[AI API] Sending request to Azure OpenAI...");
    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        top_p: 1,
        model,
        stream: true
      }
    });

    if (isUnexpected(response)) {
      const errorBody = response.body as any;
      console.error("[AI API] Azure returned error:", errorBody.error?.message);
      return new Response(JSON.stringify({ error: errorBody.error?.message || "GitHub AI API error." }), { status: 500 });
    }

    // Stream the response as plain text chunks, robustly handling single-character chunks
    const stream = response.body as any;
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        let buffer = "";
        try {
          for await (const chunk of stream) {
            buffer += typeof chunk === "string" ? chunk : String(chunk);
            // Try to extract all complete JSON objects from the buffer
            let startIdx = buffer.indexOf("{");
            while (startIdx !== -1) {
              let braceCount = 0;
              let endIdx = -1;
              for (let i = startIdx; i < buffer.length; i++) {
                if (buffer[i] === "{") braceCount++;
                if (buffer[i] === "}") braceCount--;
                if (braceCount === 0) {
                  endIdx = i;
                  break;
                }
              }
              if (endIdx !== -1) {
                const jsonStr = buffer.slice(startIdx, endIdx + 1);
                try {
                  const event = JSON.parse(jsonStr);
                  const content = event.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (e) {
                  // Ignore parse errors, could be incomplete
                }
                buffer = buffer.slice(endIdx + 1);
                startIdx = buffer.indexOf("{");
              } else {
                // Wait for more data
                break;
              }
            }
          }
        } catch (e) {
          console.error("[AI API] Error while reading stream:", e);
          controller.error(e);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "*" // for debugging
      }
    });
  } catch (err: any) {
    console.error("[AI API] Handler error:", err);
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), { status: 500 });
  }
} 