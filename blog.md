# PRIM AI Blog Module - Complete Feature & Function Reference

**Project:** PRIM AI Institute  
**Developer:** Mouryrajsinh Jadeja  
**Last Updated:** 15 June 2026  
**Stack:** NestJS 10 · Prisma 5 · PostgreSQL 16 · React 19 · TypeScript 5 · Tailwind v4 · TipTap 3

---

## TABLE OF CONTENTS

1. [Database Schema](#1-database-schema)
2. [Backend API - Public Routes](#2-backend-api--public-routes)
3. [Backend API - Admin Routes](#3-backend-api--admin-routes)
4. [Media Upload Module](#4-media-upload-module)
5. [Public Blog Listing Page `/blog`](#5-public-blog-listing-page-blog)
6. [Public Blog Post Page `/blog/:slug`](#6-public-blog-post-page-blogslug)
7. [Admin Blog Posts List `/admin/blog`](#7-admin-blog-posts-list-adminblog)
8. [Admin Blog Post Editor `/admin/blog/new` · `/admin/blog/:id/edit`](#8-admin-blog-post-editor)
9. [Shared Components](#9-shared-components)
10. [Security & Sanitization](#10-security--sanitization)
11. [Design System Rules Applied](#11-design-system-rules-applied)
12. [Data Flow Diagrams](#12-data-flow-diagrams)
13. [File Index](#13-file-index)
14. [Pre-Launch Checklist](#14-pre-launch-checklist)

---

## 1. DATABASE SCHEMA

### Models

| Model | Table | Purpose |
|---|---|---|
| `BlogPost` | `blog_posts` | Core content entity |
| `BlogCategory` | `blog_categories` | Taxonomy (one post ➞ one category) |
| `BlogTag` | `blog_tags` | Labels (one post ➞ many tags via join table) |
| `BlogAuthor` | `blog_authors` | Named bylines (separate from Admin accounts) |
| `BlogPostTag` | `blog_post_tags` | Join table for post↔tag many-to-many |

### `BlogPost` Fields

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(cuid())` | CUID, not UUID - faster generation, URL-safe |
| `title` | `String` | Min 5, max 200 chars (validated in DTO) |
| `slug` | `String @unique` | URL segment e.g. `what-is-ai`, auto-generated from title |
| `excerpt` | `String` | Max 300 chars, shown on listing cards |
| `content` | `String @db.Text` | Raw TipTap HTML, unlimited length |
| `coverImageUrl` | `String?` | WebP CDN URL from DO Spaces |
| `status` | `BlogStatus` | `DRAFT` or `PUBLISHED` |
| `showAuthor` | `Boolean @default(true)` | Per-post toggle - hides author everywhere when false |
| `readTimeMin` | `Int @default(0)` | Computed at save time (words ÷ 200, min 1) |
| `categoryId` | `String` | FK ➞ BlogCategory |
| `authorId` | `String` | FK ➞ BlogAuthor |
| `publishedAt` | `DateTime?` | Set when status changes to PUBLISHED |
| `createdAt` | `DateTime @default(now())` | Immutable |
| `updatedAt` | `DateTime @updatedAt` | Auto-updated by Prisma |

### `BlogAuthor` Fields

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(cuid())` | - |
| `name` | `String` | Min 2, max 100 chars |
| `designation` | `String?` | e.g. "Lead Instructor, PRIM AI" - shown below name |
| `bio` | `String?` | Max 500 chars, shown in AuthorBio card |
| `avatarUrl` | `String?` | WebP CDN URL, 200×200px avatar variant |

### Enum

```prisma
enum BlogStatus { DRAFT  PUBLISHED }
```

### Key Design Decisions

- **`content @db.Text`** - TipTap HTML exceeds varchar(255) easily. `TEXT` = unlimited in PostgreSQL.
- **`showAuthor @default(true)`** - Migration is non-breaking: all existing posts keep showing author by default.
- **`readTimeMin` stored, not computed** - Listing page shows read time without parsing HTML on every request.
- **`BlogAuthor` ≠ `Admin`** - Authors are bylines (could be guest experts). Admins are dashboard users. Never conflate them.
- **`BlogPostTag` join table** - Enables indexed `WHERE tag.slug = X` queries at scale. JSON arrays can't be indexed.
- **`publishedAt` ≠ `status`** - Status = visibility. publishedAt = the recorded moment it went live. Two separate concepts.

---

## 2. BACKEND API - PUBLIC ROUTES

All public routes are under `/api/blog`. No JWT required.

| Method | Route | Returns | Notes |
|---|---|---|---|
| `GET` | `/api/blog` | Paginated `BlogPost[]` | Supports `?page`, `?limit`, `?search`, `?category` |
| `GET` | `/api/blog/:slug` | Single `BlogPost` with `content` | Only `PUBLISHED` posts |
| `GET` | `/api/blog/categories` | `BlogCategory[]` with `_count.posts` | Post count per category |
| `GET` | `/api/blog/tags` | `BlogTag[]` | All tags |
| `GET` | `/api/blog/authors` | `BlogAuthor[]` with all fields incl. `designation` | All authors |

### Listing Query Features
- **`search`** - `ILIKE %term%` on `title` AND `excerpt` (both fields, `OR` condition)
- **`category`** - filters by `category.slug` (not ID, URL-friendly)
- **Pagination** - `$transaction([findMany, count])` ensures consistent total across concurrent writes
- **Status filter** - always `WHERE status = PUBLISHED` on public routes
- **`POST_SELECT` constant** - shared select object used by every query; includes `showAuthor` so it's always returned

---

## 3. BACKEND API - ADMIN ROUTES

All admin routes are under `/api/admin/blog`. Bearer JWT required.

### Posts

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/blog` | Paginated list (all statuses, search, status filter) |
| `GET` | `/api/admin/blog/:id` | Single post by ID (not slug) |
| `POST` | `/api/admin/blog` | Create post |
| `PATCH` | `/api/admin/blog/:id` | Update post (partial - via `PartialType`) |
| `DELETE` | `/api/admin/blog/:id` | Delete post + cascades tags via `onDelete: Cascade` |

### Categories

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/blog/categories` | All categories |
| `POST` | `/api/admin/blog/categories` | Create category |
| `DELETE` | `/api/admin/blog/categories/:id` | Delete category |

### Tags

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/blog/tags` | All tags |
| `POST` | `/api/admin/blog/tags` | Create tag |
| `DELETE` | `/api/admin/blog/tags/:id` | Delete tag |

### Authors

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/blog/authors` | All authors (incl. designation, bio, avatarUrl) |
| `POST` | `/api/admin/blog/authors` | Create author |
| `PATCH` | `/api/admin/blog/authors/:id` | Update author (name / designation / bio / avatarUrl) |
| `DELETE` | `/api/admin/blog/authors/:id` | Delete author |

### Key Backend Logic

- **`flattenTags(post)`** - Strips the `{ tag: { ... } }` join-table nesting to `{ id, name, slug }` before returning to client
- **`calcReadTime(html)`** - Strips all HTML tags with regex, splits on whitespace, divides word count by 200, rounds up, minimum 1
- **Route order** - Fixed paths (`/categories`, `/tags`, `/authors`) registered before `/:id` to prevent NestJS swallowing them as ID params
- **`showAuthor` in `POST_SELECT`** - Every query (listing, single, admin) returns this field; no separate query needed

---

## 4. MEDIA UPLOAD MODULE

**Endpoint:** `POST /api/admin/media/upload?variant=cover|content|avatar`

### Three Upload Variants

| Variant | Output Size | Crop | Use |
|---|---|---|---|
| `cover` | 1600×900px | `cover` (smart crop) | Post cover images |
| `content` | 1200px wide | `inside` (aspect preserved) | Inline article images (future) |
| `avatar` | 200×200px | `cover` (face crop) | Author profile photos |

### Pipeline

```
Browser File ➞ multer memoryStorage() (RAM Buffer)
➞ sharp WebP conversion + resize
➞ AWS SDK PutObjectCommand ➞ DigitalOcean Spaces CDN
➞ Returns { url, originalSizeKb, convertedSizeKb, width, height }
```

### Key Decisions

- **`memoryStorage()`** - No temp disk writes. RAM ➞ sharp ➞ S3 in one pass. Critical for Railway containers with no persistent disk.
- **WebP** - 25–35% smaller than JPEG at equal quality. Improves LCP score (Core Web Vitals).
- **`CacheControl: 'public, max-age=31536000, immutable'`** - Files never change (unique timestamped filenames). CDN caches forever.
- **8 MB limit** - Protects against accidental large uploads before they consume memory.
- **DO Spaces = S3-compatible** - Same `@aws-sdk/client-s3` SDK, different `endpoint` URL. Zero vendor lock-in.

---

## 5. PUBLIC BLOG LISTING PAGE `/blog`

### Features

- **Hero section** - Section tag, gradient H1 ("Insights on AI & the Future"), subtitle, canonical `SearchInput` component
- **Live search** - `SearchInput` with `onChange` ➞ `setSearch` ➞ re-fetches API (no submit button, no debounce state split)
- **Category filter pills** - "All" + one pill per category with live post count badge; clicking toggles active category; active pill gets category's own color
- **Responsive post grid** - 1 col (mobile) ➞ 2 col (tablet) ➞ 3 col (desktop), 9 posts per page
- **Skeleton loading** - Pulse-animated skeleton cards that match PostCard dimensions exactly (no layout jump)
- **Pagination** - Numbered page buttons + Prev/Next chevrons; "Showing X–Y of Z articles" count line
- **Empty states** - Two distinct states: "No articles found" (no posts exist) vs "Nothing matched 'X'" (search returned empty), with a "Clear search" button on the search empty state
- **`showAuthor` on PostCard** - When `false`: empty `<div />` spacer holds left slot so `justify-between` keeps read-time right-aligned without layout shift

### PostCard Anatomy

```
┌─────────────────────────────┐
│  Cover image (16:9)         │  ← hover: scale-105
│  [Category badge top-left]  │
├─────────────────────────────┤
│  Title (2-line clamp)       │
│  Excerpt (3-line clamp)     │
│  ─────────────────────────  │
│  [Avatar + Name]  [⏱ X min] │  ← hidden when showAuthor=false
└─────────────────────────────┘
```

---

## 6. PUBLIC BLOG POST PAGE `/blog/:slug`

### Layout

```
Fixed Navbar
Reading Progress Bar (fixed, top-16, cyan➞orange gradient)
─────────────────────────────────────────────────────
Cover Hero (full-bleed image + dark overlay gradient)
  Category badge · Tags
  H1 Title
  Excerpt
  [Author pill] · Date · ⏱ read time   ← Author pill hidden when showAuthor=false
─────────────────────────────────────────────────────
flex gap-8
│  Article (flex-1)              │  Sidebar (w-72, hidden on mobile)  │
│  .prose-blog HTML content      │  ┌─────────────────────────────┐   │
│                                │  │  ON THIS PAGE               │   │
│  ───────────────────────────── │  │  TOC items (H2/H3)          │   │
│  [Share Research]  [AuthorBio] │  │  sticky top-24              │   │
│  (AuthorBio hidden if toggle)  │  │  auto-scroll to active item │   │
└────────────────────────────────┘  └─────────────────────────────┘
─────────────────────────────────────────────────────
Keep Reading (full-width, 3-col grid, outside 70/30)
```

### Reading Progress Bar

- Fixed under Navbar at `top-16` (64px = Navbar height)
- `height: 2px`, navy background, cyan➞orange gradient fill
- `{ passive: true }` on scroll listener - browser can optimize, never blocks scroll
- `Math.min(100, ...)` caps at 100% for short pages

### Table of Contents (TOC)

**Two-pass build system:**

- **Pass 1 - `buildToc(html)`** ➞ `TocItem[]` for sidebar links
  - `DOMParser.parseFromString()` ➞ `querySelectorAll('h2, h3')`
  - Extracts `textContent` (strips inner tags like `<strong>`) and assigns `heading-N` IDs
  - Returns `[{ id, text, level }]`

- **Pass 2 - `injectIds(html)`** ➞ string for `dangerouslySetInnerHTML`
  - Regex: `/<(h[23])([ >])/g` - matches `<h2>` and `<h3>` only
  - Captures `rest` (space or `>`) verbatim so existing attributes are preserved
  - Inserts `id="heading-N"` at the same sequential index as `buildToc`
  - **Why two passes:** `buildToc` needs a parsed DOM; `injectIds` needs a string. You can't `dangerouslySetInnerHTML` a DOM, and you can't `querySelectorAll` a raw string.

**IntersectionObserver:**
- Observes all `[id^="heading-"]` elements
- `rootMargin: '-80px 0px -60% 0px'` - top offset for Navbar; bottom offset to narrow the "active zone" to the reading area only
- Active heading ➞ `setActiveId(id)` ➞ TOC sidebar highlights that item

**TOC Sidebar UX:**
- `sticky top-24` on the card
- `maxHeight: calc(100vh - 8rem)` with `overflow-y: auto` - scrollable if many headings
- Active item auto-scrolls into view via `navRef` + `el.scrollIntoView({ block: 'nearest' })`
- **Growing bar indicator** - `.toc-bar` expands from `height: 0` to `height: 1rem` on hover/active via CSS transition; `.toc-text` changes color
- H3 items indented `0.75rem` relative to H2

**Why `position: sticky` requires two CSS fixes:**
- `overflow-x: hidden` on `<body>` makes body a scroll container ➞ sticky scrolls with content instead of viewport. Fix: move to `<html>`.
- `align-items: flex-start` shrinks aside to card height ➞ sticky has no travel range. Fix: remove `items-start` from flex container.

### Share Research Section

Three icon-only circular buttons (`w-10 h-10 rounded-full`):

| Button | Icon | Action |
|---|---|---|
| X / Twitter | Custom X logo SVG | Opens `twitter.com/intent/tweet?text=...&url=...` |
| LinkedIn | Official LinkedIn SVG path | Opens `linkedin.com/sharing/share-offsite/?url=...` |
| Copy Link | `LinkIcon` (Lucide) | `navigator.clipboard.writeText(url)` ➞ 2s "copied" state |

- `.share-btn` CSS class - hover lifts `translateY(-4px)` + electric glow
- Lucide doesn't export `Linkedin` or `Twitter` in the installed version ➞ inline SVG paths used

### Author Bio Card

- Shown only when `post.showAuthor === true`
- `w-16 h-16` avatar with `border: 2px solid rgba(0,212,255,0.2)` electric ring, or initials fallback
- Author name in `--font-head`
- Designation in electric cyan, uppercase, letterSpacing 1.5px
- Bio clamped to 3 lines (`line-clamp-3`)
- Glass card background (`var(--card)` + border + inset shadow)
- `maxWidth: 28rem` - doesn't stretch full width on wide screens

### Hero Meta Row (Author Pill)

- `{post.showAuthor && <><pill/><dot/></>}` - author pill + trailing separator dot are a single React fragment; when hidden, neither renders, leaving no orphaned dots
- Author pill: `var(--card)` background + `var(--border)` border, `rounded-full`, `pl-1 pr-4 py-1`
- Date and read time are **always visible** regardless of `showAuthor`

### Keep Reading Section

- Full-width section **outside** the 70/30 flex grid (below the grid wrapper)
- Fetches latest 4 posts with no category filter (guarantees 3 cards always populate)
- Filters out the current post by slug
- `KeepReadingCard`: 192px cover image with `linear-gradient(to top, navy, transparent)` overlay, category badge, date, title
- Hover: `translateY(-8px)` lift + cyan box-shadow + title color change + image `scale(1.05)`

### Prose Styles (`.prose-blog`)

- `text-align: justify; text-justify: inter-word; hyphens: auto` - baseline for all `<p>` elements
- H2: 1.6rem, Space Grotesk, white
- H3: 1.25rem, Space Grotesk, white
- `<p>`: muted color, 1.8 line-height, justified
- `<blockquote>`: electric left border, muted background
- `<pre>/<code>`: glass background, Fira Code font, electric color
- `<a>`: electric color, underlined
- `<img>`: rounded-xl, full-width

---

## 7. ADMIN BLOG POSTS LIST `/admin/blog`

### Features

- **Stats line** - "X total posts" below heading
- **`SearchInput`** - canonical component, form + "Search" submit button beside it; `inputValue`/`search` split (no live search - paginated admin list)
- **Status filter** - `<select>` dropdown: All / Published / Draft
- **Post table** rows: thumbnail (48×48 rounded), title + slug, category colored badge, status badge (green Published / yellow Draft), read time, published date, actions
- **Actions per row** - Edit (pencil, ➞ `/admin/blog/:id/edit`), View live (external link, opens `/blog/:slug` in new tab, only shown for Published), Delete (trash, with `window.confirm`)
- **`deletingId` state** - tracks which specific row is being deleted; disables only that row's button
- **Pagination** - numbered buttons, re-fetches on page change

---

## 8. ADMIN BLOG POST EDITOR

### Two Routes

- `/admin/blog/new` - `isNew = true`, creates on first save
- `/admin/blog/:id/edit` - `isNew = false`, PATCH on save

### Main Edit Area (left column, scrollable)

| Field | Implementation |
|---|---|
| **Title** | Borderless `<input>`, 3xl font, auto-generates slug while `slugManual = false` |
| **Slug** | `/blog/` prefix label + editable input; `slugManual` flag stops auto-gen once touched |
| **Excerpt** | `<textarea>` 3 rows, 300 char max with live counter (goes orange at limit) |
| **Content** | TipTap editor (see toolbar below) |
| **Cover Image** | `ImageUploadDropzone` variant="cover" - drag-drop or click-to-upload |

### TipTap Toolbar - All Buttons

**Formatting group:**
| Button | Extension | Icon |
|---|---|---|
| Bold | StarterKit | `Bold` |
| Italic | StarterKit | `Italic` |
| Underline | `@tiptap/extension-underline` | `Underline` |
| Strikethrough | StarterKit | `Strikethrough` |

**Headings group:**
| Button | Extension | Icon |
|---|---|---|
| H2 | StarterKit | `Heading2` |
| H3 | StarterKit | `Heading3` |

**Blocks group:**
| Button | Extension | Icon |
|---|---|---|
| Bullet List | StarterKit | `List` |
| Ordered List | StarterKit | `ListOrdered` |
| Blockquote | StarterKit | `Quote` |
| Code Block | StarterKit | `Code2` |
| Horizontal Rule | StarterKit | `Minus` |
| Link | `@tiptap/extension-link` | `Link` |

**Text Alignment group:**
| Button | Extension | Icon | Writes inline style? |
|---|---|---|---|
| Align Left | `@tiptap/extension-text-align` | `AlignLeft` | `style="text-align: left;"` |
| Align Center | `@tiptap/extension-text-align` | `AlignCenter` | `style="text-align: center;"` |
| Align Right | `@tiptap/extension-text-align` | `AlignRight` | `style="text-align: right;"` |
| Justify | `@tiptap/extension-text-align` | `AlignJustify` | No style (default = justify) |

**TextAlign configuration:**
```typescript
TextAlign.configure({
  types: ['paragraph'],           // H2/H3/lists/blockquote are unaffected
  alignments: ['left', 'center', 'right', 'justify'],
  defaultAlignment: 'justify',   // no inline style on default paragraphs
})
```

### Publishing Sidebar (right column, fixed)

| Control | Type | Behaviour |
|---|---|---|
| **Status radio** | `DRAFT` / `PUBLISHED` | Controls visibility on public site |
| **Show Author Details** | `ToggleSwitch` | `showAuthor` field - hides author everywhere when off |
| **Read time estimate** | Display only | `~N min read`, computed live from word count |
| **Publish Now** | `btn-primary` | Forces status to PUBLISHED regardless of radio, saves |
| **Save Draft** | `btn-outline` | Saves with current status |
| **View live post** | Subtle link | Only shown when `status === PUBLISHED` and not new |
| **Saved indicator** | Text | "✓ Saved successfully" appears 2.5s after save |

### Organization Sidebar Panel

| Control | Behaviour |
|---|---|
| **Category select** | Dropdown of all categories; required to save |
| **+ Category (QuickAdd)** | Inline create ➞ new category selected immediately |
| **Author select** | Dropdown of all authors; required to save |
| **+ Author (QuickAdd)** | Inline create ➞ new author selected immediately |
| **Author Details panel** | Appears when any author is selected |
| - Author photo | `ImageUploadDropzone` variant="avatar" - auto-saves on upload via `adminUpdateAuthor` |
| - Designation input | `defaultValue` from selected author; `onBlur` auto-saves |
| **Tags toggle chips** | Click to toggle; gold styling when active |
| **+ Tag (QuickAdd)** | Inline create ➞ auto-selected |

### Key Editor Logic

- **`slugManual` flag** - typing in title ➞ auto-updates slug via `toSlug()`. Once user edits slug field directly, `slugManual = true` and auto-gen stops permanently for that session.
- **`toSlug()`** - lowercase ➞ strip special chars ➞ spaces to hyphens ➞ collapse hyphens ➞ max 100 chars
- **`isValid` gate** - `title ≥ 5 chars && slug ≥ 3 chars && categoryId && authorId` - both save buttons disabled when false
- **`handleSave(publishNow)`** - single function for both buttons; `publishNow = true` overrides status to PUBLISHED
- **`useCallback` on `loadRefs`** - memoized with `[]` deps; without this, the `useEffect` dependency would cause an infinite re-render loop
- **`key={desig-${authorId}}`** on designation input - forces React to remount (reset `defaultValue`) when a different author is selected
- **Author detail auto-save** - avatar upload and designation blur both call `adminUpdateAuthor()` immediately; local `authors` state is patched so the panel stays in sync without re-fetching

---

## 9. SHARED COMPONENTS

### `ImageUploadDropzone.tsx`

- **Variants:** `cover` (16:9 preview) · `content` · `avatar` (square preview with `rounded-full`)
- **State machine:** `idle` ➞ `dragging` ➞ `uploading` ➞ `success` ➞ replace/remove overlay on hover
- **Drag events:** `onDragOver` calls `e.preventDefault()` (required - tells browser "I handle this drop")
- **Hidden `<input type="file">`** triggered via `inputRef.current?.click()`
- **`e.target.value = ''`** after each upload - resets so same file can be re-selected
- **`Accept`** - `image/*` only
- **On upload** - calls `uploadMedia(file, variant)` ➞ `POST /api/admin/media/upload?variant=X`
- **Remove** - calls `onChange(undefined)` to clear; parent decides what to do with `undefined`

### `ToggleSwitch.tsx`

- Props: `{ checked, onChange, label }`
- `role="switch"` + `aria-checked` - ARIA-accessible
- Knob: `position: absolute`, `translateX(20px)` when on, `translateX(0)` when off
- Track: `var(--electric)` when on, `rgba(255,255,255,0.1)` when off
- Uses CSS `style` prop for colors (immune to Tailwind/globals.css specificity clashes)

### `SearchInput.tsx` (`src/components/ui/`)

- Props: `{ value, onChange, placeholder, className }`
- `Search` icon at `left-5`, `top-1/2 -translate-y-1/2`, `pointer-events-none` (clicks pass through to input)
- **Why `style` for padding** - `globals.css` sets `input[type="text"] { padding: 0.75rem 1rem }` with specificity `[0,1,1]` (attribute + element selector) which beats Tailwind's `pl-14` class at `[0,1,0]`. Inline `style={{ paddingLeft: '3.5rem' }}` always wins at specificity `[1,0,0]`.
- `borderRadius: 9999px`, `background: var(--card)`, `boxShadow: inset 1px 1px 0 rgba(255,255,255,0.05)` - all via inline style for the same reason
- `className` prop goes on the wrapper `<div>`, not the `<input>` - callers use it for `max-w-2xl`, `max-w-xs`, etc.

**Where used:**
- `BlogListing.tsx` - `max-w-2xl`, live search
- `admin/BlogPosts.tsx` - inside form with submit button
- `admin/Bookings.tsx` - inside form, `sm:max-w-xs` wrapper
- `admin/Enquiries.tsx` - inside form, `sm:max-w-xs` wrapper

---

## 10. SECURITY & SANITIZATION

### `src/lib/sanitize.ts`

**Why:** TipTap content is stored as raw HTML in PostgreSQL and rendered via `dangerouslySetInnerHTML`. Without sanitization, any HTML injected into the DB (by a compromised admin account or direct DB access) renders in the browser.

**DOMPurify configuration:**

```typescript
ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's',
               'h2', 'h3', 'ul', 'ol', 'li',
               'blockquote', 'pre', 'code',
               'a', 'img', 'hr']

ALLOWED_ATTR: ['href', 'target', 'rel',  // links
               'src', 'alt',              // images
               'style',                   // text-align only (see hook)
               'id']                      // heading anchors for TOC
```

**`uponSanitizeAttribute` hook (security control):**

```typescript
DOMPurify.addHook('uponSanitizeAttribute', (_node, data) => {
  if (data.attrName === 'style') {
    const match = data.attrValue.match(
      /^text-align:\s*(left|right|center|justify);?\s*$/
    );
    if (!match) {
      data.keepAttr = false;  // STRIP - anything not matching
    } else {
      data.attrValue = `text-align: ${match[1]};`;  // normalize
    }
  }
});
```

**What this blocks:**
- `style="color: red"` ➞ stripped
- `style="background: url(https://evil.com)"` ➞ stripped (CSS injection / data exfil)
- `style="text-align: left; color: red"` ➞ stripped (compound - regex anchored `^...$`)
- `style="text-align: LEFT"` ➞ stripped (regex is case-sensitive - TipTap always writes lowercase)
- `style="text-align: center;"` ➞ **kept**, normalized to `text-align: center;`

**Why `id` is allowed:** `injectIds()` writes `id="heading-N"` on h2/h3 for TOC anchor links. Without `id` in the allowlist, DOMPurify strips these IDs and TOC scroll navigation breaks.

**Application point:** `sanitizeHtml(injectIds(post.content))` - IDs are injected first (regex string op), then the combined string is sanitized. Order matters: DOMPurify sees the injected IDs and keeps them because `id` is in `ALLOWED_ATTR`.

---

## 11. DESIGN SYSTEM RULES APPLIED

| Rule | Implementation |
|---|---|
| Background always `var(--navy)` | Every page wrapper has `style={{ background: 'var(--navy)' }}` |
| All cards use `.glass-card` | PostCard, AuthorBio, TOC, KeepReadingCard, editor panels |
| CTAs use `.btn-primary` | "Publish Now", "Book Free Demo" in hero |
| `.btn-electric` | "Search" in admin BlogPosts filter bar |
| `.btn-outline` | "Save Draft", "Export CSV" |
| No UI libraries | Zero shadcn/MUI/Radix - all components custom |
| TypeScript strict, no `any` | Zero `any` types in all 20+ files |
| Mobile-first responsive | All grids use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Inline styles for CSS var overrides | Wherever Tailwind can't win specificity battles |
| 44×44px min touch targets | All action buttons have `minWidth/minHeight: 36–44px` |

---

## 12. DATA FLOW DIAGRAMS

### Blog Post Save Flow

```
Admin types in TipTap editor
        ↓
editor.getHTML() ➞ raw HTML string
TextAlign extension writes style="text-align: X" on <p> if non-default
        ↓
handleSave() ➞ POST/PATCH /api/admin/blog
        ↓
Backend: calcReadTime(html) ➞ stores readTimeMin
Backend: upserts BlogPostTag join records
        ↓
Stored in PostgreSQL: content TEXT (raw HTML)
```

### Blog Post Render Flow

```
GET /api/blog/:slug
        ↓
{ content, showAuthor, author, ... }
        ↓
injectIds(content) ➞ adds id="heading-N" to h2/h3
        ↓
sanitizeHtml(...)  ➞ DOMPurify strips all but allowed tags/attrs
                     hook normalizes style to text-align only
        ↓
dangerouslySetInnerHTML={{ __html: processedContent }}
        ↓
.prose-blog p { text-align: justify } ← CSS baseline
<p style="text-align: center"> ← inline style overrides baseline
        ↓
IntersectionObserver ➞ active heading ➞ TOC highlight
```

### showAuthor Toggle Flow

```
Admin: ToggleSwitch ➞ setShowAuthor(false) ➞ save payload
        ↓
PATCH /api/admin/blog/:id { showAuthor: false }
        ↓
PostgreSQL: blog_posts.show_author = false
        ↓
GET /api/blog (listing) ➞ showAuthor: false in response
        ↓
PostCard:  showAuthor ? <avatar+name> : <div />     (listing)
BlogPost:  showAuthor ? <AuthorPill>  : nothing     (hero meta)
BlogPost:  showAuthor ? <AuthorBio>   : null        (bottom row)
```

---

## 13. FILE INDEX

### Backend

```
backend/prisma/schema.prisma
  └─ BlogPost, BlogCategory, BlogTag, BlogAuthor, BlogPostTag models
  └─ BlogStatus enum (DRAFT | PUBLISHED)
  └─ showAuthor Boolean @default(true) on BlogPost
  └─ designation String? on BlogAuthor

backend/prisma/migrations/
  └─ 20260615070745_add_blog_module/         ← initial 5 models
  └─ 20260615111154_add_author_designation/  ← designation field
  └─ 20260615113857_add_show_author_toggle/  ← showAuthor field

backend/prisma/seed.ts
  └─ Seeds PRIM AI Team author with designation + bio
  └─ Seeds 3 blog posts (idempotent - guarded by findUnique on slug)

backend/src/media/
  └─ media.service.ts   ← sharp WebP pipeline + S3 PutObject
  └─ media.controller.ts ← POST /admin/media/upload?variant=
  └─ media.module.ts

backend/src/blog/
  └─ dto/create-blog-post.dto.ts   ← title, slug, excerpt, content, showAuthor, etc.
  └─ dto/update-blog-post.dto.ts   ← PartialType(CreateBlogPostDto)
  └─ dto/create-author.dto.ts      ← name, designation, bio, avatarUrl
  └─ dto/create-category.dto.ts
  └─ dto/create-tag.dto.ts
  └─ blog.service.ts               ← all CRUD, flattenTags, calcReadTime
  └─ blog.controller.ts            ← public + admin routes
  └─ blog.module.ts
```

### Frontend

```
frontend/src/api/blog.ts
  └─ BlogPost interface (incl. showAuthor: boolean)
  └─ BlogAuthor interface (incl. designation?: string)
  └─ CreateBlogPostPayload (incl. showAuthor?: boolean)
  └─ fetchPublicPosts, fetchPostBySlug, fetchPublicCategories
  └─ adminFetchPosts, adminCreatePost, adminUpdatePost, adminDeletePost
  └─ adminFetchAuthors, adminCreateAuthor, adminUpdateAuthor
  └─ uploadMedia(file, variant)

frontend/src/lib/sanitize.ts
  └─ DOMPurify with uponSanitizeAttribute hook
  └─ ALLOWED_TAGS whitelist
  └─ ALLOWED_ATTR: href, target, rel, src, alt, style, id
  └─ sanitizeHtml(dirty: string): string

frontend/src/components/ui/
  └─ SearchInput.tsx  ← canonical search input, inline-style padding

frontend/src/components/admin/
  └─ ImageUploadDropzone.tsx  ← drag-drop, 3 variants, WebP upload
  └─ ToggleSwitch.tsx         ← accessible on/off toggle
  └─ Sidebar.tsx              ← Blog Posts nav link
  └─ LeadsTable.tsx
  └─ StatCard.tsx

frontend/src/pages/
  └─ BlogListing.tsx          ← /blog - listing, search, filter, pagination
  └─ BlogPost.tsx             ← /blog/:slug - full post, TOC, share, author

frontend/src/pages/admin/
  └─ BlogPosts.tsx            ← /admin/blog - list table
  └─ BlogPostEditor.tsx       ← /admin/blog/new + /admin/blog/:id/edit

frontend/src/styles/globals.css
  └─ html { overflow-x: hidden }  ← moved from body (fixes sticky TOC)
  └─ body { position: relative }  ← replaces overflow-x: hidden on body
```

---

## 14. PRE-LAUNCH CHECKLIST

### Railway Environment Variables (Backend)

```
DO_SPACES_KEY=<your key>
DO_SPACES_SECRET=<your secret>
DO_SPACES_ENDPOINT=https://blr1.digitaloceanspaces.com
DO_SPACES_BUCKET=primai-media
DO_SPACES_CDN_URL=https://primai-media.blr1.cdn.digitaloceanspaces.com
DATABASE_URL=postgresql://... (Neon production URL)
JWT_SECRET=<long random string>
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Production Database

```bash
npx prisma migrate deploy   # apply all 3 blog migrations to Neon
npx prisma db seed          # seed PRIM AI Team author + 3 sample posts
```

### DigitalOcean Spaces

- [ ] Create Space named `primai-media`, region `blr1`, public read access
- [ ] Enable CDN for the Space (activates the CDN URL)
- [ ] Verify CDN URL matches `DO_SPACES_CDN_URL` env var

### Content Minimum Before Launch

- [ ] At least 1 `BlogCategory` created via admin
- [ ] At least 1 `BlogAuthor` created with photo + designation
- [ ] At least 3 `BlogPost` entries in PUBLISHED status
- [ ] Cover images uploaded for all published posts

### Functional Verification

- [ ] `/blog` loads, search filters, category pills work
- [ ] `/blog/:slug` shows TOC (requires H2/H3 in content), reading bar, share buttons
- [ ] `showAuthor` toggle hides author on all three locations (hero pill, hero bottom, listing card)
- [ ] Text alignment (center/right paragraphs) renders correctly on published page
- [ ] DOMPurify strips `style="color:red"` - test via DevTools on any published post content
- [ ] Author photo upload in editor auto-saves and appears on published post
- [ ] Image upload to DO Spaces returns CDN URL (not localhost URL)
