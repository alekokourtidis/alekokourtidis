export default function NotFound() {
  return (
    <>
      <style>{`html, body { margin: 0; padding: 0; height: 100%; } .nav, .footer { display: none !important; }`}</style>
      <iframe src="/design/404.html" style={{ display: "block", width: "100%", height: "100vh", border: "none" }} title="404" />
    </>
  );
}
