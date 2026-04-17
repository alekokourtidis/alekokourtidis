// Analytics endpoint — routes through Vercel so we can get IP country

const BOT_CITIES = new Set([
  "council bluffs", "ashburn", "boardman", "columbus", "seattle",
  "san jose", "mountain view", "reston", "provo", "ogden",
  "the dalles", "quincy", "north virginia", "dublin",
]);

const BOT_UA_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /curl/i, /wget/i,
  /python/i, /http/i, /fetch/i, /node/i, /axios/i, /go-http/i,
  /headless/i, /phantom/i, /puppeteer/i, /playwright/i, /selenium/i,
  /lighthouse/i, /pagespeed/i, /gtmetrix/i, /pingdom/i, /uptime/i,
  /monitor/i, /check/i, /scan/i, /probe/i, /vercel/i,
  /googlebot/i, /bingbot/i, /yandex/i, /baidu/i, /duckduck/i,
  /facebook/i, /twitter/i, /discord/i, /slack/i, /telegram/i,
  /whatsapp/i, /linkedin/i, /preview/i, /embed/i,
];

function isBot(userAgent, city) {
  if (!userAgent) return true;
  if (userAgent.length < 30) return true;
  if (BOT_UA_PATTERNS.some(p => p.test(userAgent))) return true;
  if (city && BOT_CITIES.has(city.toLowerCase())) return true;
  return false;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const country = request.headers.get('x-vercel-ip-country') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;
    const region = request.headers.get('x-vercel-ip-country-region') || null;
    const location = [city, region, country].filter(Boolean).join(', ') || body.timezone || null;

    // Block bots
    if (isBot(body.user_agent, city)) {
      return Response.json({ ok: true, filtered: true });
    }

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
