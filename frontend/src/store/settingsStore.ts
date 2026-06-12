import { create } from 'zustand';
import { getPublicSettings } from '@/api/settings';

export interface SiteSettings {
  // Navigation
  navLogoText: string;
  navCtaText: string;
  navLinkHome: string;
  navLinkAbout: string;
  navLinkCourses: string;
  navLinkContact: string;
  // Home hero
  heroBadgeText: string;
  heroHeadingLine1: string;
  heroHeadingCyan: string;
  heroHeadingWhite: string;
  heroHeadingOrange: string;
  heroSubtext: string;
  heroCta1Text: string;
  heroCta2Text: string;
  heroStudentsCount: string;
  heroStudentsLabel: string;
  heroCompaniesCount: string;
  heroCompaniesLabel: string;
  heroYearsCount: string;
  heroYearsLabel: string;
  heroIsoShow: boolean;
  newBatchBanner: boolean;
  newBatchText: string;
  // About hero
  aboutBadgeText: string;
  aboutHeroH1: string;
  aboutHeroH1Accent: string;
  aboutHeroSubtext: string;
  aboutStat1Count: string;
  aboutStat1Label: string;
  aboutStat2Count: string;
  aboutStat2Label: string;
  aboutStat3Count: string;
  aboutStat3Label: string;
  aboutShowIso: boolean;
  // About quote
  aboutShowQuote: boolean;
  aboutQuoteMain: string;
  aboutQuoteAccent: string;
  // About differentiators
  aboutShowDiff: boolean;
  aboutDiff1Icon: string;
  aboutDiff1Title: string;
  aboutDiff1Body: string;
  aboutDiff2Icon: string;
  aboutDiff2Title: string;
  aboutDiff2Body: string;
  aboutDiff3Icon: string;
  aboutDiff3Title: string;
  aboutDiff3Body: string;
  aboutDiff4Icon: string;
  aboutDiff4Title: string;
  aboutDiff4Body: string;
  // About trainers
  aboutShowTrainers: boolean;
  aboutTrainer1Name: string;
  aboutTrainer1Role: string;
  aboutTrainer1Exp: string;
  aboutTrainer1Img: string;
  aboutTrainer2Name: string;
  aboutTrainer2Role: string;
  aboutTrainer2Exp: string;
  aboutTrainer2Img: string;
  aboutTrainer3Name: string;
  aboutTrainer3Role: string;
  aboutTrainer3Exp: string;
  aboutTrainer3Img: string;
  // About CTA
  aboutShowCta: boolean;
  aboutCtaHeading: string;
  aboutCtaSubtext: string;
  aboutCtaBtn1Text: string;
  aboutCtaBtn2Text: string;
}

