import { useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export type TocItem = { id: string; label: string };

// ── Hook: active TOC section via IntersectionObserver ────────────────────────

export function useLegalTOC(items: TocItem[], defaultId: string) {
  const [activeSection, setActiveSection] = useState(defaultId);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-100px 0px -70% 0px' },
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return activeSection;
}

// ── TOC Sidebar (hidden on mobile) ───────────────────────────────────────────

export function LegalTOC({
  items,
  activeSection,
  accentColor,
  accentBg,
}: {
  items: TocItem[];
  activeSection: string;
  accentColor: string;
  accentBg: string;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        <p
          className="text-xs font-bold uppercase tracking-[1.5px] mb-4"
          style={{ color: 'var(--muted)' }}
        >
          On This Page
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm px-3 py-2 rounded-lg border-l-2 transition-all duration-200"
              style={
                activeSection === item.id
                  ? { color: accentColor, borderLeftColor: accentColor, background: accentBg }
                  : { color: 'var(--muted)', borderLeftColor: 'transparent' }
              }
              onMouseEnter={(e) => {
                if (activeSection !== item.id) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--white)';
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.borderLeftColor = accentColor;
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== item.id) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = 'var(--muted)';
                  el.style.background = 'transparent';
                  el.style.borderLeftColor = 'transparent';
                }
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-28">
      <h2
        className="text-xl font-bold tracking-[-0.5px] mb-4 pb-3 border-b"
        style={{
          fontFamily: 'var(--font-head)',
          color: 'var(--white)',
          borderColor: 'var(--border)',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────

export function LegalTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-bold tracking-[0.3px] border"
                style={{
                  fontFamily: 'var(--font-head)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--white)',
                  borderColor: 'var(--border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 text-sm leading-relaxed border"
                  style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
                  dangerouslySetInnerHTML={{ __html: cell }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Highlight box (cyan) ──────────────────────────────────────────────────────

export function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 my-4 text-sm leading-relaxed"
      style={{
        background: 'rgba(0,212,255,0.05)',
        border: '1px solid rgba(0,212,255,0.15)',
        color: 'var(--muted)',
      }}
    >
      {children}
    </div>
  );
}

// ── Warning box (orange) ──────────────────────────────────────────────────────

export function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5 my-4 text-sm leading-relaxed"
      style={{
        background: 'rgba(255,107,43,0.05)',
        border: '1px solid rgba(255,107,43,0.2)',
        color: 'var(--muted)',
      }}
    >
      {children}
    </div>
  );
}

// ── Contact block ─────────────────────────────────────────────────────────────

export function ContactBlock({
  items,
  linkColor = 'var(--electric)',
}: {
  items: { icon: string; text: string; href?: string }[];
  linkColor?: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 mt-4"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 text-sm py-3 border-b last:border-0"
          style={{ color: 'var(--muted)', borderColor: 'rgba(255,255,255,0.04)' }}
        >
          <span>{item.icon}</span>
          {item.href ? (
            <a
              href={item.href}
              className="hover:underline transition-colors"
              style={{ color: linkColor }}
            >
              {item.text}
            </a>
          ) : (
            <span>{item.text}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Prose helpers ─────────────────────────────────────────────────────────────

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`text-sm leading-[1.8] mb-3${className ? ' ' + className : ''}`}
      style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}
    >
      {children}
    </p>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-base font-bold mt-6 mb-3"
      style={{ fontFamily: 'var(--font-head)', color: 'var(--white)' }}
    >
      {children}
    </h3>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="pl-5 mb-3 space-y-1" style={{ color: 'var(--muted)' }}>
      {children}
    </ul>
  );
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li
      className="text-sm leading-[1.7] list-disc"
      style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}
    >
      {children}
    </li>
  );
}
