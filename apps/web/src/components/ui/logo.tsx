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
        boxShadow: '0 4px 16px rgba(255, 107, 44, 0.3)',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
          fontWeight: 800,
          fontSize: 17,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          CarKid<span style={{ color: 'var(--accent)' }}>0</span>
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 9,
          letterSpacing: '0.12em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase' as const,
          lineHeight: 1,
          marginTop: 2,
        }}>
          Vehicle Rentals
        </span>
      </div>
    </a>
  );
}