const DEFAULTS: SiteSettings = {
  // Navigation
  navLogoText: 'PRIM AI',
  navCtaText: 'Book Free Demo',
  navLinkHome: 'Home',
  navLinkAbout: 'About',
  navLinkCourses: 'Courses',
  navLinkContact: 'Contact',
  // Home hero
  heroBadgeText: "India's AI-First Training Institute",
  heroHeadingLine1: 'The Future Runs on AI.',
  heroHeadingCyan: 'Are',
  heroHeadingWhite: 'You',
  heroHeadingOrange: 'Ready?',
  heroSubtext:
    'Join PRIM AI Institute - where school students, professionals & entrepreneurs learn to harness the power of Artificial Intelligence and lead the next decade.',
  heroCta1Text: 'Book Your Free Demo Class',
  heroCta2Text: 'Explore Courses',
  heroStudentsCount: '5000+',
  heroStudentsLabel: 'Students',
  heroCompaniesCount: '350+',
  heroCompaniesLabel: 'Companies',
  heroYearsCount: '10+',
  heroYearsLabel: 'Years',
  heroIsoShow: true,
  newBatchBanner: true,
  newBatchText: 'New Batch Starting Soon - Limited Seats!',
  // About hero
  aboutBadgeText: 'OUR STORY',
  aboutHeroH1: 'Built by Industry Veterans.',
  aboutHeroH1Accent: 'Designed for Your Future.',
  aboutHeroSubtext:
    'PRIM AI Institute emerged from a simple realization: the gap between academic theory and industry reality in Artificial Intelligence was widening. We set out to build an ecosystem where cutting-edge research meets practical application.',
  aboutStat1Count: '10+',
  aboutStat1Label: 'YEARS EXP',
  aboutStat2Count: '5k+',
  aboutStat2Label: 'STUDENTS',
  aboutStat3Count: '350+',
  aboutStat3Label: 'COMPANIES',
  aboutShowIso: true,
  // About quote
  aboutShowQuote: true,
  aboutQuoteMain: 'We believe AI education should be accessible to every Indian -',
  aboutQuoteAccent: 'from Class 6 to CEO.',
  // About differentiators
  aboutShowDiff: true,
  aboutDiff1Icon: '🏅',
  aboutDiff1Title: 'ISO Certified',
  aboutDiff1Body: 'Internationally recognized quality management standards in technical education.',
  aboutDiff2Icon: '🧑‍💻',
  aboutDiff2Title: 'MNC Experts',
  aboutDiff2Body: 'Learn directly from senior engineers actively working in top tech companies.',
  aboutDiff3Icon: '🚀',
  aboutDiff3Title: '100% Placement',
  aboutDiff3Body: 'Dedicated career support and direct hiring partnerships with leading firms.',
  aboutDiff4Icon: '⚡',
  aboutDiff4Title: '100% Practical',
  aboutDiff4Body: 'Zero theoretical bloat. Build real-world projects from day one.',
  // About trainers
  aboutShowTrainers: true,
  aboutTrainer1Name: 'Dr. Alok Sharma',
  aboutTrainer1Role: 'Lead AI Architect',
  aboutTrainer1Exp: '15+ YRS EXP',
  aboutTrainer1Img: '',
  aboutTrainer2Name: 'Priya Patel',
  aboutTrainer2Role: 'Senior ML Engineer',
  aboutTrainer2Exp: '8+ YRS EXP',
  aboutTrainer2Img: '',
  aboutTrainer3Name: 'Rahul Verma',
  aboutTrainer3Role: 'Director of Research',
  aboutTrainer3Exp: '12+ YRS EXP',
  aboutTrainer3Img: '',
  // About CTA
  aboutShowCta: true,
  aboutCtaHeading: 'Ready to Shape the Future?',
  aboutCtaSubtext:
    'Join thousands of professionals who have accelerated their careers through our industry-aligned AI programs.',
  aboutCtaBtn1Text: 'Explore Courses',
  aboutCtaBtn2Text: 'Contact Admissions',
};

