import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    plaidAccountId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    subtype: { type: String },
    balances: {
      available: Number,
      current: Number,
      limit: Number,
      iso_currency_code: String
    }
  },
  { timestamps: true }
);

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);
