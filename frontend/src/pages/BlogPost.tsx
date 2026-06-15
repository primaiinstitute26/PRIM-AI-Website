import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Share2, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { fetchPostBySlug, fetchPublicPosts, type BlogPost as BlogPostType } from '@/api/blog';

// ─── Reading progress bar ──────────────────────────────────────────────────

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-16 left-0 right-0 z-30 h-0.5 transition-all"
      style={{ background: 'var(--border)' }}
    >
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--electric), var(--orange))',
        }}
      />
    </div>
  );
}

// ─── Table of contents ─────────────────────────────────────────────────────

interface TocItem { id: string; text: string; level: number; }

function buildToc(html: string): TocItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');
  return Array.from(headings).map((h, i) => ({
    id: `heading-${i}`,
    text: h.textContent ?? '',
    level: parseInt(h.tagName[1], 10),
  }));
}

function injectIds(html: string): string {
  let index = 0;
  return html.replace(/<(h[23])([ >])/g, (_match, tag, rest) => {
    return `<${tag} id="heading-${index++}"${rest}`;
  });
}

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  if (!items.length) return null;

  return (
    <div className="glass-card p-5 rounded-2xl sticky top-24">
      <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
        On this page
      </h4>
      <nav className="space-y-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex items-start gap-2 text-sm py-1 transition-colors rounded"
            style={{
              paddingLeft: item.level === 3 ? '0.75rem' : 0,
              color: activeId === item.id ? 'var(--electric)' : 'var(--muted)',
            }}
          >
            {activeId === item.id && <ChevronRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--electric)' }} />}
            <span className="leading-snug">{item.text}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}

// ─── Share buttons ─────────────────────────────────────────────────────────

