"use client";

/**
 * Mounts the legacy "design" React app (served as JSX files from /public/design/*)
 * directly into this Next.js page — no iframe.
 *
 * Why we don't just add <script type="text/babel"> tags:
 * Babel Standalone's MutationObserver picks up dynamically-added text/babel
 * scripts but does not guarantee they execute in the order they were added
 * (each goes through an async fetch → transform → inject pipeline). Our JSX
 * files have strict order dependencies — shared.jsx defines SharedNav and
 * window.useToolLibrarySupabase; demos.jsx defines window.*Demo; app.jsx /
 * tools.jsx consume both. Any ordering glitch and the whole page blanks out.
 *
 * So we load React, ReactDOM, Babel first (classic src scripts, async=false),
 * then for each JSX file we fetch the source, run Babel.transform manually
 * with the same "env,react" presets Babel Standalone uses for text/babel
 * tags, and inject the result as an inline <script>. Inline scripts execute
 * synchronously when appended, so awaiting each one guarantees order.
 */

import { useEffect, useRef } from "react";

const BASE_SCRIPTS = [
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js",
];

// Load a classic-src <script> and wait for it to execute.
function loadScriptSrc(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.crossOrigin = "anonymous";
    el.async = false;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("failed to load " + src));
    document.body.appendChild(el);
  });
}

// Fetch a JSX file, transform it with Babel using the same presets Babel
// Standalone applies to <script type="text/babel"> tags, and inject the
// compiled code as an inline <script> so it runs synchronously in global
// scope. Returns when the script has executed.
async function runJsx(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`fetch ${url} failed: ${res.status}`);
  const source = await res.text();
  const { code } = window.Babel.transform(source, {
    filename: url,
    presets: ["env", "react"],
  });
  const el = document.createElement("script");
  el.textContent = code;
  el.dataset.alekoJsx = url;
  document.body.appendChild(el);
}

export default function DesignMount({ scripts, stylesheet = "/design/styles.css" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    if (window.__alekoDesignBooted) return;
    window.__alekoDesignBooted = true;

    // Design stylesheet — added once, in <head> so it cascades correctly.
    if (stylesheet && !document.querySelector('link[data-aleko-design="1"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheet;
      link.dataset.alekoDesign = "1";
      document.head.appendChild(link);
    }

    // #root is where the design app mounts. Create it inside our ref'd host
    // so React's outer tree never fights the design app's DOM mutations.
    if (hostRef.current && !document.getElementById("root")) {
      const root = document.createElement("div");
      root.id = "root";
      hostRef.current.appendChild(root);
    }

    (async () => {
      for (const src of BASE_SCRIPTS) await loadScriptSrc(src);
      for (const src of scripts) await runJsx(src);
    })().catch((err) => {
      console.error("[DesignMount] boot failed:", err);
      // Surface the error visually so the user sees something instead of a
      // silent black page.
      if (hostRef.current) {
        hostRef.current.innerHTML =
          '<pre style="color:#f87171;padding:24px;font-family:monospace;white-space:pre-wrap;">' +
          "alekotools failed to load.\n\n" + String(err && err.stack || err) +
          "</pre>";
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <style>{`
        /* Only <html> scrolls. Forcing body to overflow:visible + height:auto
           prevents the nested-scroll situation where both html and body are
           scrollable, which on macOS routes wheel events to html's outer
           scrollbar only — the root cause of "scroll only works at far right". */
        html { overflow-y: auto; }
        html, body {
          margin: 0;
          padding: 0;
          height: auto;
          background: #09090b;
        }
        body { overflow: visible !important; height: auto !important; }
        body > nav.nav,
        body > footer.footer { display: none !important; }
        /* Noise grain overlay is ugly on this site — kill it. */
        .noise { display: none !important; }
      `}</style>
      <div ref={hostRef} suppressHydrationWarning />
    </>
  );
}
