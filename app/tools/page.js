export const metadata = { title: "Aleko Tools" };
export default function Page() {
  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; overscroll-behavior: none; }
        .nav, .footer { display: none !important; }
        body { overflow: hidden; }
        .tools-frame {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100svh;
          border: none;
          z-index: 9999;
        }
      `}</style>
      <iframe src="/design/tools.html" className="tools-frame" title="Aleko Tools" />
    </>
  );
}
