import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  UpdateCourseHeroDto,
  UpdateWhoItemsDto,
  UpdateModulesDto,
  UpdateToolsDto,
  UpdateOutcomesDto,
  UpdateBeforeAfterDto,
  UpdateEligibilityDto,
  UpdateFaqsDto,
  UpdateTestimonialsDto,
  UpdateListingPageDto,
  UpdateListingWhoCardsDto,
} from './dto/update-course.dto';

@Controller()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ─── Public endpoints ────────────────────────────────────────────────────────

  @Get('courses')
  findAll() {
    return this.coursesService.findAll();
  }

  // Must be before courses/:slug to avoid NestJS treating 'listing-page' as a slug
  @Get('courses/listing-page')
  getListingPage() {
    return this.coursesService.findListingPage();
  }

  @Get('courses/:slug')
  findOne(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  // ─── Admin endpoints (JWT required) ─────────────────────────────────────────

  // Must be before admin/courses/:slug
  @UseGuards(JwtAuthGuard)
  @Get('admin/courses/listing-page')
  adminGetListingPage() {
    return this.coursesService.findListingPage();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/listing-page')
  updateListingPage(@Body() dto: UpdateListingPageDto) {
    return this.coursesService.updateListingPage(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/listing-page/who-cards')
  updateListingWhoCards(@Body() dto: UpdateListingWhoCardsDto) {
    return this.coursesService.updateListingWhoCards(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/courses/:slug')
  adminFindOne(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug')
  updateHero(@Param('slug') slug: string, @Body() dto: UpdateCourseHeroDto) {
    return this.coursesService.updateHero(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/who-items')
  updateWhoItems(@Param('slug') slug: string, @Body() dto: UpdateWhoItemsDto) {
    return this.coursesService.updateWhoItems(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/modules')
  updateModules(@Param('slug') slug: string, @Body() dto: UpdateModulesDto) {
    return this.coursesService.updateModules(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/tools')
  updateTools(@Param('slug') slug: string, @Body() dto: UpdateToolsDto) {
    return this.coursesService.updateTools(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/outcomes')
  updateOutcomes(@Param('slug') slug: string, @Body() dto: UpdateOutcomesDto) {
    return this.coursesService.updateOutcomes(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/before-after')
  updateBeforeAfter(
    @Param('slug') slug: string,
    @Body() dto: UpdateBeforeAfterDto,
  ) {
    return this.coursesService.updateBeforeAfter(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/eligibility')
  updateEligibility(
    @Param('slug') slug: string,
    @Body() dto: UpdateEligibilityDto,
  ) {
    return this.coursesService.updateEligibility(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/faqs')
  updateFaqs(@Param('slug') slug: string, @Body() dto: UpdateFaqsDto) {
    return this.coursesService.updateFaqs(slug, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/courses/:slug/testimonials')
  updateTestimonials(
    @Param('slug') slug: string,
    @Body() dto: UpdateTestimonialsDto,
  ) {
    return this.coursesService.updateTestimonials(slug, dto);
  }
}
