import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { CreateAuthorDto } from './dto/create-author.dto';

@ApiTags('blog')
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // ─── Public routes ─────────────────────────────────────────────────────────

  @Get('blog/categories')
  listCategories() {
    return this.blogService.listCategories();
  }

  @Get('blog/tags')
  listTags() {
    return this.blogService.listTags();
  }

  @Get('blog/authors')
  listAuthors() {
    return this.blogService.listAuthors();
  }

  @Get('blog')
  listPublished(
    @Query('page') page = '1',
    @Query('limit') limit = '9',
    @Query('search') search?: string,
    @Query('category') categorySlug?: string,
  ) {
    return this.blogService.listPublished({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      categorySlug,
    });
  }

  // NOTE: specific paths above; slug param must be last
  @Get('blog/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  // ─── Admin: categories ─────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/blog/categories')
  adminListCategories() {
    return this.blogService.listCategories();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('admin/blog/categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.blogService.createCategory(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('admin/blog/categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.blogService.removeCategory(id);
  }

  // ─── Admin: tags ───────────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/blog/tags')
  adminListTags() {
    return this.blogService.listTags();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('admin/blog/tags')
  createTag(@Body() dto: CreateTagDto) {
    return this.blogService.createTag(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('admin/blog/tags/:id')
  removeTag(@Param('id') id: string) {
    return this.blogService.removeTag(id);
  }

  // ─── Admin: authors ────────────────────────────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/blog/authors')
  adminListAuthors() {
    return this.blogService.listAuthors();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('admin/blog/authors')
  createAuthor(@Body() dto: CreateAuthorDto) {
    return this.blogService.createAuthor(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('admin/blog/authors/:id')
  updateAuthor(@Param('id') id: string, @Body() dto: Partial<CreateAuthorDto>) {
    return this.blogService.updateAuthor(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('admin/blog/authors/:id')
  removeAuthor(@Param('id') id: string) {
    return this.blogService.removeAuthor(id);
  }

  // ─── Admin: posts (fixed routes before :id) ────────────────────────────────

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/blog')
  adminList(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('status') status?: BlogStatus,
  ) {
    return this.blogService.adminList({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      status,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('admin/blog')
  create(@Body() dto: CreateBlogPostDto) {
    return this.blogService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/blog/:id')
  adminFindOne(@Param('id') id: string) {
    return this.blogService.adminFindOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('admin/blog/:id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('admin/blog/:id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
