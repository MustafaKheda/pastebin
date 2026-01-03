import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class ViewController {
    @Get('/')
    home(@Res() res: Response) {
        res.sendFile(join(process.cwd(), 'public', 'index.html'));
    }

    @Get('/p/:id')
    viewPaste(@Param('id') id: string, @Res() res: Response) {
        res.sendFile(join(process.cwd(), 'public', 'view.html'));
    }
}