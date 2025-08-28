import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * PUBLIC_INTERFACE
 * ISubscription - Subscription document interface
 */
export interface ISubscription extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  serviceName: string;
  cost: number;
  billingCycle: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | string;
  nextPaymentDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceName: { type: String, required: true, trim: true, index: true },
    cost: { type: Number, required: true, min: [0, "Cost must be non-negative"] },
    billingCycle: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
    },
    nextPaymentDate: { type: Date, required: true, index: true },
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

SubscriptionSchema.index({ userId: 1, serviceName: 1 }, { unique: false });

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
export default Subscription;
