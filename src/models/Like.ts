import mongoose, { Schema, Document } from 'mongoose';

export interface ILike {
  _id: Schema.Types.ObjectId;
  contentType: 'Comment' | 'Post';
  userId: Schema.Types.ObjectId;
  contentId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ILikeDocument extends ILike, Document {
  _id: Schema.Types.ObjectId;
  __v: number;
}

const LikeSchema: Schema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      required: true,
      enum: ['Comment', 'Post'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      refPath: 'contentType',
      required: true,
    },
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.models.Like ||
  mongoose.model<ILikeDocument>('Like', LikeSchema);
