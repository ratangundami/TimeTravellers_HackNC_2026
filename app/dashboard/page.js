'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { GitBranchPlus, PlusCircle, RefreshCcw } from 'lucide-react';
import { usePlaidLink } from 'react-plaid-link';
import BranchTree from '@/components/BranchTree';
import BranchTreeSkeleton from '@/components/BranchTreeSkeleton';
import TransactionTimeline from '@/components/TransactionTimeline';
import BalanceChart from '@/components/BalanceChart';
import ScenarioModal from '@/components/ScenarioModal';
import ComparisonPanel from '@/components/ComparisonPanel';

function PlaidConnect({ onLinked }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetch('/api/plaid/create_link_token', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => setToken(d.link_token || null))
      .catch(() => setToken(null));
  }, []);

  const onSuccess = useCallback(
    async (public_token) => {
      await fetch('/api/plaid/exchange_public_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token })
      });
      onLinked?.();
    },
    [onLinked]
  );

  const { open, ready } = usePlaidLink({ token, onSuccess });

  return (
    <button
      onClick={() => open()}
      disabled={!ready || !token}
      className="rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-blue-50 disabled:opacity-50"
    >
      Connect Plaid Sandbox
    </button>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'demo';

  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [scrubIndex, setScrubIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [createBranchParentId, setCreateBranchParentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);

    await fetch('/api/plaid/sync', { method: 'POST' });
    const branchesRes = await fetch('/api/branches');
    const branchJson = await branchesRes.json();

    const all = branchJson.branches || [];
    const baseline = all.find((b) => b.scenario?.type === 'baseline');
    setBranches(all);
    setSelectedBranchId((prev) => prev || baseline?._id || all[0]?._id || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const baseline = useMemo(() => branches.find((b) => b.scenario?.type === 'baseline') || null, [branches]);
  const selected = useMemo(
    () => branches.find((b) => String(b._id) === String(selectedBranchId)) || baseline,
    [branches, selectedBranchId, baseline]
  );
  const timeline = selected?.computed?.transactionTimeline || [];
  const chartData = selected?.computed?.balanceSeries || [];

  async function createBranch(payload) {
    if (!selected) return;
    const parentBranchId = payload.parentBranchId || createBranchParentId || selected._id;

    await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, parentBranchId })
    });

    setModalOpen(false);
    setSelectedTxn(null);
    setCreateBranchParentId(null);
    await loadData();
  }

  async function createRemoveBranch(txn) {
    await createBranch({
      parentBranchId: selected?._id,
      name: `Branch: Skip ${txn.merchant}`,
      scenario: {
        type: 'remove_transaction',
        params: { transactionId: txn._id || txn.plaidTransactionId, merchant: txn.merchant }
      }
    });
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Financial Time Machine</h1>
          <p className="text-sm text-slate-600">
            Mode: {mode === 'plaid' ? 'Plaid Sandbox' : 'Demo Data'} - Simulation only, not financial advice.
          </p>
        </div>
        <div className="flex gap-2">
          {mode === 'plaid' ? <PlaidConnect onLinked={loadData} /> : null}
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:text-brand-600"
          >
            <RefreshCcw size={14} /> Sync
          </button>
          <button
            onClick={() => {
              setSelectedTxn(null);
              setCreateBranchParentId(selected?._id || null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            <GitBranchPlus size={14} /> New Purchase Branch
          </button>
        </div>
      </motion.header>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          {loading ? (
            <BranchTreeSkeleton />
          ) : (
            <BranchTree
              branches={branches}
              selectedBranchId={selected?._id}
              onSelectBranch={setSelectedBranchId}
              onCreateBranch={(parentBranchId) => {
                setSelectedBranchId(parentBranchId);
                setSelectedTxn(null);
                setCreateBranchParentId(parentBranchId);
                setModalOpen(true);
              }}
            />
          )}
          <BalanceChart data={chartData} />
          <TransactionTimeline
            transactions={timeline}
            scrubIndex={Math.min(scrubIndex, Math.max(0, timeline.length - 1))}
            onScrub={setScrubIndex}
            onCreateRemove={createRemoveBranch}
            onCreateEdit={(txn) => {
              setSelectedTxn(txn);
              setCreateBranchParentId(selected?._id || null);
              setModalOpen(true);
            }}
          />
        </div>

        <div className="space-y-5">
          <ComparisonPanel baseline={baseline} current={selected} />
          <div className="card p-5">
            <p className="panel-title">Branch Actions</p>
            <div className="mt-3 grid gap-2 text-sm">
              <button
                onClick={() => {
                  setSelectedTxn(null);
                  setCreateBranchParentId(selected?._id || null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-left hover:border-brand-200 hover:text-brand-600"
              >
                <PlusCircle size={15} /> Insert hypothetical transaction
              </button>
            </div>
          </div>
        </div>
      </section>

      <ScenarioModal
        open={modalOpen}
        selectedTxn={selectedTxn}
        onClose={() => {
          setModalOpen(false);
          setSelectedTxn(null);
          setCreateBranchParentId(null);
        }}
        onSubmit={createBranch}
      />
    </main>
  );
}
