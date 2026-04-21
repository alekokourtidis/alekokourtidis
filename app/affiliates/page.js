export const metadata = { title: "Aleko Tools" };
export default function Page() {
  return (
    <>
      <style>{`.nav, .footer { display: none !important; } body { overflow: hidden; }`}</style>
      <iframe src="/design/affiliates.html" style={{ display: "block", width: "100%", height: "100vh", border: "none" }} title="Aleko Tools" />
    </>
  );
}
