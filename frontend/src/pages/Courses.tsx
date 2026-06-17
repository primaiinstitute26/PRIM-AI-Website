import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses, getListingPage } from '@/api/courses';
import { useModal } from '@/hooks/useModal';
import { DemoModal } from '@/components/shared/DemoModal';
import type { AiCourse, CoursesListingPage } from '@/types';

const LEVEL_SLUG: Record<string, string> = {
  L1_FOUNDATION: 'l1',
  L2A_GENERALIST: 'l2a',
  L2B_DEVELOPER: 'l2b',
};

const LEVEL_COLOR: Record<string, string> = {
  L1_FOUNDATION: 'var(--electric)',
  L2A_GENERALIST: 'var(--orange)',
  L2B_DEVELOPER: '#a78bfa',
};

function MetaPill({ label }: { label: string }) {
  return (
    <span
      className="text-xs px-3 py-1 rounded-full font-medium"
      style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)', border: '1px solid var(--border)' }}
    >
      {label}
    </span>
  );
}

function CourseCard({ course }: { course: AiCourse }) {
  const slug = LEVEL_SLUG[course.level];
  const accentColor = LEVEL_COLOR[course.level];
  const modal = useModal();
  const firstTools = course.tools.slice(0, 7);
  const extraTools = course.tools.length - 7;

  return (
    <>
      <div
        className="glass-card rounded-2xl p-6 md:p-8 flex flex-col gap-5"
        style={{ borderTop: `3px solid ${accentColor}` }}
      >
        <div>
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block"
            style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}40` }}
          >
            {course.badgeText}
          </span>
          <h3
            className="text-xl md:text-2xl font-bold mt-2"
            style={{ color: 'var(--white)', fontFamily: 'var(--font-head)' }}
          >
            {course.title}
          </h3>
          <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
            {course.tagline}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <MetaPill label={`⏱ ${course.duration}`} />
          <MetaPill label={`📍 ${course.mode}`} />
          <MetaPill label={`🌐 ${course.language}`} />
          <MetaPill label={`🎓 ${course.levelLabel}`} />
        </div>

        {course.tools.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>
              Tools You'll Master
            </p>
            <div className="flex flex-wrap gap-2">
              {firstTools.map((t) => (
                <span
                  key={t.id}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--white)', border: '1px solid var(--border)' }}
                >
                  {t.emoji} {t.name}
                </span>
              ))}
              {extraTools > 0 && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                  +{extraTools} more
                </span>
              )}
            </div>
          </div>
        )}

        {course.outcomes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {course.outcomes.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: accentColor }}>✓</span>
                <span className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{o.title}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-auto pt-2">
          <button onClick={modal.open} className="btn-primary text-sm px-5 py-2.5">
            {course.ctaDemoText}
          </button>
          <Link to={`/courses/${slug}`} className="btn-outline text-sm px-5 py-2.5">
            View Course ➞
          </Link>
        </div>
      </div>
      <DemoModal isOpen={modal.isOpen} onClose={modal.close} />
    </>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 animate-pulse">
      <div className="h-4 w-24 rounded mb-3" style={{ background: 'var(--border)' }} />
      <div className="h-7 w-3/4 rounded mb-2" style={{ background: 'var(--border)' }} />
      <div className="h-4 w-full rounded mb-1" style={{ background: 'var(--border)' }} />
      <div className="h-4 w-2/3 rounded mb-6" style={{ background: 'var(--border)' }} />
      <div className="flex gap-2 flex-wrap mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 w-20 rounded-full" style={{ background: 'var(--border)' }} />
        ))}
      </div>
    </div>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Courses() {
  const [courses, setCourses] = useState<AiCourse[]>([]);
  const [page, setPage] = useState<CoursesListingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const modal = useModal();
  const heroRef = useReveal();
  const pathwayRef = useReveal();
  const whoRef = useReveal();

  useEffect(() => {
    Promise.all([getAllCourses(), getListingPage()])
      .then(([cRes, pRes]) => {
        setCourses(cRes.data);
        setPage(pRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const l1 = courses.find((c) => c.level === 'L1_FOUNDATION');
  const l2a = courses.find((c) => c.level === 'L2A_GENERALIST');
  const l2b = courses.find((c) => c.level === 'L2B_DEVELOPER');

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center">
        <div ref={heroRef} className="reveal max-w-3xl mx-auto">
          <div className="section-tag mb-4">
            {page?.heroTag ?? 'THE PROGRAMS'}
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--white)', fontFamily: 'var(--font-head)' }}
          >
            {page?.heroHeadingMain ?? 'One Path.'}{' '}
            <span className="gradient-text">{page?.heroHeadingAccent ?? 'Three Levels.'}</span>
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            {page?.heroSubtitle ?? 'From absolute beginner to professional AI practitioner -our structured pathway takes you from zero knowledge to job-ready skills at the pace that suits you.'}
          </p>
        </div>
      </section>

      {/* Pathway */}
      <section className="pb-20 px-4">
        <div ref={pathwayRef} className="reveal max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col gap-6">
              <SkeletonCard />
              <div className="grid md:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          ) : (
            <>
              {l1 && <CourseCard course={l1} />}

              {/* Divider */}
              <div className="flex flex-col items-center gap-3 my-8">
                <div className="w-px h-8" style={{ background: 'var(--border)' }} />
                <div
                  className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                  Choose Your Track at Level 2
                </div>
                <div
                  className="flex items-end justify-center gap-0 w-64"
                  style={{ color: 'var(--muted)', fontSize: 11 }}
                >
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-px h-6" style={{ background: 'var(--border)' }} />
                    <span>↙ L2A Non-Tech</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-px h-6" style={{ background: 'var(--border)' }} />
                    <span>L2B Tech ↘</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {l2a && <CourseCard course={l2a} />}
                {l2b && <CourseCard course={l2b} />}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-20 px-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div ref={whoRef} className="reveal max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-tag mb-4">
              {page?.whoTag ?? 'WHO IS THIS FOR'}
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: 'var(--white)', fontFamily: 'var(--font-head)' }}
            >
              {page?.whoHeadingMain ?? 'Built for'}{' '}
              <span className="gradient-text">{page?.whoHeadingAccent ?? 'Every Background'}</span>
            </h2>
          </div>

          {page && page.whoCards.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {page.whoCards.slice(0, 3).map((card) => (
                  <div key={card.id} className="glass-card glass-card-hover rounded-xl p-5">
                    <div className="text-3xl mb-3">{card.emoji}</div>
                    <h3 className="font-bold mb-1.5 text-base" style={{ color: 'var(--white)', fontFamily: 'var(--font-head)' }}>
                      {card.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{card.desc}</p>
                  </div>
                ))}
              </div>
              {page.whoCards.length > 3 && (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mx-auto ${
                    page.whoCards.length - 3 === 1 ? 'max-w-sm' :
                    page.whoCards.length - 3 === 2 ? 'max-w-2xl' : ''
                  }`}
                >
                  {page.whoCards.slice(3).map((card) => (
                    <div key={card.id} className="glass-card glass-card-hover rounded-xl p-5">
                      <div className="text-3xl mb-3">{card.emoji}</div>
                      <h3 className="font-bold mb-1.5 text-base" style={{ color: 'var(--white)', fontFamily: 'var(--font-head)' }}>
                        {card.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{card.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="glass-card rounded-xl p-5 h-32" style={{ background: 'var(--card)' }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div
          className="max-w-3xl mx-auto text-center glass-card rounded-2xl p-10 md:p-14"
          style={{ border: '1px solid rgba(0,212,255,0.15)' }}
        >
          <div className="section-tag mb-4">
            {page?.ctaTag ?? 'GET STARTED'}
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--white)', fontFamily: 'var(--font-head)' }}
          >
            {page?.ctaHeading ?? 'Not Sure Where to Start?'}
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--muted)' }}>
            {page?.ctaDesc ?? 'Book a free 60-minute demo session and our trainers will guide you to the right level based on your background, goals, and schedule.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={modal.open} className="btn-primary px-8 py-3 text-base">
              {page?.ctaBtnPrimary ?? 'Book Free Demo ➞'}
            </button>
            <Link to="/contact" className="btn-outline px-8 py-3 text-base">
              {page?.ctaBtnSecondary ?? 'Talk to Us'}
            </Link>
          </div>
        </div>
      </section>

      <DemoModal isOpen={modal.isOpen} onClose={modal.close} />
    </div>
  );
}
