import api from './axios';
import type {
  AiCourse,
  CoursesListingPage,
  CoursesListingWhoCard,
  CourseWhoItem,
  CourseModule,
  CourseTool,
  CourseOutcome,
  CourseBeforeAfter,
  CourseEligibilityItem,
  CourseFAQ,
  CourseTestimonial,
} from '@/types';

// ─── Public ──────────────────────────────────────────────────────────────────

export const getAllCourses = () => api.get<AiCourse[]>('/courses');

export const getCourseBySlug = (slug: string) =>
  api.get<AiCourse>(`/courses/${slug}`);

export const getListingPage = () =>
  api.get<CoursesListingPage>('/courses/listing-page');

// ─── Admin ───────────────────────────────────────────────────────────────────

export const adminGetCourse = (slug: string) =>
  api.get<AiCourse>(`/admin/courses/${slug}`);

export const adminUpdateCourseHero = (slug: string, data: Partial<AiCourse>) =>
  api.patch<AiCourse>(`/admin/courses/${slug}`, data);

export const adminUpdateWhoItems = (
  slug: string,
  items: Omit<CourseWhoItem, 'id' | 'courseId'>[],
) => api.patch<AiCourse>(`/admin/courses/${slug}/who-items`, { items });

export const adminUpdateModules = (
  slug: string,
  items: Omit<CourseModule, 'id' | 'courseId'>[],
) => api.patch<AiCourse>(`/admin/courses/${slug}/modules`, { items });

export const adminUpdateTools = (
  slug: string,
  items: Omit<CourseTool, 'id' | 'courseId'>[],
) => api.patch<AiCourse>(`/admin/courses/${slug}/tools`, { items });

export const adminUpdateOutcomes = (
  slug: string,
  items: Omit<CourseOutcome, 'id' | 'courseId'>[],
) => api.patch<AiCourse>(`/admin/courses/${slug}/outcomes`, { items });

export const adminUpdateBeforeAfter = (
  slug: string,
  data: Omit<CourseBeforeAfter, 'id' | 'courseId'>,
) => api.patch<AiCourse>(`/admin/courses/${slug}/before-after`, data);

export const adminUpdateEligibility = (
  slug: string,
  items: Omit<CourseEligibilityItem, 'id' | 'courseId'>[],
) => api.patch<AiCourse>(`/admin/courses/${slug}/eligibility`, { items });

export const adminUpdateFaqs = (
  slug: string,
  items: Omit<CourseFAQ, 'id' | 'courseId'>[],
) => api.patch<AiCourse>(`/admin/courses/${slug}/faqs`, { items });

export const adminUpdateTestimonials = (
  slug: string,
  items: Omit<CourseTestimonial, 'id' | 'courseId'>[],
) => api.patch<AiCourse>(`/admin/courses/${slug}/testimonials`, { items });

// ─── Admin: Listing Page ──────────────────────────────────────────────────────

export const adminGetListingPage = () =>
  api.get<CoursesListingPage>('/admin/courses/listing-page');

export const adminUpdateListingPage = (data: Partial<CoursesListingPage>) =>
  api.patch<CoursesListingPage>('/admin/courses/listing-page', data);

export const adminUpdateListingWhoCards = (
  items: Omit<CoursesListingWhoCard, 'id' | 'pageId'>[],
) => api.patch<CoursesListingPage>('/admin/courses/listing-page/who-cards', { items });
