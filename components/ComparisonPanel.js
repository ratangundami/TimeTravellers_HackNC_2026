'use client';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function money(value) {
  const v = Number(value || 0);
  const sign = v < 0 ? '+' : '-';
  return `${sign}$${Math.abs(v).toFixed(2)}`;
}

export default function ComparisonPanel({ baseline, current }) {
  const base = baseline?.computed?.metrics || {};
  const cur = current?.computed?.metrics || {};

  const rows = [
    { label: 'Ending Balance', base: base.endingBalance || 0, cur: cur.endingBalance || 0, format: 'currency' },
    { label: 'Lowest Balance', base: base.lowestBalance || 0, cur: cur.lowestBalance || 0, format: 'currency' },
    { label: 'Danger Days', base: base.dangerDays || 0, cur: cur.dangerDays || 0, format: 'number' },
    { label: 'Overdraft Risk', base: (base.overdraftRisk || 0) * 100, cur: (cur.overdraftRisk || 0) * 100, format: 'percent' }
  ];

  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="panel-title">Baseline vs Branch</p>
        <span className="text-xs text-slate-500">Live comparison</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Metric</th>
              <th className="px-3 py-2 text-left font-medium">Main</th>
              <th className="px-3 py-2 text-left font-medium">Selected</th>
              <th className="px-3 py-2 text-left font-medium">Delta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const delta = Number(r.cur) - Number(r.base);
              const positive = delta >= 0;
              const renderValue = (v) => {
                if (r.format === 'percent') return `${Number(v).toFixed(2)}%`;
                if (r.format === 'number') return Number(v).toFixed(0);
                return `$${Number(v).toFixed(2)}`;
              };
              return (
                <tr key={r.label} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium text-slate-700">{r.label}</td>
                  <td className="px-3 py-2 text-slate-600">{renderValue(r.base)}</td>
                  <td className="px-3 py-2 text-slate-900">{renderValue(r.cur)}</td>
                  <td className={`px-3 py-2 font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {r.format === 'percent' ? `${delta.toFixed(2)}%` : r.format === 'number' ? delta.toFixed(0) : money(-delta)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Updated {current?.updatedAt ? fmtDate(current.updatedAt) : 'now'} - Simulation only, not financial advice.
      </p>
    </div>
  );
}
