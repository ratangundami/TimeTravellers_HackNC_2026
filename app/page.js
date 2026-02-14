'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeDollarSign, Link as LinkIcon, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  const pills = useMemo(
    () => ['Timeline replay', 'Branch scenarios', 'Low-balance risk', 'Plaid Sandbox ready'],
    []
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 lg:px-10">
      <header className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-semibold text-brand-600 shadow-soft">
          <Sparkles size={14} />
          Financial Time Machine
        </div>
      </header>

      <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            Rewind your spending. Branch your future.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Connect Plaid Sandbox or use demo data to simulate alternate outcomes from real transactions. Compare
            baseline vs branch like Git commits for money decisions.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span key={pill} className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-medium text-brand-600">
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/dashboard?mode=plaid')}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 disabled:opacity-60"
            >
              <LinkIcon size={16} /> Connect Plaid Sandbox
            </button>
            <button
              onClick={() => {
                setIsConnecting(true);
                router.push('/dashboard?mode=demo');
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
            >
              <BadgeDollarSign size={16} /> Use Demo Data <ArrowRight size={14} />
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-500">Simulation only - not financial advice.</p>
        </div>

        <div className="card p-6">
          <p className="panel-title">How It Works</p>
          <ol className="mt-4 space-y-4 text-sm text-slate-700">
            <li>1. Import 90 days of transactions via Plaid Sandbox.</li>
            <li>2. Create branches by removing/editing/inserting transactions.</li>
            <li>3. Replay balances daily and compare risk metrics instantly.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
