import { NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';
import { plaidClient, isPlaidConfigured } from '@/lib/plaid';
import { getDemoUserId } from '@/lib/normalize';

export async function POST() {
  if (!isPlaidConfigured()) {
    return NextResponse.json({
      link_token: 'demo-mode-token',
      expiration: null,
      request_id: 'demo',
      demoMode: true
    });
  }

  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: getDemoUserId() },
      client_name: 'Financial Time Machine',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
      redirect_uri: process.env.PLAID_REDIRECT_URI || undefined
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const message = error?.response?.data || error.message;
    return NextResponse.json({ error: 'Failed to create Plaid link token', detail: message }, { status: 500 });
  }
}
