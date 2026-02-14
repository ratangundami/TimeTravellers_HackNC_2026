import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  parentBranchId: { type: mongoose.Schema.Types.ObjectId, default: null, ref: 'Branch' },
  scenario: {
    type: { type: String, enum: ['baseline', 'remove_transaction', 'insert_transaction', 'edit_transaction'], default: 'baseline' },
    params: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  computed: {
    metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
    balanceSeries: { type: [mongoose.Schema.Types.Mixed], default: [] },
    transactionTimeline: { type: [mongoose.Schema.Types.Mixed], default: [] }
  }
}, { timestamps: { createdAt: true, updatedAt: true } });

export default mongoose.models.Branch || mongoose.model('Branch', BranchSchema);
