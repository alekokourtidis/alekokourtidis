const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function generateCode(name) {
  const clean = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${clean || "AFF"}${rand}`;
}

export async function POST(request) {
  const { name, email, handle, platform, preferred_tool } = await request.json();

  if (!name || !email || !handle) {
    return Response.json({ error: "Name, email, and handle are required." }, { status: 400 });
  }

  const code = generateCode(name);
  const link = `https://alekotools.com?ref=${code}`;

  // Save to Supabase
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/affiliates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name,
          email,
          handle,
          platform: platform || "tiktok",
          preferred_tool: preferred_tool || "any",
          code,
          referral_link: link,
          status: "active",
        }),
      });

      if (res.status === 409) {
        return Response.json({ error: "This email is already registered. Check your email for your code." }, { status: 409 });
      }

      if (!res.ok) {
        const err = await res.text();
        console.error("[affiliates] Supabase error:", err);
        // Still return the code even if Supabase fails — don't block the user
      }
    } catch (e) {
      console.error("[affiliates] Error:", e.message);
    }
  }

  return Response.json({ code, link, name });
}
