import { useEffect, useState, useCallback } from 'react';
import { getSettings, updateSetting } from '@/api/admin';
import { useSettingsStore } from '@/store/settingsStore';

// ─── Types ────────────────────────────────────────────────────────

interface FormValues {
  // Home hero
  hero_badge_text: string;
  hero_heading_line1: string;
  hero_heading_cyan: string;
  hero_heading_white: string;
  hero_heading_orange: string;
  hero_subtext: string;
  hero_cta1_text: string;
  hero_cta2_text: string;
  // Home stats
  hero_students_count: string;
  hero_students_label: string;
  hero_companies_count: string;
  hero_companies_label: string;
  hero_years_count: string;
  hero_years_label: string;
  hero_iso_show: string;
  // Navigation
  nav_logo_text: string;
  nav_cta_text: string;
  nav_link_home: string;
  nav_link_about: string;
  nav_link_courses: string;
  nav_link_contact: string;
  // Batch banner
  new_batch_banner: string;
  new_batch_text: string;
  // About hero
  about_badge_text: string;
  about_hero_h1: string;
  about_hero_h1_accent: string;
  about_hero_subtext: string;
  about_stat1_count: string;
  about_stat1_label: string;
  about_stat2_count: string;
  about_stat2_label: string;
  about_stat3_count: string;
  about_stat3_label: string;
  about_show_iso: string;
  // About quote
  about_show_quote: string;
  about_quote_main: string;
  about_quote_accent: string;
  // About differentiators
  about_show_diff: string;
  about_diff1_icon: string;
  about_diff1_title: string;
  about_diff1_body: string;
  about_diff2_icon: string;
  about_diff2_title: string;
  about_diff2_body: string;
  about_diff3_icon: string;
  about_diff3_title: string;
  about_diff3_body: string;
  about_diff4_icon: string;
  about_diff4_title: string;
  about_diff4_body: string;
  // About trainers
  about_show_trainers: string;
  about_trainer1_name: string;
  about_trainer1_role: string;
  about_trainer1_exp: string;
  about_trainer1_img: string;
  about_trainer2_name: string;
  about_trainer2_role: string;
  about_trainer2_exp: string;
  about_trainer2_img: string;
  about_trainer3_name: string;
  about_trainer3_role: string;
  about_trainer3_exp: string;
  about_trainer3_img: string;
  // About CTA
  about_show_cta: string;
  about_cta_heading: string;
  about_cta_subtext: string;
  about_cta_btn1_text: string;
  about_cta_btn2_text: string;
}

type FormKey = keyof FormValues;

