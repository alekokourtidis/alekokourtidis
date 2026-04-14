import "./globals.css";
import Analytics from "./components/Analytics";

export const metadata = {
  title: "Aleko Tools — AI-Powered Tools for Students | by Aleko Kourtidis",
  description: "AI-powered tools built by Aleko Kourtidis. Essay writing in your voice, PDF worksheet solving, recipe generation, food scanning, and more. Free tools for students.",
  keywords: "aleko tools, alekotools, aleko kourtidis, alekokourtidis, ai tools for students, ai essay writer, ai homework helper, ai worksheet solver, student ai tools",
  metadataBase: new URL("https://alekotools.com"),
  authors: [{ name: "Aleko Kourtidis", url: "https://alekotools.com/about" }],
  creator: "Aleko Kourtidis",
  openGraph: {
    title: "Aleko Tools — AI-Powered Tools for Students",
    description: "AI-powered tools built by Aleko Kourtidis for students. Essay cloning, PDF solving, recipe generation, and more.",
    type: "website",
    url: "https://alekotools.com",
    siteName: "Aleko Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aleko Tools — AI Tools for Students",
    description: "Built by Aleko Kourtidis. Free AI tools for students.",
  },
  alternates: {
    canonical: "https://alekotools.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="vQ9wtF1eidiF6zJcbyxm6flNDMcN0EQVIe7-LXSqQJM" />
      </head>
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <a href="/" className="nav-brand">
              alekotools<span>.com</span>
            </a>
            <div className="nav-links">
              <a href="/">Tools</a>
              <a href="/blog">Blog</a>
              <a href="/about">About</a>
            </div>
          </div>
        </nav>
        {children}
        <Analytics />
        <footer className="footer">
          <div className="footer-inner">
            <span>&copy; 2026 Aleko Kourtidis</span>
            <div className="footer-links">
              <a href="/">Tools</a>
              <a href="/blog">Blog</a>
              <a href="/about">About</a>
              <a href="https://tiktok.com/@alekokourtidis" target="_blank" rel="noopener">TikTok</a>
              <a href="https://instagram.com/alekokourtidis" target="_blank" rel="noopener">Instagram</a>
            </div>
          </div>
        </footer>

        {/* WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Aleko Tools",
              alternateName: ["alekotools", "aleko tools", "alekokourtidis"],
              url: "https://alekotools.com",
              description: "AI-powered tools for students, built by Aleko Kourtidis",
              author: {
                "@type": "Person",
                name: "Aleko Kourtidis",
                url: "https://alekotools.com/about",
                sameAs: [
                  "https://tiktok.com/@alekokourtidis",
                  "https://instagram.com/alekokourtidis",
                ],
              },
            }),
          }}
        />
        {/* Person schema — so Google knows who Aleko Kourtidis is */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Aleko Kourtidis",
              alternateName: "alekokourtidis",
              url: "https://alekotools.com/about",
              sameAs: [
                "https://tiktok.com/@alekokourtidis",
                "https://instagram.com/alekokourtidis",
              ],
              jobTitle: "Software Developer",
              description: "17-year-old builder shipping AI-powered tools for students",
              knowsAbout: ["Artificial Intelligence", "Software Development", "Mobile Apps"],
            }),
          }}
        />
      </body>
    </html>
  );
}
