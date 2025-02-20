import { NextRequest } from "next/server";

export const runtime = "edge"; // Use Edge runtime for better streaming performance

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Received request:", body);

    if (!body.prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing API key");
      return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
    }

    console.log("🔗 Calling Gemini API (Streaming)...");

    // 🔥 Use Google's Streaming API instead of full response
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:streamGenerateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: body.prompt }] }],
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    if (!response.body) {
      return new Response(JSON.stringify({ error: "No response body available" }), { status: 500 });
    }

    // Create a readable stream to send tokens as they arrive
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(`data: ${chunk}\n\n`);
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("📥 Received request:", body);
//
//     if (!body.prompt) {
//       return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
//     }
//
//     const apiKey = process.env.GOOGLE_API_KEY; // ✅ Use environment variable
//     if (!apiKey) {
//       console.error("❌ Missing API key");
//       return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
//     }
//
//     console.log("🔗 Calling Gemini API...");
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [{ parts: [{ text: body.prompt }] }],
//           generationConfig: { temperature: 0.7 }
//         }),
//       }
//     );
//
//     console.log("🔍 API Response Status:", response.status);
//     const data = await response.json();
//     console.log("✅ Gemini API Response:", data);
//
//     return new Response(JSON.stringify(data), { status: response.status });
//   } catch (error) {
//     console.error("❌ API Error:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
//   }
// }
