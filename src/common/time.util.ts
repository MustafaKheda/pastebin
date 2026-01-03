
import { Request } from 'express';

export function getNow(req: Request, testMode: boolean = false): number {
  if (testMode) {
    const header = req.headers['x-test-now-ms'];
    if (header) return Number(header);
  }
  return Date.now();
}
