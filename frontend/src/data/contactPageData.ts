export interface ContactFAQ {
  id: string;
  question: string;
  answer: string;
}

export const DEFAULT_FAQS: ContactFAQ[] = [
  {
    id: '1',
    question: 'What is the primary focus of PRIM AI Institute?',
    answer:
      'PRIM AI Institute specializes in practical AI education for school students, college students, working professionals, and business owners. Our programs focus on real-world applications of Artificial Intelligence with zero theoretical bloat and 100% hands-on learning.',
  },
  {
    id: '2',
    question: 'Do I need prior coding or AI knowledge to join?',
    answer:
      'Not at all! Our Level 1 Introduction course is designed for absolute beginners. We start from the very basics and build your skills step by step. All you need is curiosity and a smartphone or laptop.',
  },
  {
    id: '3',
    question: 'What payment options are available?',
    answer:
      'We offer flexible payment options including full payment, easy EMI plans, and scholarship opportunities for deserving students. Contact our admissions team to discuss the option that works best for you.',
  },
  {
    id: '4',
    question: 'What kind of career support do you provide?',
    answer:
      'We provide 100% placement assistance including resume building workshops, mock interview sessions, LinkedIn optimization, and direct referrals to our 350+ hiring partner companies across India.',
  },
];
