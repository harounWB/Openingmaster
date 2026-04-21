import { openingPages } from '@/lib/seo'

export const dynamic = 'force-static'

const staticUrls = [
  'https://openingmaster.xyz/home',
  'https://openingmaster.xyz/about-us',
  'https://openingmaster.xyz/learn',
  'https://openingmaster.xyz/openings',
  'https://openingmaster.xyz/support',
]

function buildSitemapXml() {
  const lastMod = '2026-04-21'

  const openingUrls = openingPages.map((opening) => `https://openingmaster.xyz/openings/${opening.slug}`)
  const urls = [...staticUrls, ...openingUrls]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>
`
}

export function GET() {
  return new Response(buildSitemapXml(), {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
