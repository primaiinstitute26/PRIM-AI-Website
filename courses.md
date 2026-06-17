# Courses Module -Complete Expert Reference

> This document is the single source of truth for the Courses Module in PRIM AI Institute.
> It covers database schema, backend API, frontend pages, admin editor, design system, and all key patterns.
> Any AI assistant working on this project should read this before touching any courses-related file.

---

## 1. Overview

The Courses Module is a **content-driven, admin-editable system** for displaying the three PRIM AI course pages. It is NOT a simple static data file -all content lives in PostgreSQL and is served via a NestJS API.

### The Three Courses

| Slug | Level Enum | Name | Accent Color |
|------|-----------|------|--------------|
| `l1` | `L1_FOUNDATION` | AI Foundation Program | `var(--electric)` `#00D4FF` |
| `l2a` | `L2A_GENERALIST` | AI Generalist Program | `var(--orange)` `#FF6B2B` |
| `l2b` | `L2B_DEVELOPER` | AI Developer Program | `#a78bfa` (purple) |

### Content Architecture

Each course (`AiCourse`) is a **parent record** with **8 child relation tables** that hold all page content. The parent holds only scalar fields (hero text, duration, CTA labels, etc.). Everything else is in child tables.

---

## 2. Database Schema

### Migration
Migration name: `20260616101957_add_courses_module`

### Enum

```prisma
enum CourseLevel {
  L1_FOUNDATION
  L2A_GENERALIST
  L2B_DEVELOPER
}
```

> **CRITICAL:** An `enum Course` already existed in the schema for bookings/enquiries. The course content model is named `AiCourse` (not `Course`) to avoid a Prisma naming conflict. The table is `@@map("courses")`.

### Parent Model: `AiCourse`

```prisma
model AiCourse {
  id               String                  @id @default(cuid())
  level            CourseLevel             @unique           // slug lookup uses this
  badgeText        String                                    // e.g. "Level 1 - AI Foundation"
  title            String                                    // e.g. "AI Foundation Program"
  tagline          String                                    // one-line subtitle
  heroImageUrl     String?                                   // optional hero image
  duration         String                                    // e.g. "6-8 Weeks"
  mentorship       String                                    // e.g. "1-to-1 Personal"
  trainingDays     String                                    // e.g. "Monday to Friday"
  language         String                                    // e.g. "Hindi & Gujarati"
  mode             String                                    // e.g. "Offline · Hands-on"
  certificate      String                                    // e.g. "ISO 9001:2015 Certified"
  placementInfo    String                                    // e.g. "Yes - 1500+ Partners"
  levelLabel       String                                    // e.g. "Beginner - No experience needed"
  ctaDemoText      String   @default("Book Free Demo ➞")    // primary CTA button label
  ctaWaText        String   @default("💬 Chat on WhatsApp") // secondary CTA label
  ctaDownloadText  String   @default("Download Syllabus")   // download CTA label
  displayOrder     Int      @default(0)                     // sort order on /courses listing

  // Relations (all cascade delete)
  whoItems         CourseWhoItem[]
  modules          CourseModule[]
  tools            CourseTool[]
  outcomes         CourseOutcome[]
  beforeAfter      CourseBeforeAfter?      // optional 1-to-1
  eligibilityItems CourseEligibilityItem[]
  faqs             CourseFAQ[]
  testimonials     CourseTestimonial[]

  updatedAt        DateTime @updatedAt
  createdAt        DateTime @default(now())

  @@map("courses")
}
```

### Child Models

