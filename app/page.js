import Script from "next/script";

export const metadata = {
  title: "Aleko Tools — small, sharp AI tools",
  description: "AI-powered tools built by a 17-year-old solo developer. Essays, studying, health, security, and more.",
};

export default function Home() {
  return (
    <>
      <style>{`
        .nav, .footer { display: none !important; }
        body { overflow: hidden; }
      `}</style>
      <iframe
        src="/design/index.html"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          border: "none",
          zIndex: 9999,
        }}
        title="Aleko Tools"
      />
    </>
  );
}
