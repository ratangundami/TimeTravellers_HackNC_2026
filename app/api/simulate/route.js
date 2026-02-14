import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import { getDemoUserId } from '@/lib/normalize';
import { simulateBranch } from '@/lib/simulate';

export async function POST(request) {
  const userId = getDemoUserId();

  try {
    await connectToDatabase();
    const { scenario } = await request.json();

    const transactions = await Transaction.find({ userId }).sort({ date: 1 }).lean();
    const simulation = simulateBranch({ baselineTransactions: transactions, scenario });

    return NextResponse.json(simulation);
  } catch (error) {
    return NextResponse.json({ error: 'Simulation failed', detail: error.message }, { status: 500 });
  }
}
