'use client';

export default function BranchTreeSkeleton() {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-2.5 w-52 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="relative h-[360px] overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/60 p-4">
        <div className="absolute left-8 top-10 h-0.5 w-48 bg-blue-100" />
        <div className="absolute left-8 top-10 h-16 w-0.5 bg-blue-100" />
        <div className="absolute left-56 top-[104px] h-0.5 w-48 bg-blue-100" />

        <div className="absolute left-10 top-8 h-16 w-64 animate-pulse rounded-2xl border border-slate-200 bg-white/90" />
        <div className="absolute left-[230px] top-[96px] h-16 w-64 animate-pulse rounded-2xl border border-slate-200 bg-white/90" />
        <div className="absolute left-[230px] top-[188px] h-16 w-64 animate-pulse rounded-2xl border border-slate-200 bg-white/90" />
      </div>
    </div>
  );
}
