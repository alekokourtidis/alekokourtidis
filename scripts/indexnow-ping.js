#!/usr/bin/env node
// Pings IndexNow with all URLs from sitemap.xml
// Usage: node scripts/indexnow-ping.js [host]
//   e.g. node scripts/indexnow-ping.js alekotools.com

const HOST = process.argv[2] || "alekotools.com";
const KEY = "4a2a90ffe7084c6d8d4856853f9a4234";
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

async function getSitemapUrls() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function ping(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return { status: res.status, text: await res.text() };
}

(async () => {
  try {
    const urls = await getSitemapUrls();
    console.log(`Found ${urls.length} urls in ${SITEMAP_URL}`);
    const r = await ping(urls);
    console.log(`IndexNow response: ${r.status} ${r.text}`);
    if (r.status >= 200 && r.status < 300) {
      console.log("✓ successfully pinged Bing/Yandex/Seznam/Naver");
    } else {
      console.log("⚠ ping returned non-2xx — check the key file is deployed");
    }
  } catch (e) {
    console.error("error:", e.message);
    process.exit(1);
  }
})();
