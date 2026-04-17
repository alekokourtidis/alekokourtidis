// Telegram webhook — handles /explain, /builds, /status commands
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = 'https://fdnbotpgodpcgqtojnrm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_EXP_ArZJG1-dDSY240-ZdQ_91x4KdbQ';

async function sendReply(chatId, text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  }).catch(() => {});
}

async function querySupabase(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  return res.ok ? res.json() : [];
}

async function explainWithClaude(buildData) {
  if (!ANTHROPIC_KEY) return buildData.eli17 || buildData.tagline || 'No description available.';

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Explain this app to a 17-year-old entrepreneur who has never worked in the industry this tool targets. Be specific about what the tool does, who would use it, and why they'd pay for it. Keep it under 150 words, casual tone.

App name: ${buildData.project_name}
Description: ${buildData.eli17 || buildData.tagline || 'N/A'}
Target audience: ${buildData.target_audience || 'N/A'}
Price: ${buildData.price || 'N/A'}
Problem it solves: ${buildData.problem_summary || buildData.tagline || 'N/A'}`
      }],
    }),
  });

  if (!res.ok) return buildData.eli17 || 'Could not generate explanation.';
  const data = await res.json();
  return data.content?.[0]?.text || 'Could not generate explanation.';
}

export async function POST(request) {
  if (!TELEGRAM_TOKEN) return Response.json({ ok: false, error: 'No bot token' });

  const body = await request.json();
  const msg = body.message;
  if (!msg?.text || !msg?.chat?.id) return Response.json({ ok: true });

  const chatId = msg.chat.id;
  const text = msg.text.trim();

  // /explain <tool_name>
  if (text.startsWith('/explain')) {
    const toolName = text.replace('/explain', '').trim().toLowerCase();
    if (!toolName) {
      await sendReply(chatId, 'Usage: /explain flowdebug');
      return Response.json({ ok: true });
    }

    // Search built_projects
    const builds = await querySupabase(
      `built_projects?or=(project_name.ilike.%25${toolName}%25)&order=created_at.desc&limit=1`
    );

    if (!builds.length) {
      // Try evaluations
      const evals = await querySupabase(
        `evaluations?problem_title.ilike=%25${toolName}%25&order=created_at.desc&limit=1`
      );
      if (!evals.length) {
        await sendReply(chatId, `Couldn't find a tool called "${toolName}". Try /builds to see what's available.`);
        return Response.json({ ok: true });
      }
      const explanation = `*${evals[0].problem_title || toolName}*\n\nScore: ${evals[0].total_score || '?'}/10\n${evals[0].eli17 || evals[0].tagline || 'No description.'}`;
      await sendReply(chatId, explanation);
      return Response.json({ ok: true });
    }

    const build = builds[0];
    const explanation = await explainWithClaude(build);
    const reply = `*${build.project_name}*\n\n${explanation}\n\nStatus: ${build.status || 'unknown'}\nPrice: ${build.price || 'TBD'}`;
    await sendReply(chatId, reply);
    return Response.json({ ok: true });
  }

  // /builds — list recent builds
  if (text.startsWith('/builds')) {
    const builds = await querySupabase(
      'built_projects?order=created_at.desc&limit=10&select=project_name,status,created_at'
    );
    if (!builds.length) {
      await sendReply(chatId, 'No builds found.');
      return Response.json({ ok: true });
    }
    const list = builds.map((b, i) =>
      `${i + 1}. *${b.project_name}* — ${b.status} (${new Date(b.created_at).toLocaleDateString()})`
    ).join('\n');
    await sendReply(chatId, `Recent builds:\n\n${list}\n\nUse /explain <name> for details.`);
    return Response.json({ ok: true });
  }

  // /status — quick overview
  if (text.startsWith('/status')) {
    const [builds, deployed] = await Promise.all([
      querySupabase('built_projects?select=status'),
      querySupabase('built_projects?status=eq.deployed&select=project_name'),
    ]);
    const counts = {};
    builds.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1; });
    const summary = Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join('\n');
    await sendReply(chatId, `Pipeline status:\n\n${summary}\n\nDeployed: ${deployed.map(d => d.project_name).join(', ') || 'none'}`);
    return Response.json({ ok: true });
  }

  // /help
  if (text.startsWith('/help') || text === '/start') {
    await sendReply(chatId,
      `Aleko Tools Bot\n\n` +
      `/explain <tool> — Explain what a tool does in simple terms\n` +
      `/builds — List recent pipeline builds\n` +
      `/status — Pipeline overview\n` +
      `/help — Show this message`
    );
    return Response.json({ ok: true });
  }

  return Response.json({ ok: true });
}