```prisma
model CourseWhoItem {            // @@map("course_who_items")
  id       String   @id @default(cuid())
  courseId String
  course   AiCourse @relation(... onDelete: Cascade)
  emoji    String
  title    String
  desc     String
  order    Int      @default(0)
}

model CourseModule {             // @@map("course_modules")
  id       String   @id @default(cuid())
  courseId String
  course   AiCourse @relation(... onDelete: Cascade)
  label    String   // e.g. "Module 1", "Week 1"
  title    String   // module heading
  topics   String[] // array of topic strings (PostgreSQL text[])
  order    Int      @default(0)
}

model CourseTool {               // @@map("course_tools")
  id       String   @id @default(cuid())
  courseId String
  course   AiCourse @relation(... onDelete: Cascade)
  emoji    String
  name     String
  category String   // used to GROUP tools for L2A/L2B display
  order    Int      @default(0)
}

model CourseOutcome {            // @@map("course_outcomes")
  id       String   @id @default(cuid())
  courseId String
  course   AiCourse @relation(... onDelete: Cascade)
  title    String
  desc     String
  order    Int      @default(0)
}

model CourseBeforeAfter {        // @@map("course_before_after") -1-to-1, unique courseId
  id          String   @id @default(cuid())
  courseId    String   @unique
  course      AiCourse @relation(... onDelete: Cascade)
  beforeItems String[] // array of "before" bullet strings
  afterItems  String[] // array of "after" bullet strings
}

model CourseEligibilityItem {   // @@map("course_eligibility_items")
  id       String   @id @default(cuid())
  courseId String
  course   AiCourse @relation(... onDelete: Cascade)
  text     String
  order    Int      @default(0)
}

model CourseFAQ {               // @@map("course_faqs")
  id       String   @id @default(cuid())
  courseId String
  course   AiCourse @relation(... onDelete: Cascade)
  question String
  answer   String
  order    Int      @default(0)
}

model CourseTestimonial {       // @@map("course_testimonials")
  id         String   @id @default(cuid())
  courseId   String
  course     AiCourse @relation(... onDelete: Cascade)
  initials   String   // e.g. "RS"
  name       String   // e.g. "Riya Sharma"
  meta       String   // e.g. "Class 10 · Ahmedabad"
  avatarGrad String   // CSS gradient string for avatar bg
  quote      String
  before     String   // short "before" label for transform row
  after      String   // short "after" label for transform row
  order      Int      @default(0)
}
```

---

## 3. Backend API

### Module Location
```
backend/src/courses/
  courses.module.ts      -@Module({ controllers, providers })
  courses.controller.ts  -@Controller() with no base prefix
  courses.service.ts     -business logic + Prisma calls
  dto/update-course.dto.ts
```

### Slug-to-Level Mapping (in service)

```typescript
const LEVEL_SLUG_MAP: Record<string, CourseLevel> = {
  l1:  CourseLevel.L1_FOUNDATION,
  l2a: CourseLevel.L2A_GENERALIST,
  l2b: CourseLevel.L2B_DEVELOPER,
};
```

### COURSE_INCLUDE constant (shared by all queries)

```typescript
const COURSE_INCLUDE = {
  whoItems:        { orderBy: { order: 'asc' as const } },
  modules:         { orderBy: { order: 'asc' as const } },
  tools:           { orderBy: { order: 'asc' as const } },
  outcomes:        { orderBy: { order: 'asc' as const } },
  beforeAfter:     true,
  eligibilityItems:{ orderBy: { order: 'asc' as const } },
  faqs:            { orderBy: { order: 'asc' as const } },
  testimonials:    { orderBy: { order: 'asc' as const } },
};
```

### Public API Routes (no auth)

| Method | Route | Controller Method | Description |
|--------|-------|-------------------|-------------|
| GET | `/api/courses` | `findAll()` | All 3 courses ordered by `displayOrder` |
| GET | `/api/courses/:slug` | `findOne(slug)` | Single course by slug (`l1`, `l2a`, `l2b`) |

### Admin API Routes (Bearer JWT required)

