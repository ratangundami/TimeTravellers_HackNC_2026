'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const initialState = {
  name: '',
  type: 'insert_transaction',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  merchant: '',
  category: 'Scenario'
};

export default function ScenarioModal({ open, onClose, onSubmit, selectedTxn }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!selectedTxn) return;
    setForm((f) => ({
      ...f,
      name: `Branch: Edit ${selectedTxn.merchant}`,
      type: 'edit_transaction',
      amount: String(selectedTxn.amount),
      date: selectedTxn.date,
      merchant: selectedTxn.merchant,
      category: selectedTxn.category?.[0] || 'Scenario'
    }));
  }, [selectedTxn]);

  useEffect(() => {
    if (!open) setForm(initialState);
  }, [open]);

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name || `Branch: ${form.type}`,
      scenario: {
        type: form.type,
        params: {
          transactionId: selectedTxn?._id || selectedTxn?.plaidTransactionId,
          amount: Number(form.amount),
          date: form.date,
          merchant: form.merchant,
          category: form.category
        }
      }
    };

    onSubmit?.(payload);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/35 p-4"
        >
          <motion.form
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-soft"
          >
            <h3 className="text-lg font-bold text-slate-900">Create Scenario Branch</h3>
            <p className="mt-1 text-xs text-slate-500">Insert, edit, or hypothetically adjust a purchase.</p>

            <div className="mt-4 grid gap-3">
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Branch name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <select
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="insert_transaction">Insert Transaction</option>
                <option value="edit_transaction">Edit Transaction</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <input
                  type="date"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Merchant"
                value={form.merchant}
                onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              />
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                Create Branch
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
