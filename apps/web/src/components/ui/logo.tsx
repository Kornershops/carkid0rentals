export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`flex items-center gap-3 group ${className}`} style={{ textDecoration: 'none' }}>
      {/* Geometric Mark */}
      <div style={{
        width: 36,
        height: 36,
        background: 'var(--accent)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid black',
        boxShadow: '2px 2px 0px #000000',
        transition: 'all 0.2s',
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: 18,
        color: 'white',
        letterSpacing: '-0.04em',
      }}>
        C0
      </div>
      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 18,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          CarKid<span style={{ color: 'var(--accent)' }}>0</span>
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 900,
          fontSize: 8,
          letterSpacing: '0.1em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase' as const,
          lineHeight: 1,
          marginTop: 2,
        }}>
          Mobility Layer
        </span>
      </div>
    </a>
  );
}
