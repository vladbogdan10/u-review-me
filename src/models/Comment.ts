import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  _id: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  author: {
    id: Schema.Types.ObjectId | null;
    username: string;
    image: string;
  };
  parent: Schema.Types.ObjectId | null;
  repliesTo: {
    id: Schema.Types.ObjectId | null;
    username: string | null;
  };
  level: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  commentUpdatedAt: null | Date;
  isDeleted: boolean;
  likes: number;
  __v: number;
}

export interface ICommentDocument extends IComment, Document {
  _id: Schema.Types.ObjectId;
  __v: number;
}

const CommentSchema: Schema = new mongoose.Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      index: true,
      required: true,
    },
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
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    repliesTo: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
      },
      username: {
        type: String,
        default: null,
      },
    },
    level: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    commentUpdatedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model<ICommentDocument>('Comment', CommentSchema);
