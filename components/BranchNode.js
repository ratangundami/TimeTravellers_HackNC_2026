'use client';

import { motion } from 'framer-motion';
import {
  CircleMinus,
  CirclePlus,
  Edit3,
  GitCommitHorizontal,
  GitBranchPlus,
  ShieldAlert,
  Wallet
} from 'lucide-react';

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function getScenarioMeta(scenario) {
  const type = scenario?.type || 'baseline';
  const params = scenario?.params || {};

  if (type === 'remove_transaction') {
    return {
      icon: CircleMinus,
      summary: `Removed: ${params.merchant || 'Transaction'}`,
      tone: 'text-rose-600'
    };
  }

  if (type === 'insert_transaction') {
    return {
      icon: CirclePlus,
      summary: `Added: ${params.merchant || 'Purchase'} ${params.amount != null ? `$${Number(params.amount).toFixed(0)}` : ''}`.trim(),
      tone: 'text-emerald-600'
    };
  }

  if (type === 'edit_transaction') {
    return {
      icon: Edit3,
      summary: `Edited: ${params.merchant || 'Transaction'}`,
      tone: 'text-amber-600'
    };
  }

  return { icon: GitCommitHorizontal, summary: 'Main baseline', tone: 'text-brand-600' };
}

export default function BranchNode({
  branch,
  isSelected,
  onSelect,
  onCreateBranch,
  x,
  y
}) {
  const meta = getScenarioMeta(branch.scenario);
  const MetaIcon = meta.icon;
  const metrics = branch.computed?.metrics || {};

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onSelect}
        className={`group relative w-[280px] rounded-2xl border bg-white/95 p-3 text-left shadow-sm transition ${
          isSelected
            ? 'border-brand-500 shadow-[0_10px_28px_rgba(37,99,235,0.2)] ring-2 ring-brand-100'
            : 'border-slate-200 hover:border-blue-200 hover:shadow-[0_8px_18px_rgba(15,23,42,0.1)]'
        }`}
      >
        <span
          className={`absolute -left-7 top-3 inline-flex h-4 w-4 items-center justify-center rounded-full border ${
            isSelected ? 'border-brand-400 bg-brand-500' : 'border-slate-300 bg-white'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : 'bg-slate-400'}`} />
        </span>

        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="truncate text-sm font-semibold text-slate-900">{branch.name || 'Untitled Branch'}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : 'No date'}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-semibold ${meta.tone}`}>
            <MetaIcon size={12} />
            {branch.scenario?.type === 'baseline' ? 'Main' : 'Scenario'}
          </span>
        </div>

        <p className="mt-2 truncate text-xs text-slate-600">{meta.summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {metrics.lowestBalance != null ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
              <Wallet size={11} />
              Low {formatMoney(metrics.lowestBalance)}
            </span>
          ) : null}
          {metrics.overdraftRisk != null ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-700">
              <ShieldAlert size={11} />
              Risk {(Number(metrics.overdraftRisk) * 100).toFixed(1)}%
            </span>
          ) : null}
        </div>

        {isSelected ? (
          <div className="mt-3 border-t border-slate-100 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateBranch?.();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-600 hover:bg-brand-100"
            >
              <GitBranchPlus size={12} />
              Create Branch From Here
            </button>
          </div>
        ) : null}
      </motion.button>
    </motion.div>
  );
}
