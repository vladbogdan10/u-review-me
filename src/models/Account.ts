import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount {
  _id: Schema.Types.ObjectId;
  compoundId: string;
  userId: Schema.Types.ObjectId;
  providerType: string;
  providerId: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  accessTokenExpires: number | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IAccountDocument extends IAccount, Document {
  _id: Schema.Types.ObjectId;
  __v: number;
}

const AccountSchema: Schema = new mongoose.Schema(
  {
    compoundId: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    providerType: {
      type: String,
    },
    providerId: {
      type: String,
    },
    providerAccountId: {
      type: String,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    accessToken: {
      type: String,
      default: null,
    },
    accessTokenExpires: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model<IAccountDocument>('Account', AccountSchema);
