export const metadata = {
  title: 'Not available in your region — Aleko Tools',
  robots: { index: false, follow: false },
};

export default function BlockedPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: '#09090b',
        color: '#fafafa',
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: 480, textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#a1a1aa',
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#f59e0b',
            }}
          />
          Region restricted
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            margin: '0 0 14px',
            lineHeight: 1.15,
          }}
        >
          Not available in your region.
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#a1a1aa',
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          Aleko Tools isn&rsquo;t available where you&rsquo;re visiting from.
        </p>
      </div>
    </main>
  );
}