| Method | Route | Service Method | Update Pattern |
|--------|-------|----------------|----------------|
| GET | `/api/admin/courses/:slug` | `findBySlug()` | Read (same as public) |
| PATCH | `/api/admin/courses/:slug` | `updateHero()` | Direct Prisma `update` on scalar fields |
| PATCH | `/api/admin/courses/:slug/who-items` | `updateWhoItems()` | Delete-all + createMany |
| PATCH | `/api/admin/courses/:slug/modules` | `updateModules()` | Delete-all + createMany |
| PATCH | `/api/admin/courses/:slug/tools` | `updateTools()` | Delete-all + createMany |
| PATCH | `/api/admin/courses/:slug/outcomes` | `updateOutcomes()` | Delete-all + createMany |
| PATCH | `/api/admin/courses/:slug/before-after` | `updateBeforeAfter()` | `upsert` (1-to-1) |
| PATCH | `/api/admin/courses/:slug/eligibility` | `updateEligibility()` | Delete-all + createMany |
| PATCH | `/api/admin/courses/:slug/faqs` | `updateFaqs()` | Delete-all + createMany |
| PATCH | `/api/admin/courses/:slug/testimonials` | `updateTestimonials()` | Delete-all + createMany |

> **Pattern note:** All child relation updates use **delete-all then createMany** (not individual row updates). `beforeAfter` uses `upsert` because it is a 1-to-1 relation.
> All PATCH endpoints return the full `AiCourse` with all relations included (via `findBySlug()` at the end).

### DTOs (`update-course.dto.ts`)

```typescript
// Hero (scalar fields -all optional)
class UpdateCourseHeroDto {
  badgeText?, title?, tagline?, heroImageUrl?,
  duration?, mentorship?, trainingDays?,
  language?, mode?, certificate?, placementInfo?,
  levelLabel?, ctaDemoText?, ctaWaText?, ctaDownloadText?
}

// Collections -all use the same { items: ItemDto[] } wrapper
class UpdateWhoItemsDto    { items: WhoItemDto[]         }  // { emoji, title, desc, order }
class UpdateModulesDto     { items: ModuleDto[]           }  // { label, title, topics: string[], order }
class UpdateToolsDto       { items: ToolDto[]             }  // { emoji, name, category, order }
class UpdateOutcomesDto    { items: OutcomeDto[]          }  // { title, desc, order }
class UpdateEligibilityDto { items: EligibilityItemDto[]  }  // { text, order }
class UpdateFaqsDto        { items: FaqDto[]              }  // { question, answer, order }
class UpdateTestimonialsDto{ items: TestimonialDto[]      }  // { initials, name, meta, avatarGrad, quote, before, after, order }

// beforeAfter is NOT wrapped in { items: [] }
class UpdateBeforeAfterDto { beforeItems: string[]; afterItems: string[] }
```

---

## 4. Frontend Types (`src/types/index.ts`)

```typescript
export type CourseLevel = 'L1_FOUNDATION' | 'L2A_GENERALIST' | 'L2B_DEVELOPER';
export type CourseSlug  = 'l1' | 'l2a' | 'l2b';

export interface AiCourse {
  id: string;
  level: CourseLevel;
  badgeText: string;
  title: string;
  tagline: string;
  heroImageUrl: string | null;
  duration: string;
  mentorship: string;
  trainingDays: string;
  language: string;
  mode: string;
  certificate: string;
  placementInfo: string;
  levelLabel: string;
  ctaDemoText: string;
  ctaWaText: string;
  ctaDownloadText: string;
  displayOrder: number;
  whoItems: CourseWhoItem[];
  modules: CourseModule[];
  tools: CourseTool[];
  outcomes: CourseOutcome[];
  beforeAfter: CourseBeforeAfter | null;   // can be null if not seeded
  eligibilityItems: CourseEligibilityItem[];
  faqs: CourseFAQ[];
  testimonials: CourseTestimonial[];
  updatedAt: string;
  createdAt: string;
}

export interface CourseWhoItem   { id, courseId, emoji, title, desc, order }
export interface CourseModule    { id, courseId, label, title, topics: string[], order }
export interface CourseTool      { id, courseId, emoji, name, category, order }
export interface CourseOutcome   { id, courseId, title, desc, order }
export interface CourseBeforeAfter{ id, courseId, beforeItems: string[], afterItems: string[] }
export interface CourseEligibilityItem { id, courseId, text, order }
export interface CourseFAQ       { id, courseId, question, answer, order }
export interface CourseTestimonial{ id, courseId, initials, name, meta, avatarGrad, quote, before, after, order }
```

