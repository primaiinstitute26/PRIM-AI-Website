import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BlogStatus } from '@prisma/client';

export class CreateBlogPostDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  excerpt: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsEnum(BlogStatus)
  status: BlogStatus;

  @IsString()
  categoryId: string;

  @IsString()
  authorId: string;

  @IsArray()
  @IsString({ each: true })
  tagIds: string[];

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsBoolean()
  showAuthor?: boolean;
}
