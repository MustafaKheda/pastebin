
import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { RedisService } from 'src/redis/redis.service';

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
    console.log('Created paste', paste);
    return paste;
  }

  async fetch(id: string, now: number) {
    const client = this.redis.getClient();
    const key = this.key(id)
    const raw = await client.get(key);
    if (!raw) throw new NotFoundException();

    const paste: Paste = JSON.parse(raw);
    if (!paste) throw new NotFoundException();
    console.log('Fetched paste', paste);
    console.log('x-time-ms', id, new Date(now).toISOString());
    console.log('Checking expiration', paste.expires_at && new Date(paste.expires_at).toISOString());
    console.log('Current time', Date.now());
    if (paste.expires_at && now > paste.expires_at) {
      throw new NotFoundException();
    }

    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      throw new NotFoundException();
    }

    paste.view_count += 1;

    await client.set(key, JSON.stringify(paste));


    return paste;
  }
}
