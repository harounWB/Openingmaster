import Link from 'next/link';
import { corePages, footerKeywords } from '@/lib/seo';

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-slate-950 px-4 py-8">
      <div className="container mx-auto max-w-6xl space-y-6 text-sm text-slate-400">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="font-medium text-slate-200">OpeningMaster helps you study openings, analyze PGNs, and train faster.</p>
          <div className="flex flex-wrap gap-4">
            {corePages.map((page) => (
              <Link key={page.href} href={page.href} className="transition-colors hover:text-cyan-200">
                {page.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Popular searches</p>
          <p className="mt-2 font-medium leading-relaxed text-slate-300">{footerKeywords.join(' | ')}</p>
        </div>
      </div>
    </footer>
  );
}
