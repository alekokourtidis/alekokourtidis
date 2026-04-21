export const metadata = { title: "Aleko Tools" };
export default function Page() {
  return (
    <>
      <style>{`html, body { margin: 0; padding: 0; height: 100%; } .nav, .footer { display: none !important; }`}</style>
      <iframe src="/design/about.html" style={{ display: "block", width: "100%", height: "100vh", border: "none" }} title="Aleko Tools" />
    </>
  );
}