const DEFAULTS: FormValues = {
  hero_badge_text: "India's AI-First Training Institute",
  hero_heading_line1: 'The Future Runs on AI.',
  hero_heading_cyan: 'Are',
  hero_heading_white: 'You',
  hero_heading_orange: 'Ready?',
  hero_subtext: 'Join PRIM AI Institute — where school students, professionals & entrepreneurs learn to harness the power of Artificial Intelligence and lead the next decade.',
  hero_cta1_text: 'Book Your Free Demo Class',
  hero_cta2_text: 'Explore Courses',
  hero_students_count: '5000+',
  hero_students_label: 'Students',
  hero_companies_count: '350+',
  hero_companies_label: 'Companies',
  hero_years_count: '10+',
  hero_years_label: 'Years',
  hero_iso_show: 'true',
  nav_logo_text: 'PRIM AI',
  nav_cta_text: 'Book Free Demo',
  nav_link_home: 'Home',
  nav_link_about: 'About',
  nav_link_courses: 'Courses',
  nav_link_contact: 'Contact',
  new_batch_banner: 'true',
  new_batch_text: 'New Batch Starting Soon — Limited Seats!',
  // About
  about_badge_text: 'OUR STORY',
  about_hero_h1: 'Built by Industry Veterans.',
  about_hero_h1_accent: 'Designed for Your Future.',
  about_hero_subtext: 'PRIM AI Institute emerged from a simple realization: the gap between academic theory and industry reality in Artificial Intelligence was widening.',
  about_stat1_count: '10+',
  about_stat1_label: 'YEARS EXP',
  about_stat2_count: '5k+',
  about_stat2_label: 'STUDENTS',
  about_stat3_count: '350+',
  about_stat3_label: 'COMPANIES',
  about_show_iso: 'true',
  about_show_quote: 'true',
  about_quote_main: 'We believe AI education should be accessible to every Indian —',
  about_quote_accent: 'from Class 6 to CEO.',
  about_show_diff: 'true',
  about_diff1_icon: '🏅',
  about_diff1_title: 'ISO Certified',
  about_diff1_body: 'Internationally recognized quality management standards in technical education.',
  about_diff2_icon: '🧑‍💻',
  about_diff2_title: 'MNC Experts',
  about_diff2_body: 'Learn directly from senior engineers actively working in top tech companies.',
  about_diff3_icon: '🚀',
  about_diff3_title: '100% Placement',
  about_diff3_body: 'Dedicated career support and direct hiring partnerships with leading firms.',
  about_diff4_icon: '⚡',
  about_diff4_title: '100% Practical',
  about_diff4_body: 'Zero theoretical bloat. Build real-world projects from day one.',
  about_show_trainers: 'true',
  about_trainer1_name: 'Dr. Alok Sharma',
  about_trainer1_role: 'Lead AI Architect',
  about_trainer1_exp: '15+ YRS EXP',
  about_trainer1_img: '',
  about_trainer2_name: 'Priya Patel',
  about_trainer2_role: 'Senior ML Engineer',
  about_trainer2_exp: '8+ YRS EXP',
  about_trainer2_img: '',
  about_trainer3_name: 'Rahul Verma',
  about_trainer3_role: 'Director of Research',
  about_trainer3_exp: '12+ YRS EXP',
  about_trainer3_img: '',
  about_show_cta: 'true',
  about_cta_heading: 'Ready to Shape the Future?',
  about_cta_subtext: 'Join thousands of professionals who have accelerated their careers through our industry-aligned AI programs.',
  about_cta_btn1_text: 'Explore Courses',
  about_cta_btn2_text: 'Contact Admissions',
};

// ─── Section definitions ──────────────────────────────────────────

interface FieldDef {
  key: FormKey;
  label: string;
  type?: 'text' | 'textarea' | 'toggle';
  hint?: string;
}

interface SectionDef {
  id: string;
  icon: string;
  title: string;
  accentColor: string;
  fields: FieldDef[];
}

