import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    plaidTransactionId: { type: String, index: true, sparse: true },
    accountId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    merchant: { type: String, default: 'Unknown Merchant' },
    category: [{ type: String }],
    pending: { type: Boolean, default: false }
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, plaidTransactionId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
