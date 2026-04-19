export default function NotFound() {
  return (
    <>
      <style>{`.nav, .footer { display: none !important; } body { overflow: hidden; }`}</style>
      <iframe src="/design/404.html" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", border: "none", zIndex: 9999 }} title="404" />
    </>
  );
}
