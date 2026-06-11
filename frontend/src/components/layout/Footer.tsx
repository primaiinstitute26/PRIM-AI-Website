// Public site footer

export function Footer() {
  return (
    <footer
      className="mt-24 py-10 px-6 md:px-12 text-center text-sm"
      style={{
        borderTop: '1px solid var(--border)',
        color: 'var(--muted)',
      }}
    >
      <div
        className="text-base font-bold gradient-text mb-2"
        style={{ fontFamily: 'var(--font-head)' }}
      >
        PRIM AI Institute
      </div>
      <p>Learn AI. Use AI. Lead with AI.</p>
      <p className="mt-1">
        © {new Date().getFullYear()} PRIM AI Institute. All rights reserved.
      </p>
    </footer>
  );
}
