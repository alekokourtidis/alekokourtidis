import Script from "next/script";

export const metadata = {
  title: "Aleko Tools — small, sharp AI tools",
  description: "AI-powered tools built by a 17-year-old solo developer. Essays, studying, health, security, and more.",
};

export default function Home() {
  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; }
        .nav, .footer { display: none !important; }
        .home-frame {
          display: block;
          width: 100%;
          height: 100vh;
          height: 100svh;
          border: none;
        }
      `}</style>
      <iframe
        src="/design/index.html"
        className="home-frame"
        title="Aleko Tools"
      />
    </>
  );
}