function ShareButtons({ title }: { title: string }) {
  const url = window.location.href;
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
  }

  return (
    <div className="glass-card p-5 rounded-2xl">
      <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
        Share
      </h4>
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ background: 'rgba(29,161,242,0.1)', color: '#1DA1F2', border: '1px solid rgba(29,161,242,0.2)' }}
        >
          <Share2 size={14} /> Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors"
          style={{ background: 'rgba(0,119,181,0.1)', color: '#0077B5', border: '1px solid rgba(0,119,181,0.2)' }}
        >
          <Share2 size={14} /> LinkedIn
        </a>
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            background: copied ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)',
            color: copied ? 'var(--electric)' : 'var(--muted)',
            border: `1px solid ${copied ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
          }}
        >
          <LinkIcon size={14} /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

// ─── Author bio ────────────────────────────────────────────────────────────

function AuthorBio({ author }: { author: BlogPostType['author'] }) {
  return (
    <div className="glass-card p-5 rounded-2xl">
      <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
        Author
      </h4>
      <div className="flex items-start gap-3">
        {author.avatarUrl ? (
          <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
            style={{ background: 'rgba(0,212,255,0.15)', color: 'var(--electric)' }}>
            {author.name[0]}
          </div>
        )}
        <div>
          <p className="font-semibold text-sm" style={{ fontFamily: 'var(--font-head)', color: 'var(--white)' }}>
            {author.name}
          </p>
          {author.bio && (
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{author.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Related posts ─────────────────────────────────────────────────────────

function RelatedPosts({ posts }: { posts: BlogPostType[] }) {
  if (!posts.length) return null;
  return (
    <section className="mt-16 pt-12" style={{ borderTop: '1px solid var(--border)' }}>
      <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'var(--font-head)', color: 'var(--white)' }}>
        Related Articles
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="glass-card glass-card-hover flex gap-4 p-4 rounded-xl"
          >
            {post.coverImageUrl && (
              <img src={post.coverImageUrl} alt={post.title} className="w-20 h-16 rounded-lg object-cover shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold mb-1" style={{ color: post.category.color }}>{post.category.name}</p>
              <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: 'var(--white)', fontFamily: 'var(--font-head)' }}>
                {post.title}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: 'var(--muted)' }}>
                <Clock size={11} />
                <span>{post.readTimeMin} min</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPostBySlug(slug)
      .then((data) => {
        setPost(data);
        if (data.content) {
          setTocItems(buildToc(data.content));
        }
        return fetchPublicPosts({ limit: 4, category: data.category.slug });
      })
      .then((res) => {
        setRelatedPosts(res.posts.filter((p) => p.slug !== slug).slice(0, 2));
      })
      .catch(() => navigate('/blog'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  // Active TOC heading tracking
  useEffect(() => {
    if (!tocItems.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' },
    );
    document.querySelectorAll('[id^="heading-"]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [tocItems, post]);

  if (loading) {
    return (
      <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
        <ReadingProgressBar />
        <div className="pt-28 pb-20 px-6 md:px-12">
          <div className="max-w-6xl mx-auto animate-pulse">
            <div className="h-8 rounded mb-4" style={{ background: 'rgba(255,255,255,0.06)', width: '70%' }} />
            <div className="h-5 rounded mb-2" style={{ background: 'rgba(255,255,255,0.04)', width: '50%' }} />
            <div className="h-64 rounded-2xl mt-8" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const processedContent = post.content ? injectIds(post.content) : '';
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <ReadingProgressBar />

      {/* Cover hero */}
      <div className="relative pt-16" style={{ minHeight: '420px' }}>
        {post.coverImageUrl ? (
          <>
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(2,8,24,0.4) 0%, rgba(2,8,24,0.95) 100%)' }}
            />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,107,43,0.06))' }}
          />
        )}

        <div className="relative z-10 px-6 md:px-12 pt-16 pb-12 max-w-6xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-white"
            style={{ color: 'var(--muted)' }}
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: post.category.color + '22', color: post.category.color, border: `1px solid ${post.category.color}44` }}
            >
              {post.category.name}
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag.id} className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}>
                #{tag.name}
              </span>
            ))}
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl"
            style={{ fontFamily: 'var(--font-head)', color: 'var(--white)' }}
          >
            {post.title}
          </h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--muted)' }}>
            <div className="flex items-center gap-2">
              {post.author.avatarUrl ? (
                <img src={post.author.avatarUrl} alt={post.author.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(0,212,255,0.15)', color: 'var(--electric)' }}>
                  {post.author.name[0]}
                </div>
              )}
              <span className="font-medium" style={{ color: 'var(--white)' }}>{post.author.name}</span>
            </div>
            {formattedDate && <span>{formattedDate}</span>}
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readTimeMin} min read</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content + sidebar */}
      <div className="px-6 md:px-12 pb-24 max-w-6xl mx-auto">
        <div className="flex gap-8 items-start">
          {/* Main content (70%) */}
          <article className="flex-1 min-w-0">
            <div
              ref={contentRef}
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            <RelatedPosts posts={relatedPosts} />
          </article>

          {/* Sidebar (30%) */}
          <aside className="hidden lg:flex flex-col gap-5 w-72 shrink-0">
            <TableOfContents items={tocItems} activeId={activeId} />
            <ShareButtons title={post.title} />
            <AuthorBio author={post.author} />
          </aside>
        </div>
      </div>

      <style>{`
        .prose-blog { color: var(--white); line-height: 1.8; font-size: 1.0625rem; font-family: var(--font-body); }
        .prose-blog h2 { font-family: var(--font-head); font-size: 1.6rem; font-weight: 700; color: var(--white); margin: 2.5rem 0 1rem; }
        .prose-blog h3 { font-family: var(--font-head); font-size: 1.25rem; font-weight: 600; color: var(--white); margin: 2rem 0 0.75rem; }
        .prose-blog p { margin: 1.25rem 0; color: var(--muted); }
        .prose-blog a { color: var(--electric); text-decoration: underline; }
        .prose-blog strong { color: var(--white); font-weight: 600; }
        .prose-blog em { color: var(--muted); }
        .prose-blog ul, .prose-blog ol { margin: 1.25rem 0; padding-left: 1.5rem; color: var(--muted); }
        .prose-blog li { margin: 0.4rem 0; }
        .prose-blog blockquote { border-left: 3px solid var(--electric); padding: 0.75rem 1.25rem; margin: 1.5rem 0; background: rgba(0,212,255,0.05); border-radius: 0 0.5rem 0.5rem 0; color: var(--white); font-style: italic; }
        .prose-blog pre { background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.25rem; overflow-x: auto; margin: 1.5rem 0; }
        .prose-blog code { font-family: 'Fira Code', 'Cascadia Code', monospace; font-size: 0.88rem; color: var(--electric); }
        .prose-blog pre code { color: var(--white); }
        .prose-blog img { border-radius: 0.75rem; width: 100%; margin: 1.5rem 0; }
        .prose-blog hr { border: none; border-top: 1px solid var(--border); margin: 2.5rem 0; }
      `}</style>
    </div>
  );
}
