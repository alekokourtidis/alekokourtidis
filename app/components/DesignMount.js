"use client";

/**
 * Mounts the legacy "design" React app (served as JSX files from /public/design/*)
 * directly into this Next.js page — no iframe.
 *
 * Background: the site's homepage and /tools used to load /design/index.html
 * and /design/tools.html inside an iframe. Inline iframes swallow mouse-wheel
 * events inconsistently across browsers and iOS, which meant the user could
 * only scroll by targeting the outer page's scrollbar. Removing the iframe
 * gives native, reliable scrolling everywhere.
 *
 * The JSX files (`shared.jsx`, `demos.jsx`, `app.jsx`, `tools.jsx`) are the
 * original React prototypes using Babel Standalone to compile in the browser.
 * We load React → ReactDOM → Babel → the JSX files sequentially, using a
 * dedicated mount div so React's outer tree never fights with the inner app.
 */

import { useEffect, useRef } from "react";

const BASE_SCRIPTS = [
  { src: "https://unpkg.com/react@18.3.1/umd/react.production.min.js" },
  { src: "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" },
  { src: "https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" },
];

// Loads a script synchronously in declaration order, returning a Promise that
// resolves when the script finishes executing (or rejects on error).
function loadScript({ src, type }) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    if (type) el.type = type;
    el.crossOrigin = "anonymous";
    el.async = false; // preserve load+exec order
    el.onload = () => resolve();
    el.onerror = (e) => reject(new Error("failed to load " + src));
    document.body.appendChild(el);
  });
}

export default function DesignMount({ scripts, stylesheet = "/design/styles.css" }) {
  const hostRef = useRef(null);

  useEffect(() => {
    // Prevent double-boot when React strict-mode mounts twice in dev.
    if (window.__alekoDesignBooted) {
      return;
    }
    window.__alekoDesignBooted = true;

    // Ensure the design stylesheet is loaded.
    if (stylesheet && !document.querySelector(`link[data-aleko-design="1"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheet;
      link.dataset.alekoDesign = "1";
      document.head.appendChild(link);
    }

    // Create the #root div that the design app expects to mount into.
    // We insert it as a child of our ref'd host so React never tries to
    // reconcile against content the design app added later.
    if (hostRef.current && !document.getElementById("root")) {
      const root = document.createElement("div");
      root.id = "root";
      hostRef.current.appendChild(root);
    }

    const allScripts = [
      ...BASE_SCRIPTS,
      ...scripts.map((src) => ({ src, type: "text/babel" })),
    ];

    (async () => {
      for (const s of allScripts) {
        await loadScript(s);
      }
      // Safety net: if Babel's MutationObserver didn't auto-compile the
      // text/babel scripts (rare, but possible depending on timing), force
      // a second pass. Idempotent — already-compiled scripts are skipped.
      if (window.Babel && typeof window.Babel.transformScriptTags === "function") {
        try { window.Babel.transformScriptTags(); } catch {}
      }
    })().catch((err) => {
      console.error("[DesignMount] boot failed:", err);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hide ONLY the outer Next layout chrome (direct children of body), not
  // the design app's own nav/footer which live deeper in #root.
  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; background: #09090b; }
        body > nav.nav,
        body > footer.footer { display: none !important; }
      `}</style>
      <div ref={hostRef} suppressHydrationWarning />
    </>
  );
}
