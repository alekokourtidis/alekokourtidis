export async function POST(request) {
  const { email } = await request.json();

  if (!email || !email.includes("@")) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Fallback: just log it if no Supabase
    console.log("New subscriber:", email);
    return Response.json({ success: true });
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/subscribers`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email, source: "alekotools.com" }),
    });

    // 409 = duplicate email, that's fine
    if (!res.ok && res.status !== 409) {
      throw new Error(`Supabase error: ${res.status}`);
    }

    return Response.json({ success: true });
  } catch (e) {
    console.error("Subscribe error:", e);
    // Still return success to user — we don't want to lose them over a DB error
    return Response.json({ success: true });
  }
}
