import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

export type MediaVariant = 'cover' | 'content' | 'avatar';

interface VariantSpec {
  width: number;
  height?: number;
  fit: 'cover' | 'inside';
}

const VARIANT_SPECS: Record<MediaVariant, VariantSpec> = {
  cover:   { width: 1600, height: 900, fit: 'cover' },
  content: { width: 1200, fit: 'inside' },
  avatar:  { width: 200, height: 200, fit: 'cover' },
};

export interface UploadResult {
  url: string;
  originalSizeKb: number;
  convertedSizeKb: number;
  width: number;
  height: number;
}

@Injectable()
export class MediaService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly cdnUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = config.getOrThrow<string>('DO_SPACES_BUCKET');
    this.cdnUrl = config.getOrThrow<string>('DO_SPACES_CDN_URL');

    this.s3 = new S3Client({
      endpoint: config.getOrThrow<string>('DO_SPACES_ENDPOINT'),
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.getOrThrow<string>('DO_SPACES_KEY'),
        secretAccessKey: config.getOrThrow<string>('DO_SPACES_SECRET'),
      },
      forcePathStyle: false,
    });
  }

  async upload(
    buffer: Buffer,
    originalName: string,
    variant: MediaVariant = 'content',
  ): Promise<UploadResult> {
    const spec = VARIANT_SPECS[variant];
    const originalSizeKb = Math.round(buffer.length / 1024);

    let pipeline = sharp(buffer).rotate();

    if (spec.height) {
      pipeline = pipeline.resize(spec.width, spec.height, { fit: spec.fit });
    } else {
      pipeline = pipeline.resize(spec.width, undefined, { fit: spec.fit, withoutEnlargement: true });
    }

    const { data: webpBuffer, info } = await pipeline
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });

    const convertedSizeKb = Math.round(webpBuffer.length / 1024);

    const key = this.buildKey(originalName, variant);

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: webpBuffer,
        ContentType: 'image/webp',
        ACL: 'public-read' as never,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );

    return {
      url: `${this.cdnUrl.replace(/\/$/, '')}/${key}`,
      originalSizeKb,
      convertedSizeKb,
      width: info.width,
      height: info.height,
    };
  }

  private buildKey(originalName: string, variant: MediaVariant): string {
    const base = originalName
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 60);
    const ts = Date.now();
    return `blog/${variant}/${ts}-${base}.webp`;
  }

  validateMimeType(mimetype: string): void {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${mimetype}. Allowed: jpg, png, webp, gif`,
      );
    }
  }
}
