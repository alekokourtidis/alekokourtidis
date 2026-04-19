export const metadata = { title: "Aleko Tools" };
export default function Page() {
  return (
    <>
      <style>{`.nav, .footer { display: none !important; } body { overflow: hidden; }`}</style>
      <iframe src="/design/blog.html" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", border: "none", zIndex: 9999 }} title="Aleko Tools" />
    </>
  );
}
