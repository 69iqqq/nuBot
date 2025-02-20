export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Received request:", body);

    if (!body.prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY; // ✅ Use environment variable
    if (!apiKey) {
      console.error("❌ Missing API key");
      return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
    }

    console.log("🔗 Calling Gemini API...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: body.prompt }] }],
          generationConfig: { temperature: 0.7 }
        }),
      }
    );

    console.log("🔍 API Response Status:", response.status);
    const data = await response.json();
    console.log("✅ Gemini API Response:", data);

    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