---

## 5. Frontend API Layer (`src/api/courses.ts`)

```typescript
// Public
getAllCourses()               ➞ GET /courses         ➞ AiCourse[]
getCourseBySlug(slug)        ➞ GET /courses/:slug    ➞ AiCourse

// Admin (axios interceptor adds Bearer token automatically)
adminGetCourse(slug)         ➞ GET /admin/courses/:slug
adminUpdateCourseHero(slug, data)
adminUpdateWhoItems(slug, items)
adminUpdateModules(slug, items)
adminUpdateTools(slug, items)
adminUpdateOutcomes(slug, items)
adminUpdateBeforeAfter(slug, { beforeItems, afterItems })
adminUpdateEligibility(slug, items)
adminUpdateFaqs(slug, items)
adminUpdateTestimonials(slug, items)
```

---

## 6. Frontend Routes

| URL | Component | Auth | Description |
|-----|-----------|------|-------------|
| `/courses` | `Courses.tsx` | Public | Listing of all 3 courses |
| `/courses/l1` | `CoursePage.tsx` | Public | AI Foundation full page |
| `/courses/l2a` | `CoursePage.tsx` | Public | AI Generalist full page |
| `/courses/l2b` | `CoursePage.tsx` | Public | AI Developer full page |
| `/admin/courses` | `CoursesAdmin.tsx` | JWT | 3-tab admin editor |

All course page components are `React.lazy()` code-split in `App.tsx`.

---

## 7. Page: `Courses.tsx` -The Listing Page (`/courses`)

Fetches `GET /api/courses` on mount and renders all 3 courses in a pathway layout.

### Layout
```
Hero section (centered, "One Path. Three Levels.")
    ↓
L1 -full-width CourseCard (cyan border-top)
    ↓
Divider: "Choose Your Track at Level 2"
    ↓
L2A  |  L2B     ← grid md:grid-cols-2
    ↓
"Who Is This For" -5-card hardcoded section (WHO_CARDS)
    ↓
Final CTA
```

### CourseCard component
Shows: badge pill, title, tagline, 4 meta pills (duration/mode/language/level), first 7 tools as pills, first 4 outcomes as checkmarks, then two buttons (Demo CTA + "View Course ➞").

### `useReveal()` hook
`Courses.tsx` uses `useReveal()` with **empty `[]` deps** -this is correct here because content exists on first render (no async blocking).

---

## 8. Page: `CoursePage.tsx` -Individual Course Page

Single component used for all three routes. Derives slug from URL pathname.

### Critical patterns

**1. Slug derivation**
```typescript
function useSlug(): string {
  const { pathname } = useLocation();
  return pathname.split('/').pop() ?? '';
}
```

**2. `useReveal(ready: boolean)` hook -the async-safe version**
```typescript
function useReveal(ready: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ready) return;   // ← CRITICAL: do not register observer until data loaded
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ready]);   // ← deps = [ready], not []
  return ref;
}
```

> **Why `ready` param?** When the component first renders, `course` is null. All section `<div>`s don't exist yet. If we used `[]` deps, the observer would fire immediately, find no element, and never register. The `ready = !loading && !!course` flag ensures the observer only registers AFTER data arrives and sections mount.

**3. State reset on slug change**
```typescript
useEffect(() => {
  setLoading(true);
  setCourse(null);         // ← clear stale data immediately on navigation
  getCourseBySlug(slug)
    .then((res) => setCourse(res.data))
    .catch(() => navigate('/courses', { replace: true }))
    .finally(() => setLoading(false));
}, [slug, navigate]);
```

