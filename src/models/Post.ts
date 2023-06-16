import mongoose, { Schema, Document } from 'mongoose';
import { ImageType } from '../types/types';

export interface IPost {
  _id: Schema.Types.ObjectId;
  author: {
    id: Schema.Types.ObjectId | null;
    username: string;
    image: string;
  };
  urlId: string;
  slug: string;
  title: string;
  category: string;
  subcategory: string;
  commentsCount: number;
  content: string;
  images: ImageType[];
  rating: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  postUpdatedAt: null | Date;
  isDeleted: boolean;
  __v: number;
}

export interface IPostDocument extends IPost, Document {
  _id: Schema.Types.ObjectId;
  __v: number;
}

const PostSchema: Schema = new mongoose.Schema(
  {
    author: {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User',
      },
      username: {
        type: String,
        required: true,
        index: true,
      },
      image: {
        type: String,
        default: null,
      },
    },
    urlId: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        _id: false,
        identifier: { type: String, require: true },
        alt: { type: String },
      },
    ],
    rating: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    postUpdatedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PostSchema.index({ urlId: 1, slug: 1 }, { unique: true });

export default mongoose.models.Post ||
  mongoose.model<IPostDocument>('Post', PostSchema);
