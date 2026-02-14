import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Account from '@/lib/models/Account';
import Transaction from '@/lib/models/Transaction';
import PlaidItem from '@/lib/models/PlaidItem';
import { plaidClient, isPlaidConfigured } from '@/lib/plaid';
import { demoAccounts, demoTransactions } from '@/lib/demoData';
import { getDemoUserId, normalizePlaidAccount, normalizePlaidTransaction } from '@/lib/normalize';

async function seedDemo(userId) {
  await Account.deleteMany({ userId });
  await Transaction.deleteMany({ userId });

  await Account.insertMany(demoAccounts.map((acc) => ({ ...acc, userId })));
  await Transaction.insertMany(demoTransactions.map((txn) => ({ ...txn, userId })));

  return { accounts: demoAccounts.length, transactions: demoTransactions.length, demoMode: true };
}

export async function POST() {
  const userId = getDemoUserId();

  try {
    await connectToDatabase();

    if (!isPlaidConfigured()) {
      const result = await seedDemo(userId);
      return NextResponse.json({ ok: true, ...result });
    }

    const item = await PlaidItem.findOne({ userId }).lean();
    if (!item) {
      const result = await seedDemo(userId);
      return NextResponse.json({ ok: true, ...result, fallback: 'No Plaid item found; loaded demo data.' });
    }

    const accountsResp = await plaidClient.accountsGet({ access_token: item.accessToken });
    const txResp = await plaidClient.transactionsGet({
      access_token: item.accessToken,
      start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10)
    });

    const accounts = accountsResp.data.accounts.map(normalizePlaidAccount);
    const transactions = txResp.data.transactions.map(normalizePlaidTransaction);

    await Account.deleteMany({ userId });
    await Transaction.deleteMany({ userId });

    if (accounts.length) {
      await Account.insertMany(accounts.map((acc) => ({ ...acc, userId })));
    }

    if (transactions.length) {
      await Transaction.insertMany(transactions.map((txn) => ({ ...txn, userId })));
    }

    return NextResponse.json({ ok: true, accounts: accounts.length, transactions: transactions.length });
  } catch (error) {
    const message = error?.response?.data || error.message;
    return NextResponse.json({ error: 'Failed to sync transactions', detail: message }, { status: 500 });
  }
}
