export const DEMO_USER_ID = process.env.DEMO_USER_ID || 'demo-user-001';

export const demoAccounts = [
  {
    plaidAccountId: 'demo-checking-1',
    name: 'Main Checking',
    type: 'depository',
    subtype: 'checking',
    balances: { available: 2450, current: 2450, limit: null, iso_currency_code: 'USD' }
  }
];

export const demoTransactions = [
  { plaidTransactionId: 'txn-001', accountId: 'demo-checking-1', date: '2026-01-01', amount: -3200, merchant: 'Acme Payroll', category: ['Income'], pending: false },
  { plaidTransactionId: 'txn-002', accountId: 'demo-checking-1', date: '2026-01-03', amount: 95.4, merchant: 'Whole Foods', category: ['Groceries'], pending: false },
  { plaidTransactionId: 'txn-003', accountId: 'demo-checking-1', date: '2026-01-05', amount: 67.12, merchant: 'Shell', category: ['Transport'], pending: false },
  { plaidTransactionId: 'txn-004', accountId: 'demo-checking-1', date: '2026-01-08', amount: 149.99, merchant: 'Amazon', category: ['Shopping'], pending: false },
  { plaidTransactionId: 'txn-005', accountId: 'demo-checking-1', date: '2026-01-12', amount: 1250, merchant: 'Rent', category: ['Housing'], pending: false },
  { plaidTransactionId: 'txn-006', accountId: 'demo-checking-1', date: '2026-01-14', amount: 42.65, merchant: 'Uber', category: ['Transport'], pending: false },
  { plaidTransactionId: 'txn-007', accountId: 'demo-checking-1', date: '2026-01-18', amount: 88.22, merchant: 'Target', category: ['Shopping'], pending: false },
  { plaidTransactionId: 'txn-008', accountId: 'demo-checking-1', date: '2026-01-24', amount: 120, merchant: 'Electric Bill', category: ['Utilities'], pending: false },
  { plaidTransactionId: 'txn-009', accountId: 'demo-checking-1', date: '2026-01-28', amount: 19.99, merchant: 'Netflix', category: ['Entertainment'], pending: false },
  { plaidTransactionId: 'txn-010', accountId: 'demo-checking-1', date: '2026-02-01', amount: -3200, merchant: 'Acme Payroll', category: ['Income'], pending: false },
  { plaidTransactionId: 'txn-011', accountId: 'demo-checking-1', date: '2026-02-04', amount: 76.13, merchant: 'Trader Joe\'s', category: ['Groceries'], pending: false },
  { plaidTransactionId: 'txn-012', accountId: 'demo-checking-1', date: '2026-02-07', amount: 259.99, merchant: 'Apple', category: ['Electronics'], pending: false }
];
