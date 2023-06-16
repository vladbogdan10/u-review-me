import { IComment } from '../models/Comment';
import { ILike } from '../models/Like';
import { IPost } from '../models/Post';
import { IUser } from '../models/User';

export type CategoryType = {
  [category: string]: {
    title: string;
    description: string;
    subcategories: {
      [subcategory: string]: {
        slug: string;
        name: string;
        title: string;
        description: string;
      };
    };
  };
};

export type ImageType = {
  identifier: string;
  alt: string;
};

export interface PostType
  extends Omit<
    IPost,
    '_id' | 'author' | 'createdAt' | 'updatedAt' | 'postUpdatedAt'
  > {
  _id: string;
  author: {
    id: string | null;
    username: string;
    image: string;
  };
  createdAt: string;
  updatedAt: string;
  postUpdatedAt: string;
  isLikedByCurrentUser?: boolean;
}

export interface CommentType
  extends Omit<
    IComment,
    | '_id'
    | 'author'
    | 'post'
    | 'parent'
    | 'repliesTo'
    | 'updatedAt'
    | 'createdAt'
    | 'commentUpdatedAt'
  > {
  _id: string;
  author: {
    id: string | null;
    username: string;
    image: string;
  };
  post: string;
  parent: string | null;
  repliesTo: {
    id: string | null;
    username: string | null;
  };
  createdAt: string;
  updatedAt: string;
  commentUpdatedAt: string | null;
  hasReplies?: boolean;
  isLikedByCurrentUser?: boolean;
}

export interface UserType
  extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'emailVerified'> {
  _id: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: string;
}

export interface LikeType
  extends Omit<
    ILike,
    '_id' | 'userId' | 'contentId' | 'createdAt' | 'updatedAt'
  > {
  _id: string;
  userId: string;
  contentId: string;
  createdAt: string;
  updatedAt: string;
}
