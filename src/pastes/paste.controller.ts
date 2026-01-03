import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { CreatePasteDto } from "./dto/paste.dto";
import { PasteService } from "./paste.service";
import { getNow } from "../common/time.util";
import type { Request} from 'express';
import { ConfigService } from "@nestjs/config";
@Controller()
export class PasteController {
    constructor(private readonly pasteService: PasteService,
        private readonly config: ConfigService,
    ) { }

    @Post('api/pastes')
    async create(@Body() dto: CreatePasteDto, @Req() req: Request) {
        const paste = await this.pasteService.create(dto.content, dto.ttl_seconds, dto.max_views);
        return {
            id: paste.id,
            url: `${req.protocol}://${req.get('host')}/p/${paste.id}`,
        };
    }

    @Get('api/pastes/:id')
    async fetch(@Param('id') id: string, @Req() req: Request) {
        const textMode = this.config.get('TEST_MODE') === '1';
        const paste = await this.pasteService.fetch(id, getNow(req, textMode));
        return {
            content: paste.content,
            remaining_views: paste.max_views ? paste.max_views - paste.view_count : null,
            expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null,
        };
    }
}