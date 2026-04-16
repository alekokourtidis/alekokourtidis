// Analytics endpoint — routes through Vercel so we can get IP country
export async function POST(request) {
  try {
    const body = await request.json();

    // Get location from Vercel headers (free, automatic)
    const country = request.headers.get('x-vercel-ip-country') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;
    const region = request.headers.get('x-vercel-ip-country-region') || null;
    const location = [city, region, country].filter(Boolean).join(', ') || body.timezone || null;

    const SUPABASE_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';

    await fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        site: body.site || 'alekotools',
        path: body.path,
        referrer: body.referrer || null,
        user_agent: body.user_agent || null,
        visitor_id: body.visitor_id || null,
        country: location,
      }),
    });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
