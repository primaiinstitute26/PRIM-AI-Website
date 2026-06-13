// Default data and localStorage helpers for the Courses page

const STORAGE_KEY = 'primAI_coursePage';

export interface CourseModule {
  id: string;
  label: string;
  title: string;
  topics: string[];
}

export interface CourseTool {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

export interface AudienceCard {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export interface CourseOutcome {
  id: string;
  title: string;
  description: string;
}

export interface CourseTestimonial {
  id: string;
  initials: string;
  avatarColor: string;
  name: string;
  meta: string;
  quote: string;
  before: string;
  after: string;
}

export interface CourseFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface CardHighlight {
  id: string;
  label: string;
  value: string;
  highlighted: boolean;
}

export interface CoursePageData {
  badge: string;
  title: string;
  tagline: string;
  cta1Text: string;
  cta2Text: string;
  quickStats: string[];
  cardHighlights: CardHighlight[];
  // Section visibility
  showAudience: boolean;
  showCurriculum: boolean;
  showTools: boolean;
  showOutcomes: boolean;
  showBeforeAfter: boolean;
  showTestimonials: boolean;
  showFaq: boolean;
  showRelated: boolean;
  // Who Should Join
  audienceTitle: string;
  audienceSubtext: string;
  audience: AudienceCard[];
  // Curriculum
  curriculumTitle: string;
  curriculumSubtext: string;
  modules: CourseModule[];
  // Tools
  toolsTitle: string;
  toolsSubtext: string;
  tools: CourseTool[];
  toolsMoreText: string;
  // Outcomes
  outcomesTitle: string;
  outcomesSubtext: string;
  outcomes: CourseOutcome[];
  beforeLabel: string;
  afterLabel: string;
  beforeItems: string[];
  afterItems: string[];
  // Testimonials
  testimonialsTitle: string;
  testimonialsSubtext: string;
  testimonials: CourseTestimonial[];
  // FAQ
  faqTitle: string;
  faqSubtext: string;
  faqs: CourseFAQ[];
  // Final CTA
  finalCtaTitle: string;
  finalCtaBody: string;
  finalCtaNote: string;
}

export const DEFAULT_COURSE_DATA: CoursePageData = {
  badge: 'Level 1 – AI Foundation',
  title: 'AI Foundation Program',
  tagline:
    'Your first step into the world of Artificial Intelligence. No prior knowledge required — just curiosity and the willingness to learn.',
  cta1Text: 'Book Free Demo Class →',
  cta2Text: 'Download Syllabus',
  quickStats: [
    '⏱ 6-8 Weeks',
    '👤 1-to-1 Mentorship',
    '🏫 Offline · Hands-on',
    '✅ ISO Certificate',
    '🗣 Hindi & Gujarati',
  ],
  cardHighlights: [
    { id: '1', label: 'Duration', value: '6 to 8 Weeks', highlighted: false },
    { id: '2', label: 'Mentorship', value: '1-to-1 Personal', highlighted: true },
    { id: '3', label: 'Training Days', value: 'Monday to Friday', highlighted: false },
    { id: '4', label: 'Language', value: 'Hindi & Gujarati', highlighted: false },
    { id: '5', label: 'Mode', value: 'Offline · Hands-on', highlighted: false },
    { id: '6', label: 'Certificate', value: 'ISO 9001:2015 ✓', highlighted: true },
    { id: '7', label: 'Placement Support', value: 'Yes – 1500+ Partners', highlighted: true },
  ],
  showAudience: true,
  showCurriculum: true,
  showTools: true,
  showOutcomes: true,
  showBeforeAfter: true,
  showTestimonials: true,
  showFaq: true,
  showRelated: true,
  audienceTitle: 'Who Should Join This Course?',
  audienceSubtext:
    'This course is designed for anyone who wants to start their AI journey — regardless of age, background, or technical experience.',
  audience: [
    { id: '1', emoji: '🎒', title: 'School Students', description: 'Class 6-12 students who want to stand out in school and get ahead of their generation with AI skills.' },
    { id: '2', emoji: '🎓', title: 'College Students', description: 'Freshers and graduates who want to add high-demand AI skills to their resume and get hired faster.' },
    { id: '3', emoji: '💼', title: 'Working Professionals', description: 'Admin, HR, operations — anyone who wants to use AI to work smarter and grow faster at their job.' },
    { id: '4', emoji: '💡', title: 'Entrepreneurs', description: 'Business owners and aspiring entrepreneurs who want to use AI to build or grow their venture.' },
    { id: '5', emoji: '🤝', title: 'Anyone Curious', description: 'Zero background needed. If you are curious about AI and want to start — this is your entry point.' },
    { id: '6', emoji: '✅', title: 'No Prerequisites', description: 'No coding. No technical background. No prior AI knowledge. Just show up ready to learn.' },
  ],
  curriculumTitle: 'Module-by-Module Breakdown',
  curriculumSubtext:
    'A structured 8-week journey from complete beginner to confident AI user — with real projects every week.',
  modules: [
    { id: '1', label: 'Module 1', title: 'AI Fundamentals & Getting Started', topics: ['What is Artificial Intelligence?', 'How AI thinks and works', 'ChatGPT basics', 'Google Gemini introduction', 'Your first AI conversation'] },
    { id: '2', label: 'Module 2', title: 'Prompt Engineering & Content Creation', topics: ['What is a prompt?', 'Writing effective prompts', 'AI for writing & essays', 'Email drafting with AI', 'Quillbot & Grammarly AI'] },
    { id: '3', label: 'Module 3', title: 'Creative AI — Design, Images & Presentations', topics: ['Canva AI — posters & banners', 'DALL-E image generation', 'AI presentations with Gamma.app', 'Microsoft Copilot in Office', 'Creative project building'] },
    { id: '4', label: 'Module 4', title: 'Real-World Application & Final Project', topics: ['AI for research & summarization', 'Productivity automation basics', 'Personal AI workflow setup', 'Final capstone project', 'Certificate presentation'] },
  ],
  toolsTitle: 'AI Tools You Will Master',
  toolsSubtext: 'Every tool you learn is actively used in the industry — no outdated software, no textbook tools.',
  tools: [
    { id: '1', emoji: '🤖', name: 'ChatGPT', category: 'Writing & Research' },
    { id: '2', emoji: '🔍', name: 'Google Gemini', category: 'Research & Search' },
    { id: '3', emoji: '🎨', name: 'Canva AI', category: 'Design & Visual' },
    { id: '4', emoji: '🖼️', name: 'DALL-E', category: 'Image Generation' },
    { id: '5', emoji: '🪟', name: 'Microsoft Copilot', category: 'Office Productivity' },
    { id: '6', emoji: '✍️', name: 'Quillbot', category: 'Writing & Grammar' },
    { id: '7', emoji: '📊', name: 'Gamma.app', category: 'AI Presentations' },
    { id: '8', emoji: '🔵', name: 'Claude by Anthropic', category: 'Writing Assistant' },
  ],
  toolsMoreText: 'And many more tools covered throughout the program',
  outcomesTitle: 'What You Will Be Able to Do',
  outcomesSubtext: 'Every outcome below is a real, practical skill you will walk away with — not just theory.',
  outcomes: [
    { id: '1', title: 'Build Presentations in Minutes', description: 'Use Gamma.app and Canva AI to create professional presentations without design skills.' },
    { id: '2', title: 'Write Emails & Content with AI', description: 'Draft professional emails, essays, reports, and social content in seconds using ChatGPT.' },
    { id: '3', title: 'Generate Images & Posters', description: 'Create stunning visuals, banners, and artwork using DALL-E and Canva AI — no design experience needed.' },
    { id: '4', title: 'Research Any Topic Instantly', description: 'Use AI to summarize documents, research topics, and get clear answers in seconds.' },
    { id: '5', title: 'Automate Simple Daily Tasks', description: 'Set up basic AI workflows that save you hours every week at school, college, or work.' },
    { id: '6', title: 'Start Your AI Career Journey', description: 'Build a strong foundation to confidently move into the AI Generalist or AI Developer track next.' },
  ],
  beforeLabel: 'Before This Course',
  afterLabel: 'After This Course',
  beforeItems: [
    'Spending hours on assignments',
    'Struggling to write good content',
    'Paying for design work',
    'No idea how AI works',
    'Feeling left behind',
  ],
  afterItems: [
    'Projects done in minutes with AI',
    'Confident AI-powered writer',
    'Creating your own designs for free',
    'Using 8+ AI tools confidently',
    'Ready for the AI-powered future',
  ],
  testimonialsTitle: 'What Our Students Say',
  testimonialsSubtext: 'Real results from real students who started exactly where you are right now.',
  testimonials: [
    { id: '1', initials: 'RS', avatarColor: 'linear-gradient(135deg,#00D4FF,#0077aa)', name: 'Riya Sharma', meta: 'Class 10 · Ahmedabad', quote: 'I made my science project using AI and won the best project award. My entire class was shocked!', before: 'Struggling student', after: 'School topper' },
    { id: '2', initials: 'PD', avatarColor: 'linear-gradient(135deg,#10b981,#059669)', name: 'Priya Desai', meta: 'Homemaker · Anand', quote: 'I thought AI was only for engineers. After this course, I now do freelance graphic work from home.', before: 'Zero tech background', after: 'Earning from home' },
    { id: '3', initials: 'NM', avatarColor: 'linear-gradient(135deg,#FF6B2B,#FF9500)', name: 'Neha Modi', meta: 'HR Manager · Vadodara', quote: 'Work that used to take 3 hours now takes 20 minutes. My manager noticed and promoted me in 4 months.', before: 'Overworked, no growth', after: 'Promoted in 4 months' },
  ],
  faqTitle: 'Frequently Asked Questions',
  faqSubtext: 'Everything you need to know before joining — answered clearly.',
  faqs: [
    { id: '1', question: 'Do I need any coding or technical knowledge?', answer: 'Absolutely not. This course is designed for complete beginners. No coding, no prior AI knowledge, and no technical background is required. If you can use a smartphone, you are ready for this course.' },
    { id: '2', question: 'Will I receive a certificate after completing the course?', answer: 'Yes. Upon successful completion, you will receive an ISO 9001:2015 certified course completion certificate issued directly by PRIM AI Institute. This certificate is recognized by our 1500+ hiring partner companies.' },
    { id: '3', question: 'What is 1-to-1 mentorship? How does it work?', answer: 'Unlike group batches, we offer personal 1-to-1 mentorship. Your trainer focuses entirely on your learning pace, your questions, and your progress. This means faster learning and better outcomes tailored to you specifically.' },
    { id: '4', question: 'Is placement assistance provided after this course?', answer: 'Yes. We provide strong placement support with access to our network of 1500+ corporate hiring partners. This includes resume building, mock interviews, and direct referrals.' },
    { id: '5', question: 'What are the training days and timings?', answer: 'Training runs Monday to Friday. Timing is flexible and can be discussed at the time of enrollment. We offer morning and evening slots to accommodate students and working professionals.' },
    { id: '6', question: 'What language will the training be conducted in?', answer: 'All training is conducted in Hindi and Gujarati, making it comfortable and easy to understand for every learner.' },
    { id: '7', question: 'Can I move to Level 2 after this course?', answer: 'Yes — and that is exactly the plan. After completing Level 1, you can choose your track: AI Generalist (for non-tech professionals) or AI Developer (for IT and engineering students).' },
  ],
  finalCtaTitle: 'Your AI Journey\nStarts With One Step.',
  finalCtaBody: 'Book a free demo class — no fees, no obligation. Just come and see what AI can do for you.',
  finalCtaNote: 'Limited seats · Monday to Friday · Hindi & Gujarati · 1-to-1 Mentorship',
};

export function getCourseData(): CoursePageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_COURSE_DATA, ...(JSON.parse(stored) as Partial<CoursePageData>) };
    }
  } catch {
    // ignore parse errors
  }
  return { ...DEFAULT_COURSE_DATA };
}

export function saveCourseData(data: CoursePageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