const HOME_SECTIONS: SectionDef[] = [
  {
    id: 'hero',
    icon: '🎯',
    title: 'Hero Content',
    accentColor: 'var(--electric)',
    fields: [
      { key: 'hero_badge_text', label: 'Badge Text', hint: 'Pill above the heading' },
      { key: 'hero_heading_line1', label: 'Heading — Line 1' },
      { key: 'hero_heading_cyan', label: 'Heading — Cyan Word', hint: 'Displays in cyan (#00D4FF)' },
      { key: 'hero_heading_white', label: 'Heading — White Word' },
      { key: 'hero_heading_orange', label: 'Heading — Orange Word', hint: 'Displays in orange (#FF6B2B)' },
      { key: 'hero_subtext', label: 'Subtext Paragraph', type: 'textarea' },
      { key: 'hero_cta1_text', label: 'Primary CTA Button Text', hint: 'Orange button' },
      { key: 'hero_cta2_text', label: 'Secondary CTA Text', hint: 'Ghost link' },
    ],
  },
  {
    id: 'stats',
    icon: '📊',
    title: 'Hero Stats',
    accentColor: 'var(--orange)',
    fields: [
      { key: 'hero_students_count', label: 'Students — Number', hint: 'e.g. 5000+' },
      { key: 'hero_students_label', label: 'Students — Label' },
      { key: 'hero_companies_count', label: 'Companies — Number' },
      { key: 'hero_companies_label', label: 'Companies — Label' },
      { key: 'hero_years_count', label: 'Years — Number' },
      { key: 'hero_years_label', label: 'Years — Label' },
      { key: 'hero_iso_show', label: 'Show ISO Certified Pill', type: 'toggle' },
    ],
  },
  {
    id: 'nav',
    icon: '🧭',
    title: 'Navigation',
    accentColor: '#a78bfa',
    fields: [
      { key: 'nav_logo_text', label: 'Logo Text', hint: 'Top-left in navbar' },
      { key: 'nav_cta_text', label: 'Navbar CTA Button Text' },
      { key: 'nav_link_home', label: 'Nav Link — Home' },
      { key: 'nav_link_about', label: 'Nav Link — About' },
      { key: 'nav_link_courses', label: 'Nav Link — Courses' },
      { key: 'nav_link_contact', label: 'Nav Link — Contact' },
    ],
  },
  {
    id: 'banner',
    icon: '📢',
    title: 'Batch Banner',
    accentColor: '#f43f5e',
    fields: [
      { key: 'new_batch_banner', label: 'Show Batch Banner', type: 'toggle' },
      { key: 'new_batch_text', label: 'Banner Message Text', hint: 'Orange bar above hero' },
    ],
  },
];