**4. All array accesses are guarded**
Every child relation: `(course.whoItems ?? [])`, `(course.modules ?? [])`, etc.

**5. Reveal refs -8 total**
```typescript
const loaded = !loading && !!course;
const r1 = useReveal(loaded); // who section
const r2 = useReveal(loaded); // curriculum
const r3 = useReveal(loaded); // tools
const r4 = useReveal(loaded); // outcomes + before/after
const r5 = useReveal(loaded); // course details & eligibility
const r6 = useReveal(loaded); // testimonials
const r7 = useReveal(loaded); // faq
const r8 = useReveal(loaded); // related courses
```

### Page Sections (in order)

```
1. Bottom Sticky Bar      -fixed bottom-0, slides up via translateY(100%) ➞ (0)
2. Hero                   -gradient bg, left text + right highlights card
3. Prerequisite Banner    -L2A/L2B only, cyan info box linking to L1
4. Who Should Join (r1)   -emoji-box cards (3-col grid)
5. Curriculum (r2)        -stacked bordered rows, 140px/1fr grid, hover accent bar
6. Tools (r3)             -L1: 4-col mini-cards | L2A/L2B: 3-col category cards
7. Outcomes + Before/After (r4) -2-col outcome cards + 3-col before/after
8. Course Details & Eligibility (r5) -2-col: info rows | eligibility checklist
9. Testimonials (r6)      -3-col cards: avatar/name ➞ quote ➞ transform row
10. FAQ (r7)              -expandable + icon circle
11. Related Courses (r8)  -2-col proper cards with colored border-top
12. Final CTA             -centered with radial gradient bg
```

### LEVEL_COLOR map
```typescript
const LEVEL_COLOR = {
  L1_FOUNDATION:   'var(--electric)', // #00D4FF cyan
  L2A_GENERALIST:  'var(--orange)',   // #FF6B2B orange
  L2B_DEVELOPER:   '#a78bfa',         // purple
};
```

### Tools display logic
```typescript
// L1 ➞ individual mini-cards (4 cols)
// L2A/L2B ➞ category-grouped cards (3 cols)

function groupToolsByCategory(tools) {
  // groups by tool.category, uses first tool's emoji as category icon
  // returns: [{ category, emoji, items[] }]
}

// Usage in JSX:
{course.level === 'L1_FOUNDATION'
  ? <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4"> {/* mini-cards */}
  : <div className="grid sm:grid-cols-2 md:grid-cols-3"> {/* category cards */}
}
```

### RELATED map -full structure
```typescript
const RELATED = {
  l1:  [{ label, slug: 'l2a', levelLabel, desc }, { label, slug: 'l2b', levelLabel, desc }],
  l2a: [{ ...'l1' }, { ...'l2b' }],
  l2b: [{ ...'l1' }, { ...'l2a' }],
};
const RELATED_COLOR = { l1: 'var(--electric)', l2a: 'var(--orange)', l2b: '#a78bfa' };
```

### FAQItem component
```typescript
function FAQItem({ faq, accent }) {
  // + circle icon that rotates 45° to × when open
  // border-color changes to ${accent}40 when open
  // uses conditional mount (not height animation) for answer
}
```

### Sticky bar
- Position: `fixed bottom-0`
- Hidden initially: `transform: translateY(100%)`
- Shown after hero: `transform: translateY(0)` + `transition: transform 0.4s ease`
- Trigger: `IntersectionObserver` on `heroRef` -`!entry.isIntersecting` ➞ show bar
- Observer re-registers in `useEffect` with `[course]` dep (to re-attach after data loads)

---

## 9. Page: `CoursesAdmin.tsx` -Admin Editor (`/admin/courses`)

3-tab editor with 9 accordion sections per course.

### Tabs
```typescript
const tabs = [
  { slug: 'l1',  label: 'L1 · Foundation',   color: 'var(--electric)' },
  { slug: 'l2a', label: 'L2A · Generalist',  color: 'var(--orange)'   },
  { slug: 'l2b', label: 'L2B · Developer',   color: '#a78bfa'          },
];
```

