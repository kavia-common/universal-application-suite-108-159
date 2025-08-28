import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * PUBLIC_INTERFACE
 * ITransaction - Transaction document interface
 */
export interface ITransaction extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  amount: number;
  category: string;
  merchant?: string;
  date: Date;
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [-1e12, "Amount out of range"],
      max: [1e12, "Amount out of range"],
    },
    category: { type: String, required: true, trim: true, index: true },
    merchant: { type: String, trim: true },
    date: { type: Date, required: true, index: true },
    source: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for common queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, category: 1, date: -1 });

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
