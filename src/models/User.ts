import mongoose, { Schema, Document } from 'mongoose';

export interface IUser {
  _id: Schema.Types.ObjectId;
  username: string;
  name: string;
  email: string;
  image: string;
  emailVerified: Date;
  bio: string;
  newUser: boolean;
  showName: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IUserDocument extends IUser, Document {
  _id: Schema.Types.ObjectId;
  __v: number;
}

const UserSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    bio: {
      type: String,
    },
    newUser: {
      type: Boolean,
    },
    showName: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUserDocument>('User', UserSchema);
