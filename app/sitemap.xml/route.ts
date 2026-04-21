import { openingPages } from '@/lib/seo'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-static'

const publicPages = [
  {
    path: '/home',
    priority: '1.0',
    changeFrequency: 'weekly',
  },
  {
    path: '/about-us',
    priority: '0.8',
    changeFrequency: 'monthly',
  },
  {
    path: '/learn',
    priority: '0.8',
    changeFrequency: 'weekly',
  },
  {
    path: '/openings',
    priority: '0.9',
    changeFrequency: 'weekly',
  },
  {
    path: '/support',
    priority: '0.6',
    changeFrequency: 'monthly',
  },
] as const

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSitemapXml() {
  const baseUrl = getSiteUrl()
  const lastMod = new Date().toISOString()

  const urls = [
    ...publicPages,
    ...openingPages.map((opening) => ({
      path: `/openings/${opening.slug}`,
      priority: '0.7',
      changeFrequency: 'monthly',
    })),
  ]

  const entries = urls
    .map(
      ({ path, changeFrequency, priority }) => `  <url>
    <loc>${escapeXml(`${baseUrl}${path}`)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changeFrequency}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`
}

export function GET() {
  return new Response(buildSitemapXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
