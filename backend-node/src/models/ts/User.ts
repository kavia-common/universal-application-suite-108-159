import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Budget subdocument interface and schema
 */
export interface IBudget {
  category: string;
  amount: number;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: { type: String, required: true, trim: true, index: true },
    amount: {
      type: Number,
      required: true,
      min: [0, "Budget amount must be non-negative"],
    },
  },
  { _id: false }
);

/**
 * PUBLIC_INTERFACE
 * IUser - User document interface
 */
export interface IUser extends Document<Types.ObjectId> {
  name?: string;
  email: string;
  password: string;
  income?: number;
  budgets: IBudget[];
  comparePassword(candidate: string): Promise<boolean>;
}

/**
 * User schema
 */
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      validate: {
        validator: (v: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.toLowerCase()),
        message: "Invalid email address",
      },
    },
    name: { type: String, trim: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    income: {
      type: Number,
      min: [0, "Income must be non-negative"],
      default: 0,
    },
    budgets: {
      type: [BudgetSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before save if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  // @ts-expect-error - this.password is present when modified
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// PUBLIC_INTERFACE
UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  /** Compare plaintext password with stored hash for a User document. */
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
