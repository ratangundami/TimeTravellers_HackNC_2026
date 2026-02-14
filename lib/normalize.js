import { DEMO_USER_ID } from './demoData';

export function getDemoUserId() {
  return process.env.DEMO_USER_ID || DEMO_USER_ID;
}

export function normalizePlaidTransaction(txn) {
  return {
    plaidTransactionId: txn.transaction_id,
    accountId: txn.account_id,
    date: txn.date,
    amount: txn.amount,
    merchant: txn.merchant_name || txn.name || 'Unknown Merchant',
    category: txn.category?.length ? txn.category : ['Uncategorized'],
    pending: txn.pending || false
  };
}

export function normalizePlaidAccount(account) {
  return {
    plaidAccountId: account.account_id,
    name: account.name,
    type: account.type,
    subtype: account.subtype,
    balances: account.balances
  };
}
