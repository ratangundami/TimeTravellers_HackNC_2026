'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

export default function BalanceChart({ data = [] }) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="panel-title">Balance Replay</p>
        <span className="text-xs text-slate-500">Daily simulated balance</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v)}`} width={70} />
            <Tooltip formatter={(v) => money(v)} labelClassName="text-xs" />
            <Line type="monotone" dataKey="balance" stroke="#2076ff" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