interface SettingsState {
  s: SiteSettings;
  loaded: boolean;
  fetch: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  s: DEFAULTS,
  loaded: false,
  fetch: async () => {
    try {
      const res = await getPublicSettings();
      const r = res.data;
      set({
        loaded: true,
        s: {
          navLogoText: r.nav_logo_text ?? DEFAULTS.navLogoText,
          navCtaText: r.nav_cta_text ?? DEFAULTS.navCtaText,
          navLinkHome: r.nav_link_home ?? DEFAULTS.navLinkHome,
          navLinkAbout: r.nav_link_about ?? DEFAULTS.navLinkAbout,
          navLinkCourses: r.nav_link_courses ?? DEFAULTS.navLinkCourses,
          navLinkContact: r.nav_link_contact ?? DEFAULTS.navLinkContact,
          heroBadgeText: r.hero_badge_text ?? DEFAULTS.heroBadgeText,
          heroHeadingLine1: r.hero_heading_line1 ?? DEFAULTS.heroHeadingLine1,
          heroHeadingCyan: r.hero_heading_cyan ?? DEFAULTS.heroHeadingCyan,
          heroHeadingWhite: r.hero_heading_white ?? DEFAULTS.heroHeadingWhite,
          heroHeadingOrange: r.hero_heading_orange ?? DEFAULTS.heroHeadingOrange,
          heroSubtext: r.hero_subtext ?? DEFAULTS.heroSubtext,
          heroCta1Text: r.hero_cta1_text ?? DEFAULTS.heroCta1Text,
          heroCta2Text: r.hero_cta2_text ?? DEFAULTS.heroCta2Text,
          heroStudentsCount: r.hero_students_count ?? DEFAULTS.heroStudentsCount,
          heroStudentsLabel: r.hero_students_label ?? DEFAULTS.heroStudentsLabel,
          heroCompaniesCount: r.hero_companies_count ?? DEFAULTS.heroCompaniesCount,
          heroCompaniesLabel: r.hero_companies_label ?? DEFAULTS.heroCompaniesLabel,
          heroYearsCount: r.hero_years_count ?? DEFAULTS.heroYearsCount,
          heroYearsLabel: r.hero_years_label ?? DEFAULTS.heroYearsLabel,
          heroIsoShow: r.hero_iso_show !== 'false',
          newBatchBanner: r.new_batch_banner === 'true',
          newBatchText: r.new_batch_text ?? DEFAULTS.newBatchText,
          // About
          aboutBadgeText: r.about_badge_text ?? DEFAULTS.aboutBadgeText,
          aboutHeroH1: r.about_hero_h1 ?? DEFAULTS.aboutHeroH1,
          aboutHeroH1Accent: r.about_hero_h1_accent ?? DEFAULTS.aboutHeroH1Accent,
          aboutHeroSubtext: r.about_hero_subtext ?? DEFAULTS.aboutHeroSubtext,
          aboutStat1Count: r.about_stat1_count ?? DEFAULTS.aboutStat1Count,
          aboutStat1Label: r.about_stat1_label ?? DEFAULTS.aboutStat1Label,
          aboutStat2Count: r.about_stat2_count ?? DEFAULTS.aboutStat2Count,
          aboutStat2Label: r.about_stat2_label ?? DEFAULTS.aboutStat2Label,
          aboutStat3Count: r.about_stat3_count ?? DEFAULTS.aboutStat3Count,
          aboutStat3Label: r.about_stat3_label ?? DEFAULTS.aboutStat3Label,
          aboutShowIso: r.about_show_iso !== 'false',
          aboutShowQuote: r.about_show_quote !== 'false',
          aboutQuoteMain: r.about_quote_main ?? DEFAULTS.aboutQuoteMain,
          aboutQuoteAccent: r.about_quote_accent ?? DEFAULTS.aboutQuoteAccent,
          aboutShowDiff: r.about_show_diff !== 'false',
          aboutDiff1Icon: r.about_diff1_icon ?? DEFAULTS.aboutDiff1Icon,
          aboutDiff1Title: r.about_diff1_title ?? DEFAULTS.aboutDiff1Title,
          aboutDiff1Body: r.about_diff1_body ?? DEFAULTS.aboutDiff1Body,
          aboutDiff2Icon: r.about_diff2_icon ?? DEFAULTS.aboutDiff2Icon,
          aboutDiff2Title: r.about_diff2_title ?? DEFAULTS.aboutDiff2Title,
          aboutDiff2Body: r.about_diff2_body ?? DEFAULTS.aboutDiff2Body,
          aboutDiff3Icon: r.about_diff3_icon ?? DEFAULTS.aboutDiff3Icon,
          aboutDiff3Title: r.about_diff3_title ?? DEFAULTS.aboutDiff3Title,
          aboutDiff3Body: r.about_diff3_body ?? DEFAULTS.aboutDiff3Body,
          aboutDiff4Icon: r.about_diff4_icon ?? DEFAULTS.aboutDiff4Icon,
          aboutDiff4Title: r.about_diff4_title ?? DEFAULTS.aboutDiff4Title,
          aboutDiff4Body: r.about_diff4_body ?? DEFAULTS.aboutDiff4Body,
          aboutShowTrainers: r.about_show_trainers !== 'false',
          aboutTrainer1Name: r.about_trainer1_name ?? DEFAULTS.aboutTrainer1Name,
          aboutTrainer1Role: r.about_trainer1_role ?? DEFAULTS.aboutTrainer1Role,
          aboutTrainer1Exp: r.about_trainer1_exp ?? DEFAULTS.aboutTrainer1Exp,
          aboutTrainer1Img: r.about_trainer1_img ?? DEFAULTS.aboutTrainer1Img,
          aboutTrainer2Name: r.about_trainer2_name ?? DEFAULTS.aboutTrainer2Name,
          aboutTrainer2Role: r.about_trainer2_role ?? DEFAULTS.aboutTrainer2Role,
          aboutTrainer2Exp: r.about_trainer2_exp ?? DEFAULTS.aboutTrainer2Exp,
          aboutTrainer2Img: r.about_trainer2_img ?? DEFAULTS.aboutTrainer2Img,
          aboutTrainer3Name: r.about_trainer3_name ?? DEFAULTS.aboutTrainer3Name,
          aboutTrainer3Role: r.about_trainer3_role ?? DEFAULTS.aboutTrainer3Role,
          aboutTrainer3Exp: r.about_trainer3_exp ?? DEFAULTS.aboutTrainer3Exp,
          aboutTrainer3Img: r.about_trainer3_img ?? DEFAULTS.aboutTrainer3Img,
          aboutShowCta: r.about_show_cta !== 'false',
          aboutCtaHeading: r.about_cta_heading ?? DEFAULTS.aboutCtaHeading,
          aboutCtaSubtext: r.about_cta_subtext ?? DEFAULTS.aboutCtaSubtext,
          aboutCtaBtn1Text: r.about_cta_btn1_text ?? DEFAULTS.aboutCtaBtn1Text,
          aboutCtaBtn2Text: r.about_cta_btn2_text ?? DEFAULTS.aboutCtaBtn2Text,
        },
      });
    } catch {
      set({ loaded: true });
    }
  },
}));
