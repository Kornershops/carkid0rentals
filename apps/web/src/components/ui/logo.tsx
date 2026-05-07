export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="/" className={`flex items-center gap-2.5 group ${className}`} style={{ textDecoration: 'none' }}>
      {/* Geometric Mark */}
      <div style={{
        width: 34,
        height: 34,
        background: 'var(--accent)',
        borderRadius: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(0, 113, 227, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 16,
        color: 'white',
        letterSpacing: '-0.04em',
      }}>
        C0
      </div>
      {/* Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>
          CarKid<span style={{ color: 'var(--accent)' }}>0</span>
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 8,
          letterSpacing: '0.05em',
          color: 'var(--text-secondary)',
          textTransform: 'uppercase' as const,
          lineHeight: 1,
          marginTop: 1,
        }}>
          Institutional Fleet
        </span>
      </div>
    </a>
  );
}
