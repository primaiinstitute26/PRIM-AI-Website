import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { CreateAuthorDto } from './dto/create-author.dto';

const POST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImageUrl: true,
  status: true,
  showAuthor: true,
  readTimeMin: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true, color: true } },
  author: { select: { id: true, name: true, designation: true, avatarUrl: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
};

function calcReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // ─── Public ────────────────────────────────────────────────────────────────

  async listPublished(opts: {
    page: number;
    limit: number;
    search?: string;
    categorySlug?: string;
  }) {
    const { page, limit, search, categorySlug } = opts;
    const skip = (page - 1) * limit;

    const where = {
      status: BlogStatus.PUBLISHED,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(categorySlug && { category: { slug: categorySlug } }),
    };

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where,
        select: POST_SELECT,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { posts: posts.map(flattenTags), total, page, limit };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug, status: BlogStatus.PUBLISHED },
      select: { ...POST_SELECT, content: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return flattenTags(post);
  }

  async listCategories() {
    return this.prisma.blogCategory.findMany({
      select: { id: true, name: true, slug: true, color: true, _count: { select: { posts: { where: { status: BlogStatus.PUBLISHED } } } } },
      orderBy: { name: 'asc' },
    });
  }

  async listTags() {
    return this.prisma.blogTag.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    });
  }

  async listAuthors() {
    return this.prisma.blogAuthor.findMany({
      select: { id: true, name: true, designation: true, bio: true, avatarUrl: true },
      orderBy: { name: 'asc' },
    });
  }

  // ─── Admin ─────────────────────────────────────────────────────────────────

  async adminList(opts: { page: number; limit: number; search?: string; status?: BlogStatus }) {
    const { page, limit, search, status } = opts;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.blogPost.findMany({
        where,
        select: POST_SELECT,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return { posts: posts.map(flattenTags), total, page, limit };
  }

  async adminFindOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      select: { ...POST_SELECT, content: true },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return flattenTags(post);
  }

  async create(dto: CreateBlogPostDto) {
    const { tagIds, publishedAt, ...rest } = dto;
    const readTimeMin = calcReadTime(rest.content);

    return flattenTags(
      await this.prisma.blogPost.create({
        data: {
          ...rest,
          readTimeMin,
          publishedAt: dto.status === BlogStatus.PUBLISHED
            ? (publishedAt ? new Date(publishedAt) : new Date())
            : null,
          tags: { create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) },
        },
        select: { ...POST_SELECT, content: true },
      }),
    );
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog post not found');

    const { tagIds, publishedAt, content, ...rest } = dto;
    const readTimeMin = content ? calcReadTime(content) : undefined;

    const wasPublished = existing.status === BlogStatus.PUBLISHED;
    const nowPublished = dto.status === BlogStatus.PUBLISHED;
    const newPublishedAt = nowPublished && !wasPublished
      ? (publishedAt ? new Date(publishedAt) : new Date())
      : dto.status === BlogStatus.DRAFT
      ? null
      : undefined;

    return flattenTags(
      await this.prisma.blogPost.update({
        where: { id },
        data: {
          ...rest,
          ...(content !== undefined && { content }),
          ...(readTimeMin !== undefined && { readTimeMin }),
          ...(newPublishedAt !== undefined && { publishedAt: newPublishedAt }),
          ...(tagIds && {
            tags: {
              deleteMany: {},
              create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
            },
          }),
        },
        select: { ...POST_SELECT, content: true },
      }),
    );
  }

  async remove(id: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Blog post not found');
    await this.prisma.blogPost.delete({ where: { id } });
    return { deleted: true };
  }

  // ─── Category CRUD ─────────────────────────────────────────────────────────

  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.blogCategory.create({ data: dto });
  }

  async removeCategory(id: string) {
    await this.prisma.blogCategory.delete({ where: { id } });
    return { deleted: true };
  }

  // ─── Tag CRUD ──────────────────────────────────────────────────────────────

  async createTag(dto: CreateTagDto) {
    return this.prisma.blogTag.create({ data: dto });
  }

  async removeTag(id: string) {
    await this.prisma.blogTag.delete({ where: { id } });
    return { deleted: true };
  }

  // ─── Author CRUD ───────────────────────────────────────────────────────────

  async createAuthor(dto: CreateAuthorDto) {
    return this.prisma.blogAuthor.create({ data: dto });
  }

  async updateAuthor(id: string, dto: Partial<CreateAuthorDto>) {
    return this.prisma.blogAuthor.update({ where: { id }, data: dto });
  }

  async removeAuthor(id: string) {
    await this.prisma.blogAuthor.delete({ where: { id } });
    return { deleted: true };
  }
}

// Strip the nested { tag: ... } shape returned from BlogPostTag join
function flattenTags<T extends { tags?: { tag: unknown }[] }>(post: T) {
  const { tags, ...rest } = post as T & { tags?: { tag: unknown }[] };
  return { ...rest, tags: (tags ?? []).map((pt) => pt.tag) };
}
