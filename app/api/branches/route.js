import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Branch from '@/lib/models/Branch';
import Transaction from '@/lib/models/Transaction';
import { getDemoUserId } from '@/lib/normalize';
import { simulateBranch } from '@/lib/simulate';

async function ensureBaseline(userId) {
  const transactions = await Transaction.find({ userId }).sort({ date: 1 }).lean();
  const computed = simulateBranch({ baselineTransactions: transactions });
  let baseline = await Branch.findOne({ userId, 'scenario.type': 'baseline' });

  if (!baseline) {
    baseline = await Branch.create({
      userId,
      name: 'Main',
      parentBranchId: null,
      scenario: { type: 'baseline', params: {} },
      computed: {
        metrics: computed.metrics,
        balanceSeries: computed.dailyBalances,
        transactionTimeline: computed.transactionTimeline
      }
    });
    return baseline;
  }

  baseline.computed = {
    metrics: computed.metrics,
    balanceSeries: computed.dailyBalances,
    transactionTimeline: computed.transactionTimeline
  };
  await baseline.save();
  return baseline;
}

export async function GET() {
  const userId = getDemoUserId();

  try {
    await connectToDatabase();
    await ensureBaseline(userId);

    const branches = await Branch.find({ userId }).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ branches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load branches', detail: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const userId = getDemoUserId();

  try {
    await connectToDatabase();
    const body = await request.json();
    const { name, parentBranchId = null, scenario } = body;

    if (!scenario?.type) {
      return NextResponse.json({ error: 'scenario.type is required' }, { status: 400 });
    }

    const transactions = await Transaction.find({ userId }).sort({ date: 1 }).lean();
    const computed = simulateBranch({ baselineTransactions: transactions, scenario });

    const branch = await Branch.create({
      userId,
      name: name || `Branch: ${scenario.type}`,
      parentBranchId,
      scenario,
      computed: {
        metrics: computed.metrics,
        balanceSeries: computed.dailyBalances,
        transactionTimeline: computed.transactionTimeline
      }
    });

    return NextResponse.json({ branch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create branch', detail: error.message }, { status: 500 });
  }
}
