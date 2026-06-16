// Public site footer — 4-column layout, social links via admin settings

import { Link } from 'react-router-dom';
import { useSettingsStore } from '@/store/settingsStore';

interface SocialBtnProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function SocialBtn({ href, label, children }: SocialBtnProps) {
  const isExternal = href.startsWith('http');
  const cls =
    'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ' +
    'hover:-translate-y-0.5';

  if (!href || href === '#') {
    return (
      <span
        aria-label={label}
        className={cls}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          color: 'var(--muted)',
          cursor: 'default',
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className={cls}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--border)',
        color: 'var(--muted)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(0,212,255,0.1)';
        el.style.color = 'var(--electric)';
        el.style.borderColor = 'rgba(0,212,255,0.3)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = 'rgba(255,255,255,0.04)';
        el.style.color = 'var(--muted)';
        el.style.borderColor = 'var(--border)';
      }}
    >
      {children}
    </a>
  );
}

const colHeading = (text: string) => (
  <h4
    className="text-xs font-semibold uppercase tracking-[2.5px] mb-5"
    style={{ color: 'var(--electric)' }}
  >
    {text}
  </h4>
);

const navLink = (to: string, label: string) => (
  <Link
    key={to + label}
    to={to}
    className="block text-sm mb-3 transition-all duration-200 hover:translate-x-1"
    style={{ color: 'var(--muted)' }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--white)'; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
  >
    {label}
  </Link>
);

export function Footer() {
  const s = useSettingsStore((state) => state.s);

  const fb = s.footerSocialFacebook || '#';
  const yt = s.footerSocialYoutube || '#';
  const ig = s.footerSocialInstagram || '#';
  const li = s.footerSocialLinkedin || '#';

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--navy)' }}>
      {/* 4-col grid */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* COL 1 — Brand */}
        <div>
          <div
            className="text-2xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            <span style={{ color: 'var(--white)' }}>PRIM </span>
            <span style={{ color: 'var(--electric)' }}>AI</span>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--muted)', maxWidth: '220px', lineHeight: 1.6 }}
          >
            An elite AI training institute dedicated to forging the next generation of
            technological innovators.
          </p>
          <p className="text-xs mt-6" style={{ color: 'var(--muted)' }}>
            © 2026 PRIM AI Institute. All rights reserved.
          </p>
        </div>

        {/* COL 2 — Programs */}
        <div>
          {colHeading('Programs')}
          {navLink('/courses', 'Courses')}
          {navLink('/courses', 'Certifications')}
          {navLink('/contact', 'Corporate Training')}
        </div>

        {/* COL 3 — Legal */}
        <div>
          {colHeading('Legal')}
          {navLink('/privacy', 'Privacy Policy')}
          {navLink('/terms', 'Terms of Service')}
        </div>

        {/* COL 4 — Follow Us */}
        <div>
          {colHeading('Follow Us')}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <SocialBtn href={fb} label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </SocialBtn>

            <SocialBtn href={yt} label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--navy)" />
              </svg>
            </SocialBtn>

            <SocialBtn href={ig} label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </SocialBtn>

            <SocialBtn href={li} label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </SocialBtn>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            Built with ❤️ for Gujarat's AI-Ready future.
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            ISO 9001:2015 Certified
          </span>
        </div>
      </div>
    </footer>
  );
}
