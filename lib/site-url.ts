const DEFAULT_SITE_URL = 'https://openingmaster.xyz'

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL
  const normalized = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : `https://${rawUrl}`

  return normalized.replace(/\/$/, '')
}
