import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * PUBLIC_INTERFACE
 * ISuggestion - Suggestion document interface
 */
export interface ISuggestion extends Document<Types.ObjectId> {
  userId: Types.ObjectId;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const SuggestionSchema = new Schema<ISuggestion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, "Message too long"],
    },
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

export const Suggestion: Model<ISuggestion> =
  mongoose.models.Suggestion ||
  mongoose.model<ISuggestion>("Suggestion", SuggestionSchema);
export default Suggestion;
