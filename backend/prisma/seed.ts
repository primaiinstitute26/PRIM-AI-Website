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
    { key: 'about_quote_main', value: 'We believe AI education should be accessible to every Indian -' },
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
    // Contact hero & info
    { key: 'contact_badge', value: 'GET IN TOUCH' },
    { key: 'contact_heading', value: 'Start Your AI Journey Today' },
    { key: 'contact_subtext', value: 'Connect with our admissions team to explore course details, campus visits, or bespoke AI training solutions for your team.' },
    { key: 'contact_address', value: '1016, 10th Floor, Ganesh Glory, Off S.G. Highway, Jagatpur Road, Gota, Ahmedabad – 382470' },
    { key: 'contact_phone', value: '+91 88490 31797' },
    { key: 'contact_email', value: 'primeai.dev@gmail.com' },
    { key: 'contact_hours', value: 'Mon – Sat: 9 AM – 6 PM IST' },
    { key: 'contact_form_title', value: 'Send an Enquiry' },
    // Contact WhatsApp & Map
    { key: 'contact_show_whatsapp', value: 'true' },
    { key: 'contact_whatsapp_number', value: '917573055191' },
    { key: 'contact_whatsapp_message', value: "Hi! I'm interested in PRIM AI Institute courses. Please share more details." },
    { key: 'contact_show_map', value: 'true' },
    { key: 'contact_map_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5482349281685!2d72.54098!3d23.08501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84c0b68a4e6f%3A0x4d1d5b2b36e2c92f!2sGanesh%20Glory%2C%20Gota%2C%20Ahmedabad%2C%20Gujarat%20382481!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin' },
    { key: 'contact_map_link_url', value: 'https://maps.google.com/?q=Ganesh+Glory+Gota+Ahmedabad+Gujarat+382470' },
    // Contact FAQ
    { key: 'contact_show_faq', value: 'true' },
    { key: 'contact_faq_title', value: 'Frequently Asked Questions' },
    { key: 'contact_faqs', value: JSON.stringify([
      { id: '1', question: 'What is the primary focus of PRIM AI Institute?', answer: 'PRIM AI Institute specializes in practical AI education for school students, college students, working professionals, and business owners. Our programs focus on real-world applications of Artificial Intelligence with zero theoretical bloat and 100% hands-on learning.' },
      { id: '2', question: 'Do I need prior coding or AI knowledge to join?', answer: 'Not at all! Our Level 1 Introduction course is designed for absolute beginners. We start from the very basics and build your skills step by step. All you need is curiosity and a smartphone or laptop.' },
      { id: '3', question: 'What payment options are available?', answer: 'We offer flexible payment options including full payment, easy EMI plans, and scholarship opportunities for deserving students. Contact our admissions team to discuss the option that works best for you.' },
      { id: '4', question: 'What kind of career support do you provide?', answer: 'We provide 100% placement assistance including resume building workshops, mock interview sessions, LinkedIn optimization, and direct referrals to our 350+ hiring partner companies across India.' },
    ]) },
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
