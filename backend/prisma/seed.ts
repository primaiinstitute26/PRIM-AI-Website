// Seed script - creates default admin account and site settings

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  await prisma.admin.upsert({
    where: { email: 'admin@primaiinstitute.com' },
    update: {},
    create: {
      email: 'admin@primaiinstitute.com',
      passwordHash,
      name: 'PRIM AI Admin',
    },
  });

  const defaultSettings = [
    // Navigation
    { key: 'nav_logo_text', value: 'PRIM AI' },
    { key: 'nav_cta_text', value: 'Book Free Demo' },
    { key: 'nav_link_home', value: 'Home' },
    { key: 'nav_link_about', value: 'About' },
    { key: 'nav_link_courses', value: 'Courses' },
    { key: 'nav_link_contact', value: 'Contact' },
    // Hero content
    { key: 'hero_badge_text', value: "India's AI-First Training Institute" },
    { key: 'hero_heading_line1', value: 'The Future Runs on AI.' },
    { key: 'hero_heading_cyan', value: 'Are' },
    { key: 'hero_heading_white', value: 'You' },
    { key: 'hero_heading_orange', value: 'Ready?' },
    { key: 'hero_subtext', value: "Join PRIM AI Institute - where school students, professionals & entrepreneurs learn to harness the power of Artificial Intelligence and lead the next decade." },
    { key: 'hero_cta1_text', value: 'Book Your Free Demo Class' },
    { key: 'hero_cta2_text', value: 'Explore Courses' },
    // Hero stats
    { key: 'hero_students_count', value: '5000+' },
    { key: 'hero_students_label', value: 'Students' },
    { key: 'hero_companies_count', value: '350+' },
    { key: 'hero_companies_label', value: 'Companies' },
    { key: 'hero_years_count', value: '10+' },
    { key: 'hero_years_label', value: 'Years' },
    { key: 'hero_iso_show', value: 'true' },
    // Batch banner
    { key: 'new_batch_banner', value: 'true' },
    { key: 'new_batch_text', value: 'New Batch Starting Soon - Limited Seats!' },
    // Admin contact
    { key: 'admin_whatsapp', value: '917573055191' },
    { key: 'admin_email', value: 'info@stadsolution.com' },
    // About hero
    { key: 'about_badge_text', value: 'OUR STORY' },
    { key: 'about_hero_h1', value: 'Built by Industry Veterans.' },
    { key: 'about_hero_h1_accent', value: 'Designed for Your Future.' },
    { key: 'about_hero_subtext', value: 'PRIM AI Institute emerged from a simple realization: the gap between academic theory and industry reality in Artificial Intelligence was widening. We set out to build an ecosystem where cutting-edge research meets practical application.' },
    { key: 'about_stat1_count', value: '10+' },
    { key: 'about_stat1_label', value: 'YEARS EXP' },
    { key: 'about_stat2_count', value: '5k+' },
    { key: 'about_stat2_label', value: 'STUDENTS' },
    { key: 'about_stat3_count', value: '350+' },
    { key: 'about_stat3_label', value: 'COMPANIES' },
    { key: 'about_show_iso', value: 'true' },
    // About quote
    { key: 'about_show_quote', value: 'true' },
    { key: 'about_quote_main', value: 'We believe AI education should be accessible to every Indian —' },
    { key: 'about_quote_accent', value: 'from Class 6 to CEO.' },
    // About differentiators
    { key: 'about_show_diff', value: 'true' },
    { key: 'about_diff1_icon', value: '🏅' },
    { key: 'about_diff1_title', value: 'ISO Certified' },
    { key: 'about_diff1_body', value: 'Internationally recognized quality management standards in technical education.' },
    { key: 'about_diff2_icon', value: '🧑‍💻' },
    { key: 'about_diff2_title', value: 'MNC Experts' },
    { key: 'about_diff2_body', value: 'Learn directly from senior engineers actively working in top tech companies.' },
    { key: 'about_diff3_icon', value: '🚀' },
    { key: 'about_diff3_title', value: '100% Placement' },
    { key: 'about_diff3_body', value: 'Dedicated career support and direct hiring partnerships with leading firms.' },
    { key: 'about_diff4_icon', value: '⚡' },
    { key: 'about_diff4_title', value: '100% Practical' },
    { key: 'about_diff4_body', value: 'Zero theoretical bloat. Build real-world projects from day one.' },
    // About trainers
    { key: 'about_show_trainers', value: 'true' },
    { key: 'about_trainer1_name', value: 'Dr. Alok Sharma' },
    { key: 'about_trainer1_role', value: 'Lead AI Architect' },
    { key: 'about_trainer1_exp', value: '15+ YRS EXP' },
    { key: 'about_trainer1_img', value: '' },
    { key: 'about_trainer2_name', value: 'Priya Patel' },
    { key: 'about_trainer2_role', value: 'Senior ML Engineer' },
    { key: 'about_trainer2_exp', value: '8+ YRS EXP' },
    { key: 'about_trainer2_img', value: '' },
    { key: 'about_trainer3_name', value: 'Rahul Verma' },
    { key: 'about_trainer3_role', value: 'Director of Research' },
    { key: 'about_trainer3_exp', value: '12+ YRS EXP' },
    { key: 'about_trainer3_img', value: '' },
    // About CTA
    { key: 'about_show_cta', value: 'true' },
    { key: 'about_cta_heading', value: 'Ready to Shape the Future?' },
    { key: 'about_cta_subtext', value: 'Join thousands of professionals who have accelerated their careers through our industry-aligned AI programs.' },
    { key: 'about_cta_btn1_text', value: 'Explore Courses' },
    { key: 'about_cta_btn2_text', value: 'Contact Admissions' },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('✅ Seed complete - admin and settings created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
