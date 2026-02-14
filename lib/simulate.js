const DEFAULT_THRESHOLD = Number(process.env.LOW_BALANCE_THRESHOLD || 100);

function toISODate(value) {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function addDays(dateStr, amount) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + amount);
  return d.toISOString().slice(0, 10);
}

function sumDaily(transactions) {
  return transactions.reduce((acc, txn) => {
    const day = toISODate(txn.date);
    const delta = Number(txn.amount) * -1;
    acc[day] = (acc[day] || 0) + delta;
    return acc;
  }, {});
}

export function applyScenario(baselineTransactions, scenario = null) {
  if (!scenario || !scenario.type) return [...baselineTransactions];

  const cloned = baselineTransactions.map((txn) => ({ ...txn }));

  if (scenario.type === 'remove_transaction') {
    const targetId = scenario.params?.transactionId;
    return cloned.filter((txn) => String(txn._id || txn.plaidTransactionId) !== String(targetId));
  }

  if (scenario.type === 'insert_transaction') {
    const inserted = {
      _id: `scenario-${Date.now()}`,
      plaidTransactionId: `scenario-${Date.now()}`,
      accountId: scenario.params?.accountId || cloned[0]?.accountId,
      date: scenario.params?.date || toISODate(new Date()),
      amount: Number(scenario.params?.amount || 0),
      merchant: scenario.params?.merchant || 'Hypothetical Purchase',
      category: [scenario.params?.category || 'Scenario'],
      pending: false,
      isScenario: true
    };
    cloned.push(inserted);
    return cloned;
  }

  if (scenario.type === 'edit_transaction') {
    const targetId = String(scenario.params?.transactionId);
    return cloned.map((txn) => {
      const id = String(txn._id || txn.plaidTransactionId);
      if (id !== targetId) return txn;
      return {
        ...txn,
        amount: scenario.params?.amount != null ? Number(scenario.params.amount) : txn.amount,
        date: scenario.params?.date || txn.date,
        category: scenario.params?.category ? [scenario.params.category] : txn.category,
        merchant: scenario.params?.merchant || txn.merchant
      };
    });
  }

  return cloned;
}

export function simulateBranch({
  baselineTransactions,
  scenario,
  openingBalance = 2500,
  threshold = DEFAULT_THRESHOLD,
  rangeStart,
  rangeEnd
}) {
  const transactionTimeline = applyScenario(baselineTransactions, scenario).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!transactionTimeline.length) {
    return {
      metrics: { lowestBalance: openingBalance, dangerDays: 0, overdraftRisk: 0, totalDays: 1, endingBalance: openingBalance },
      dailyBalances: [{ date: toISODate(new Date()), balance: openingBalance }],
      transactionTimeline: []
    };
  }

  const start = rangeStart || toISODate(transactionTimeline[0].date);
  const end = rangeEnd || toISODate(new Date());
  const dailySums = sumDaily(transactionTimeline);

  let cursor = start;
  let running = Number(openingBalance);
  let lowest = running;
  let dangerDays = 0;
  const dailyBalances = [];
  let totalDays = 0;

  while (cursor <= end) {
    running += dailySums[cursor] || 0;
    lowest = Math.min(lowest, running);
    if (running < threshold) dangerDays += 1;

    dailyBalances.push({ date: cursor, balance: Number(running.toFixed(2)) });
    totalDays += 1;
    cursor = addDays(cursor, 1);
  }

  const overdraftRisk = totalDays ? dangerDays / totalDays : 0;

  return {
    metrics: {
      lowestBalance: Number(lowest.toFixed(2)),
      dangerDays,
      totalDays,
      overdraftRisk: Number(overdraftRisk.toFixed(4)),
      endingBalance: Number(running.toFixed(2))
    },
    dailyBalances,
    transactionTimeline
  };
}

export function getScenarioLabel(scenario) {
  if (!scenario?.type) return 'Main';
  if (scenario.type === 'remove_transaction') return `Skip: ${scenario.params?.merchant || 'Purchase'}`;
  if (scenario.type === 'insert_transaction') return `Add: ${scenario.params?.merchant || 'Future Purchase'}`;
  if (scenario.type === 'edit_transaction') return `Edit: ${scenario.params?.merchant || 'Transaction'}`;
  return 'Scenario Branch';
}

/* Unit-test style usage examples:

const baseline = [
  { _id: '1', date: '2026-01-01', amount: -1000, merchant: 'Payroll' },
  { _id: '2', date: '2026-01-02', amount: 300, merchant: 'Rent' }
];

simulateBranch({ baselineTransactions: baseline, openingBalance: 1000 });

simulateBranch({
  baselineTransactions: baseline,
  scenario: { type: 'remove_transaction', params: { transactionId: '2' } },
  openingBalance: 1000
});

simulateBranch({
  baselineTransactions: baseline,
  scenario: {
    type: 'insert_transaction',
    params: { date: '2026-01-03', amount: 120, merchant: 'New Shoes', category: 'Shopping' }
  },
  openingBalance: 1000
});
*/
