'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, Home, Fuel, Film, Zap, Landmark, Wallet } from 'lucide-react';

const iconMap = {
  Groceries: ShoppingBag,
  Housing: Home,
  Transport: Fuel,
  Entertainment: Film,
  Utilities: Zap,
  Income: Landmark,
  Uncategorized: Wallet
};

function getIcon(category = []) {
  const key = category?.[0] || 'Uncategorized';
  return iconMap[key] || Wallet;
}

function amountColor(amount) {
  return amount < 0 ? 'text-emerald-600' : 'text-slate-800';
}

export default function TransactionTimeline({
  transactions = [],
  scrubIndex = 0,
  onScrub,
  onCreateRemove,
  onCreateEdit
}) {
  const max = Math.max(0, transactions.length - 1);
  const visible = transactions.slice(0, scrubIndex + 1);

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="panel-title">Transaction Timeline</p>
        <span className="text-xs text-slate-500">Scrub through history</span>
      </div>

      <div className="mb-5">
        <input
          type="range"
          min={0}
          max={max}
          value={Math.min(scrubIndex, max)}
          onChange={(e) => onScrub?.(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-blue-100"
        />
        <div className="mt-1 text-xs text-slate-500">
          Showing {visible.length} / {transactions.length} transactions
        </div>
      </div>

      <div className="max-h-[460px] overflow-auto pr-1">
        <AnimatePresence>
          {visible.map((txn, idx) => {
            const Icon = getIcon(txn.category);
            return (
              <motion.div
                key={String(txn._id || txn.plaidTransactionId || idx)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative ml-4 border-l border-blue-100 pb-4 pl-6"
              >
                <span className="absolute -left-[9px] top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-100 bg-white">
                  <Icon size={10} className="text-brand-500" />
                </span>
                <div className="rounded-xl border border-slate-100 bg-white p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{txn.merchant}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{txn.date} - {(txn.category || ['Uncategorized']).join(' / ')}</p>
                    </div>
                    <p className={`text-sm font-bold ${amountColor(txn.amount)}`}>
                      {txn.amount < 0 ? '+' : '-'}${Math.abs(Number(txn.amount)).toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onCreateRemove?.(txn)}
                      className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                    >
                      Branch: Remove
                    </button>
                    <button
                      onClick={() => onCreateEdit?.(txn)}
                      className="rounded-lg border border-blue-200 px-2 py-1 text-xs font-medium text-brand-600 hover:bg-blue-50"
                    >
                      Branch: Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