### Internal hooks / components
- `useSave()` -manages `SaveState = 'idle' | 'saving' | 'saved' | 'error'` with auto-reset
- `Section` -collapsible accordion wrapper with title + chevron
- `Field` -label + `<input>` or `<textarea>` pair
- `CourseTab` -keyed by `activeTab` so it **remounts** on tab switch (fetches fresh data)

### 9 Sections
| Section | API Called | Update Pattern |
|---------|------------|----------------|
| HeroSection | `adminUpdateCourseHero` | PATCH scalar fields |
| WhoSection | `adminUpdateWhoItems` | Reorderable list (↑↓ buttons + delete) |
| ModulesSection | `adminUpdateModules` | Editable label + title + comma-separated topics |
| ToolsSection | `adminUpdateTools` | emoji + name + category per row |
| OutcomesSection | `adminUpdateOutcomes` | title + desc per row |
| BeforeAfterSection | `adminUpdateBeforeAfter` | Two list editors (before/after) |
| EligibilitySection | `adminUpdateEligibility` | Simple text list |
| FaqsSection | `adminUpdateFaqs` | question + answer per row |
| TestimonialsSection | `adminUpdateTestimonials` | All testimonial fields per row |

---

## 10. Seed Data (`backend/prisma/seed.ts`)

### Idempotency pattern
```typescript
// 1. Upsert parent course (never fails on re-run)
const course = await prisma.aiCourse.upsert({
  where: { level: CourseLevel.L1_FOUNDATION },
  update: {},   // ← empty: never overwrite existing admin edits
  create: { ...data },
});

// 2. Only seed children if they don't exist yet
const whoCount = await prisma.courseWhoItem.count({ where: { courseId: course.id } });
if (whoCount === 0) {
  await prisma.courseWhoItem.createMany({ data: [...] });
}
```

### Seeded record counts (L1 / L2A / L2B)
| Table | L1 | L2A | L2B |
|-------|----|-----|-----|
| whoItems | 6 | 6 | 6 |
| modules | 4 | 5 | 4 |
| tools | 8 | 12 | 12 |
| outcomes | 6 | 6 | 6 |
| beforeAfter | 1 | 1 | 1 |
| eligibilityItems | 7 | 7 | 7 |
| faqs | 7 | 7 | 7 |
| testimonials | 3 | 3 | 3 |

Run seed: `cd backend && npm run prisma:seed`

---

## 11. Design System for Course Pages

### Accent color per course
```typescript
const LEVEL_COLOR = {
  L1_FOUNDATION:   'var(--electric)',  // cyan  -used for: badge, borders, icons, headings
  L2A_GENERALIST:  'var(--orange)',    // orange
  L2B_DEVELOPER:   '#a78bfa',          // purple
};
```

### Key visual patterns

**Emoji box (Who Should Join cards)**
```tsx
<div
  className="w-11 h-11 min-w-11 rounded-xl flex items-center justify-center text-2xl"
  style={{ background: `${accent}14` }}  // 14 = ~8% opacity hex
>
  {item.emoji}
</div>
```

**Curriculum stacked rows**
```tsx
// No gap between rows -merged borders
// First row: borderRadius: '16px 16px 0 0'
// Last row:  borderRadius: '0 0 16px 16px'
// Middle:    borderRadius: '0'
// borderTop: 'none' for all except first (achieved via: isFirst ? '1px solid var(--border)' : 'none')
// Left accent bar: absolute positioned div, opacity-0 ➞ group-hover:opacity-100
// Grid: grid-cols-1 sm:grid-cols-[140px_1fr]
```

**Before/After 3-column layout**
```tsx
// Desktop: grid-cols-[1fr_auto_1fr]  -before | ➞ | after
// Mobile:  grid-cols-1               -stacks vertically with ↓ arrow
// Before box: background var(--card), muted dots
// After box:  background ${accent}06, accent dots, colored border
```

