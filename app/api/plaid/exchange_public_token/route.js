import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import PlaidItem from '@/lib/models/PlaidItem';
import { plaidClient, isPlaidConfigured } from '@/lib/plaid';
import { getDemoUserId } from '@/lib/normalize';

export async function POST(request) {
  const { public_token } = await request.json();

  if (!isPlaidConfigured()) {
    return NextResponse.json({ ok: true, demoMode: true });
  }

  if (!public_token) {
    return NextResponse.json({ error: 'public_token is required' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const exchange = await plaidClient.itemPublicTokenExchange({ public_token });

    await PlaidItem.findOneAndUpdate(
      { itemId: exchange.data.item_id },
      {
        userId: getDemoUserId(),
        accessToken: exchange.data.access_token,
        itemId: exchange.data.item_id,
        institutionName: 'Plaid Sandbox'
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, itemId: exchange.data.item_id });
  } catch (error) {
    const message = error?.response?.data || error.message;
    return NextResponse.json({ error: 'Failed to exchange public token', detail: message }, { status: 500 });
  }
}
