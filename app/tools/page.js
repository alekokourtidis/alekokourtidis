export const metadata = { title: "Aleko Tools" };
export default function Page() {
  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; }
        .nav, .footer { display: none !important; }
        .tools-frame {
          display: block;
          width: 100%;
          height: 100vh;
          height: 100svh;
          border: none;
        }
      `}</style>
      <iframe src="/design/tools.html" className="tools-frame" title="Aleko Tools" />
    </>
  );
}
