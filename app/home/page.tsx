import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, Layers3, Sparkles, Target } from 'lucide-react';
import { Header } from '@/components/Header';
import { corePages, featurePages, learningTopics, openingPages } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Chess Opening Trainer - Learn & Practice Openings Fast',
  description: 'Free chess opening trainer and PGN analyzer for learning openings faster, spotting mistakes, and building a stronger repertoire.',
};

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#060b14] text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_28%),linear-gradient(180deg,#050913_0%,#060b14_40%,#070d18_100%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-[24rem] -z-10 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <Header />

      <section className="border-b border-white/6">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12 lg:py-14">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur sm:p-7 lg:p-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                Chess Opening Trainer and Free PGN Analyzer
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Chess opening training that feels focused, modern, and easier to live in.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                OpeningMaster helps you train openings move by move, analyze PGN files, and turn real game mistakes into better habits without the interface feeling oversized or flat.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                >
                  Analyze a PGN
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/training"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-cyan-400/30 hover:bg-white/[0.07]"
                >
                  Start Training
                </Link>
                <Link
                  href="/openings"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-300/15"
                >
                  Explore Openings
                </Link>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: BarChart3,
                    label: 'PGN analysis',
                    value: 'Fast review',
                    className: 'rounded-2xl border border-white/8 bg-gradient-to-br from-cyan-400/20 to-cyan-500/5 p-3.5',
                  },
                  {
                    icon: Target,
                    label: 'Training focus',
                    value: 'Your repertoire',
                    className: 'rounded-2xl border border-white/8 bg-gradient-to-br from-emerald-400/20 to-emerald-500/5 p-3.5',
                  },
                  {
                    icon: Layers3,
                    label: 'Opening library',
                    value: 'Structured study',
                    className: 'rounded-2xl border border-white/8 bg-gradient-to-br from-amber-400/20 to-amber-500/5 p-3.5',
                  },
                ].map(({ icon: Icon, label, value, className }) => (
                  <div key={label} className={className}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-white/90">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</p>
                        <p className="mt-1 text-xs font-medium text-white">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 shadow-[0_24px_80px_rgba(2,8,23,0.28)] backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quick overview</p>
                  <h2 className="mt-2 text-base font-semibold text-white">A calmer path from analysis to practice</h2>
                </div>
                <div className="rounded-full border border-cyan-400/15 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-100">
                  3 core flows
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {featurePages.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5 transition-colors hover:border-cyan-400/20 hover:bg-white/[0.05]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-400/20 via-sky-400/15 to-emerald-400/10 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="text-xs font-semibold text-white">{feature.title}</h2>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12 lg:py-14">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Core Pages</p>
          <h2 className="mt-3 font-display text-xl font-semibold text-white sm:text-2xl">Start with the part you need most</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
            The main pages stay focused so you can move straight into analysis, training, or account setup without hunting around.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {corePages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{page.label}</p>
                <span className="text-xs text-slate-500 transition-colors group-hover:text-slate-300">Open</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-white sm:text-lg">{page.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:pb-14 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Learning / Blog</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-white">Chess opening study for beginners and improvers</h2>
            <p className="mt-3 text-slate-400">
              These learning topics are written to help players understand opening study, game analysis, and rating improvement without making the process feel overwhelming.
            </p>
            <div className="mt-6 space-y-3">
              {learningTopics.map((topic) => (
                <div key={topic.title} className="rounded-2xl border border-white/8 bg-slate-950/35 p-4 transition-colors hover:border-emerald-400/20 hover:bg-slate-950/50">
                  <h3 className="text-sm font-semibold text-white">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{topic.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200">
                Open the learning hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 sm:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Opening-Specific Pages</p>
            <h2 className="mt-3 font-display text-xl font-semibold text-white">Make your repertoire searchable</h2>
            <p className="mt-3 text-slate-400">
              Opening pages help players find exactly what they want to study, from the Sicilian Defense to the Queen's Gambit.
            </p>
            <div className="mt-6 space-y-3">
              {openingPages.map((opening) => (
                <Link
                  key={opening.slug}
                  href="/openings"
                  className="block rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3 transition-colors hover:border-amber-300/20 hover:bg-slate-950/50"
                >
                  <div className="text-sm font-medium text-white">{opening.title}</div>
                  <div className="mt-1 text-xs text-slate-400">{opening.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