**Testimonial cards**
```
avatar+name ➞ quote (italic, flex-1) ➞ transform row (before ➞ after)
```
The transform row is a simple inline text: `{t.before}` `➞` `{t.after}` -NOT a grid.

**Category tools (L2A/L2B)**
- Group tools by `tool.category` using `groupToolsByCategory()` helper
- First tool in each group provides the category icon emoji
- Card: colored icon box + category name + tool count + tool name pills

**Related course cards**
- `borderTop: 2.5px solid ${RELATED_COLOR[r.slug]}` -the only visual differentiator
- Proper card with level label, title, description text, "Explore Course ➞"

---

## 12. Common Mistakes to Avoid

| Mistake | Correct Approach |
|---------|-----------------|
| Name the Prisma model `Course` | Must be `AiCourse` -`enum Course` already exists |
| Use `useReveal([])` on async sections | Use `useReveal(ready)` with `[ready]` deps |
| Forget `?? []` on child arrays | Always guard: `(course.whoItems ?? []).map(...)` |
| Import `PrismaModule` in CoursesModule | `PrismaModule` is `@Global()` -never import individually |
| Put `beforeAfter` inside `{ items: [] }` wrapper | `beforeAfter` DTO is `{ beforeItems: string[], afterItems: string[] }` directly |
| Sticky bar at top (below navbar) | Sticky bar is `fixed bottom-0`, slides up from bottom |
| Show tools as individual cards for L2A/L2B | L2A/L2B use category-grouped cards; only L1 uses individual mini-cards |
| Forget to re-register sticky observer after data loads | `useEffect` for sticky observer has `[course]` as dep |

---

## 13. File Map

```
backend/
  prisma/
    schema.prisma             ← enum CourseLevel + AiCourse + 8 child models
    seed.ts                   ← seedCourses() function with idempotent upsert pattern
  src/
    courses/
      courses.module.ts       ← @Module({ controllers, providers })
      courses.controller.ts   ← @Controller(), 2 public + 10 admin endpoints
      courses.service.ts      ← findAll, findBySlug, 9 update methods
      dto/
        update-course.dto.ts  ← 9 DTOs (all using class-validator)
    app.module.ts             ← CoursesModule imported here

frontend/
  src/
    types/index.ts            ← CourseLevel, CourseSlug, AiCourse + 8 child interfaces
    api/courses.ts            ← 2 public + 10 admin API calls
    pages/
      Courses.tsx             ← /courses listing page
      CoursePage.tsx          ← /courses/l1, /courses/l2a, /courses/l2b (shared component)
      admin/
        CoursesAdmin.tsx      ← /admin/courses 3-tab editor
    App.tsx                   ← routes: /courses, /courses/l1, /courses/l2a, /courses/l2b,
                                          /admin/courses
```

---

## 14. API Call Examples

```bash
# Get all courses
GET http://localhost:3001/api/courses

# Get single course
GET http://localhost:3001/api/courses/l1
GET http://localhost:3001/api/courses/l2a

# Admin: update hero text for L1
PATCH http://localhost:3001/api/admin/courses/l1
Authorization: Bearer <jwt>
Content-Type: application/json
{ "title": "AI Foundation Program", "duration": "6-8 Weeks" }

# Admin: replace all who-items for L2A
PATCH http://localhost:3001/api/admin/courses/l2a/who-items
Authorization: Bearer <jwt>
{
  "items": [
    { "emoji": "🎓", "title": "Freshers", "desc": "...", "order": 0 },
    { "emoji": "💼", "title": "Professionals", "desc": "...", "order": 1 }
  ]
}

# Admin: update before/after for L2B
PATCH http://localhost:3001/api/admin/courses/l2b/before-after
Authorization: Bearer <jwt>
{
  "beforeItems": ["No coding skills", "Manual processes"],
  "afterItems": ["Building AI apps", "Automated workflows"]
}
```
