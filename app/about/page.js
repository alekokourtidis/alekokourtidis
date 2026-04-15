import Link from "next/link";

export const metadata = {
  title: "About Aleko Kourtidis — Builder of Aleko Tools",
  description: "Aleko Kourtidis is a 17-year-old software developer who builds AI-powered tools for students. Creator of EssayCloner, Feastmate, and Wholefed.",
  keywords: "aleko kourtidis, alekokourtidis, aleko tools, who is aleko kourtidis, aleko developer",
  alternates: {
    canonical: "https://alekotools.com/about",
  },
  openGraph: {
    title: "About Aleko Kourtidis",
    description: "17-year-old builder shipping AI tools for students.",
    type: "profile",
    url: "https://alekotools.com/about",
  },
};

export default function About() {
  return (
    <div className="container">
      <div className="about-page">
        <h1>About Aleko Kourtidis</h1>
        <p className="about-intro">
          I'm Aleko Kourtidis — I build AI-powered tools that solve real problems for students.
          Every tool on this site started from a problem I saw people actually dealing with.
          No fluff, no feature bloat. Just things that work.
        </p>

        <div className="about-section">
          <h2>Background</h2>
          <p>
            I'm 17 years old. I started building software with zero coding experience and
            shipped my first app to the App Store within weeks. I've built multiple
            products across web and iOS — from AI essay writers to food health scanners.
            I focus on shipping fast, solving one problem per tool, and making things
            people actually want to use.
          </p>
        </div>

        <div className="about-section">
          <h2>The Tools</h2>
          <ul>
            <li>
              <strong>EssayCloner</strong> — Paste your writing samples, get new essays
              written in your actual voice — not ChatGPT's. Free.
            </li>
            <li>
              <strong>Feastmate</strong> — AI recipe generator on iOS. Tell it your macros
              and what's in your kitchen. $4.99/mo.
            </li>
            <li>
              <strong>Wholefed</strong> — Snap a photo of your food, get an instant AI
              health analysis beyond just calories. Free.
            </li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Philosophy</h2>
          <p>
            Every tool here does one thing well. I don't add features just because
            I can. If it doesn't solve a real problem that real people have, it doesn't
            get built. If it can be simpler, it should be simpler.
          </p>
        </div>

        <div className="about-section">
          <h2>Follow Along</h2>
          <p>
            I document the building process on social media. Follow me
            on <a href="https://tiktok.com/@alekokourtidis" target="_blank" rel="noopener" style={{ color: "var(--purple)", fontWeight: 500 }}>TikTok</a> and <a href="https://instagram.com/alekokourtidis" target="_blank" rel="noopener" style={{ color: "var(--purple)", fontWeight: 500 }}>Instagram</a> at
            @alekokourtidis, or browse all the tools on the <Link href="/" style={{ color: "var(--purple)", fontWeight: 500 }}>homepage</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
