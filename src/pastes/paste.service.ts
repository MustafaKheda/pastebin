
import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RedisService } from '../redis/redis.service';

interface Paste {
  id: string;
  content: string;
  created_at: number;
  expires_at: number | null;
  max_views: number | null;
  view_count: number;
}

@Injectable()
export class PasteService {
  constructor(private readonly redis: RedisService) { }

  private key(id: string) {
    return `paste:${id}`;
  }

  async create(content: string, ttlSeconds?: number,
    maxViews?: number,) {
    const now = Date.now();
    const id = nanoid(8);

    const paste: Paste = {
      id,
      content,
      created_at: now,
      expires_at: ttlSeconds ? now + ttlSeconds * 1000 : null,
      max_views: maxViews ?? null,
      view_count: 0,
    };
    const client = this.redis.getClient();
    const key = this.key(id);

    await client.set(key, JSON.stringify(paste));
    if (ttlSeconds) {
      await client.expire(key, ttlSeconds + 60);
    }
    return paste;
  }

  async fetch(id: string, now: number) {
    const client = this.redis.getClient();
    const key = this.key(id)
    const raw = await client.get(key);
    if (!raw) throw new NotFoundException({
      message: 'Paste not found',
      reason: 'NOT_FOUND',
    });

    const paste: Paste = JSON.parse(raw);
    if (!paste) throw new NotFoundException(
      {
        message: 'Paste not found',
        reason: 'NOT_FOUND',
      }
    );

    if (paste.expires_at && now > paste.expires_at) {
      throw new NotFoundException({
        message: 'Paste has expired',
        reason: 'TTL_EXPIRED',
      });
    }

    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      throw new NotFoundException({
        message: 'Paste view limit exceeded',
        reason: 'MAX_VIEWS_EXCEEDED',
      });
    }

    paste.view_count += 1;

    await client.set(key, JSON.stringify(paste));


    return paste;
  }
}
