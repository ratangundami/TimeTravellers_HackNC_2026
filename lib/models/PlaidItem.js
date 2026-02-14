import mongoose from 'mongoose';

const PlaidItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    accessToken: { type: String, required: true },
    itemId: { type: String, required: true, unique: true },
    institutionName: { type: String, default: 'Plaid Sandbox' }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.PlaidItem || mongoose.model('PlaidItem', PlaidItemSchema);
