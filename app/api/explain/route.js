const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request) {
  const build = await request.json();

  if (!ANTHROPIC_KEY) {
    return Response.json({
      explanation: build.eli17 || build.tagline || "No API key configured for explanations.",
    });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{
          role: "user",
          content: `Explain this app to a 17-year-old entrepreneur who has never worked in the industry this tool targets. Cover:
1. What does this tool actually DO? (one sentence)
2. Who would use it and why? (real-world example)
3. Why would they PAY for it? (what pain does it solve)
4. How hard is it to compete here? (quick honest take)

Keep it under 120 words. Casual, direct, no fluff.

App: ${build.project_name}
Description: ${build.eli17 || build.tagline || "N/A"}
Target: ${build.target_audience || "N/A"}
Price: ${build.price || "N/A"}
Problem: ${build.problem_summary || "N/A"}`,
        }],
      }),
    });

    if (!res.ok) {
      return Response.json({ explanation: build.eli17 || "Could not generate explanation." });
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "Could not generate explanation.";
    return Response.json({ explanation: text });
  } catch (e) {
    return Response.json({ explanation: build.eli17 || "Error generating explanation." });
  }
}