const ABOUT_SECTIONS: SectionDef[] = [
  {
    id: 'about_hero',
    icon: '🏛️',
    title: 'About — Hero',
    accentColor: 'var(--electric)',
    fields: [
      { key: 'about_badge_text', label: 'Badge Text', hint: 'Small pill above heading (e.g. OUR STORY)' },
      { key: 'about_hero_h1', label: 'Heading — Line 1', hint: 'White text line' },
      { key: 'about_hero_h1_accent', label: 'Heading — Gradient Line', hint: 'Cyan → orange gradient line' },
      { key: 'about_hero_subtext', label: 'Subtext Paragraph', type: 'textarea' },
      { key: 'about_stat1_count', label: 'Stat 1 — Number', hint: 'e.g. 10+' },
      { key: 'about_stat1_label', label: 'Stat 1 — Label', hint: 'e.g. YEARS EXP' },
      { key: 'about_stat2_count', label: 'Stat 2 — Number' },
      { key: 'about_stat2_label', label: 'Stat 2 — Label' },
      { key: 'about_stat3_count', label: 'Stat 3 — Number' },
      { key: 'about_stat3_label', label: 'Stat 3 — Label' },
      { key: 'about_show_iso', label: 'Show ISO Certified Card', type: 'toggle' },
    ],
  },
  {
    id: 'about_quote',
    icon: '💬',
    title: 'About — Mission Quote',
    accentColor: '#a78bfa',
    fields: [
      { key: 'about_show_quote', label: 'Show Quote Section', type: 'toggle' },
      { key: 'about_quote_main', label: 'Quote — Main Text', hint: 'White portion of the quote' },
      { key: 'about_quote_accent', label: 'Quote — Accent Text', hint: 'Cyan highlighted portion' },
    ],
  },
  {
    id: 'about_diff',
    icon: '⭐',
    title: 'About — Why Different',
    accentColor: 'var(--orange)',
    fields: [
      { key: 'about_show_diff', label: 'Show This Section', type: 'toggle' },
      { key: 'about_diff1_icon', label: 'Card 1 — Icon', hint: 'Paste an emoji (e.g. 🏅)' },
      { key: 'about_diff1_title', label: 'Card 1 — Title' },
      { key: 'about_diff1_body', label: 'Card 1 — Body', type: 'textarea' },
      { key: 'about_diff2_icon', label: 'Card 2 — Icon' },
      { key: 'about_diff2_title', label: 'Card 2 — Title' },
      { key: 'about_diff2_body', label: 'Card 2 — Body', type: 'textarea' },
      { key: 'about_diff3_icon', label: 'Card 3 — Icon' },
      { key: 'about_diff3_title', label: 'Card 3 — Title' },
      { key: 'about_diff3_body', label: 'Card 3 — Body', type: 'textarea' },
      { key: 'about_diff4_icon', label: 'Card 4 — Icon' },
      { key: 'about_diff4_title', label: 'Card 4 — Title' },
      { key: 'about_diff4_body', label: 'Card 4 — Body', type: 'textarea' },
    ],
  },
  {
    id: 'about_trainers',
    icon: '👩‍🏫',
    title: 'About — Trainers',
    accentColor: '#34d399',
    fields: [
      { key: 'about_show_trainers', label: 'Show Trainers Section', type: 'toggle' },
      { key: 'about_trainer1_name', label: 'Trainer 1 — Name' },
      { key: 'about_trainer1_role', label: 'Trainer 1 — Role / Title' },
      { key: 'about_trainer1_exp', label: 'Trainer 1 — Experience Badge', hint: 'e.g. 15+ YRS EXP' },
      { key: 'about_trainer1_img', label: 'Trainer 1 — Photo URL', hint: 'Leave blank to show initials avatar' },
      { key: 'about_trainer2_name', label: 'Trainer 2 — Name' },
      { key: 'about_trainer2_role', label: 'Trainer 2 — Role / Title' },
      { key: 'about_trainer2_exp', label: 'Trainer 2 — Experience Badge' },
      { key: 'about_trainer2_img', label: 'Trainer 2 — Photo URL' },
      { key: 'about_trainer3_name', label: 'Trainer 3 — Name' },
      { key: 'about_trainer3_role', label: 'Trainer 3 — Role / Title' },
      { key: 'about_trainer3_exp', label: 'Trainer 3 — Experience Badge' },
      { key: 'about_trainer3_img', label: 'Trainer 3 — Photo URL' },
    ],
  },
  {
    id: 'about_cta',
    icon: '🚀',
    title: 'About — CTA Section',
    accentColor: '#f43f5e',
    fields: [
      { key: 'about_show_cta', label: 'Show CTA Section', type: 'toggle' },
      { key: 'about_cta_heading', label: 'CTA Heading' },
      { key: 'about_cta_subtext', label: 'CTA Subtext', type: 'textarea' },
      { key: 'about_cta_btn1_text', label: 'Button 1 Text', hint: 'Links to /courses' },
      { key: 'about_cta_btn2_text', label: 'Button 2 Text', hint: 'Links to /contact' },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────

export default function Settings() {
  const [form, setForm] = useState<FormValues>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [sectionSaving, setSectionSaving] = useState<string | null>(null);
  const [sectionSaved, setSectionSaved] = useState<string | null>(null);
  const refreshPublic = useSettingsStore((state) => state.fetch);

  useEffect(() => {
    getSettings()
      .then((res) => {
        const raw = res.data as Record<string, string>;
        setForm((prev) => {
          const next = { ...prev };
          (Object.keys(DEFAULTS) as FormKey[]).forEach((k) => {
            if (raw[k] !== undefined) next[k] = raw[k];
          });
          return next;
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = useCallback((key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const saveSection = async (section: SectionDef) => {
    setSectionSaving(section.id);
    try {
      await Promise.all(section.fields.map((f) => updateSetting(f.key, form[f.key])));
      await refreshPublic();
      setSectionSaved(section.id);
      setTimeout(() => setSectionSaved(null), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSectionSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ color: 'var(--muted)' }}>
        Loading settings…
      </div>
    );
  }

  const renderSection = (section: SectionDef) => (
    <div key={section.id} className="glass-card rounded-2xl overflow-hidden">
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,.02)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{section.icon}</span>
          <h2 className="font-bold text-sm" style={{ fontFamily: 'var(--font-head)', color: 'var(--white)' }}>
            {section.title}
          </h2>
        </div>
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: section.accentColor, boxShadow: `0 0 6px ${section.accentColor}` }}
        />
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {section.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: section.accentColor }}>
              {field.label}
            </label>
            {field.hint && (
              <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>{field.hint}</p>
            )}
            {field.type === 'toggle' ? (
              <button
                type="button"
                onClick={() => set(field.key, form[field.key] === 'true' ? 'false' : 'true')}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: form[field.key] === 'true' ? 'rgba(0,212,255,.12)' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${form[field.key] === 'true' ? 'rgba(0,212,255,.3)' : 'var(--border)'}`,
                  color: form[field.key] === 'true' ? 'var(--electric)' : 'var(--muted)',
                }}
              >
                <span
                  className="w-8 h-4 rounded-full relative transition-all duration-200 flex-shrink-0"
                  style={{ background: form[field.key] === 'true' ? 'var(--electric)' : 'rgba(255,255,255,.15)' }}
                >
                  <span
                    className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-200"
                    style={{ left: form[field.key] === 'true' ? '18px' : '2px' }}
                  />
                </span>
                {form[field.key] === 'true' ? 'Enabled' : 'Disabled'}
              </button>
            ) : field.type === 'textarea' ? (
              <textarea
                rows={3}
                value={form[field.key]}
                onChange={(e) => set(field.key, e.target.value)}
                style={{ resize: 'vertical' }}
              />
            ) : (
              <input
                type="text"
                value={form[field.key]}
                onChange={(e) => set(field.key, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => saveSection(section)}
            disabled={sectionSaving === section.id}
            className="btn-primary text-sm px-6 py-2"
            style={{ minWidth: '130px' }}
          >
            {sectionSaving === section.id
              ? 'Saving…'
              : sectionSaved === section.id
              ? '✓ Saved!'
              : `Save ${section.title.replace(/^About — /, '')}`}
          </button>
          {sectionSaved === section.id && (
            <span className="text-xs" style={{ color: 'var(--electric)' }}>
              Live site updated
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-head)', color: 'var(--white)' }}>
            Site Content
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            All changes update the live website immediately after saving.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm px-4 py-2">
            Preview Home ↗
          </a>
          <a href="/about" target="_blank" rel="noopener noreferrer" className="btn-electric text-sm px-4 py-2">
            Preview About ↗
          </a>
        </div>
      </div>

      {/* Live heading preview */}
      <div
        className="glass-card p-5 mb-8 rounded-2xl"
        style={{ background: 'rgba(0,0,0,.25)', border: '1px solid rgba(0,212,255,.15)' }}
      >
        <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: 'var(--electric)' }}>
          Home Heading Preview
        </p>
        <div
          className="font-bold leading-tight"
          style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', color: 'var(--white)' }}
        >
          {form.hero_heading_line1}
          <span className="block">
            <span style={{ color: 'var(--electric)' }}>{form.hero_heading_cyan || 'Are'}</span>{' '}
            <span style={{ color: 'var(--white)' }}>{form.hero_heading_white || 'You'}</span>{' '}
            <span style={{ color: 'var(--orange)' }}>{form.hero_heading_orange || 'Ready?'}</span>
          </span>
        </div>
      </div>

      {/* ── Homepage sections ──────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-bold tracking-widest uppercase px-3" style={{ color: 'var(--orange)' }}>
          Home Page
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>
      <div className="flex flex-col gap-8">
        {HOME_SECTIONS.map(renderSection)}
      </div>

      {/* ── About Page sections ────────────────────────────────── */}
      <div className="flex items-center gap-4 mt-12 mb-6">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs font-bold tracking-widest uppercase px-3" style={{ color: 'var(--electric)' }}>
          About Page
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>
      <div className="flex flex-col gap-8">
        {ABOUT_SECTIONS.map(renderSection)}
      </div>
    </div>
  );
}
