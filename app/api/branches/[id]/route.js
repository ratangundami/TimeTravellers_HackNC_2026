import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Branch from '@/lib/models/Branch';
import { getDemoUserId } from '@/lib/normalize';

export async function GET(_, { params }) {
  const userId = getDemoUserId();

  try {
    await connectToDatabase();
    const branch = await Branch.findOne({ _id: params.id, userId }).lean();

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json({ branch });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load branch', detail: error.message }, { status: 500 });
  }
}
