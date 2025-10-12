// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export const GET: RequestHandler = async () => {
  // 여기에 사이트의 모든 URL을 넣습니다.
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    // 다른 페이지들 추가
  ];

  // Sitemap 생성
  const stream = new SitemapStream({ hostname: 'http://localhost:5173' }); // 배포 URL로 변경
  const buffer = await streamToPromise(Readable.from(links).pipe(stream));
  const xmlString = buffer.toString();

  return new Response(xmlString, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
