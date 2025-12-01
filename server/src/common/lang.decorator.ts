import { ContentLang } from '@/constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

function pickCookieLang(req: any): string | undefined {
  // Prefer cookie-parser result
  const fromParsed = req?.cookies?.lang;
  if (typeof fromParsed === 'string' && fromParsed) return fromParsed;

  // Fallback to raw Cookie header parsing
  const cookieHeader: string | undefined = req?.headers?.cookie;
  if (!cookieHeader) return undefined;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [k, v] = pair.trim().split('=');
    if (k === 'lang' && v) return v;
  }
  return undefined;
}

function pickHeaderLang(req: any): string | undefined {
  const headers = req?.headers || {};
  const direct = headers['lang'] || headers['x-lang'];
  if (typeof direct === 'string' && direct) return direct;

  const al: string | undefined = headers['accept-language'];
  if (typeof al === 'string' && al) {
    // e.g. "en-US,en;q=0.9" → "en-US"
    const primary = al.split(',')[0]?.split(';')[0];
    if (primary) return primary;
  }
  return undefined;
}

function pickUaLang(req: any): string | undefined {
  const ua: string | undefined = req?.headers?.['user-agent'];
  if (typeof ua !== 'string' || !ua) return undefined;
  const lower = ua.toLowerCase();
  // Simple heuristics; many UA strings include locale like "zh-cn" or "en-us"
  if (lower.includes('zh-cn') || lower.includes(' chinese ') || lower.includes(' zh ')) {
    return ContentLang.ZH_CN;
  }
  if (lower.includes('en-us') || lower.includes(' english ') || lower.includes(' en ')) {
    return ContentLang.EN_US;
  }
  return undefined;
}

function toContentLang(input?: string): ContentLang | undefined {
  if (!input) return undefined;
  const val = String(input).toLowerCase();
  if (val.startsWith('en')) return ContentLang.EN_US;
  if (val.startsWith('zh')) return ContentLang.ZH_CN;
  if (val === ContentLang.EN_US) return ContentLang.EN_US;
  if (val === ContentLang.ZH_CN) return ContentLang.ZH_CN;
  return undefined;
}

export function getReqLang(req: Request) {
  const fromCookie = toContentLang(pickCookieLang(req));
  if (fromCookie) return fromCookie;

  const fromHeader = toContentLang(pickHeaderLang(req));
  if (fromHeader) return fromHeader;

  const fromUa = toContentLang(pickUaLang(req));
  if (fromUa) return fromUa;

  return ContentLang.ZH_CN;
}

export const Lang = createParamDecorator((_data: unknown, ctx: ExecutionContext): ContentLang => {
  const req = ctx.switchToHttp().getRequest();
  return getReqLang(req);
});

export default Lang;
