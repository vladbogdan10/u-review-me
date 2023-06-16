import { LeanDocument } from 'mongoose';
import Comment, { ICommentDocument } from '../models/Comment';
import { IPostDocument } from '../models/Post';
import { CommentType, PostType } from '../types/types';

export interface ICommentDocumentWithPost
  extends Omit<ICommentDocument, 'post'> {
  post: IPostDocument;
}

export interface CommentWithPostType extends Omit<CommentType, 'post'> {
  post: PostType;
}

class CommentRepository {
  public async getComentsByPostId(postId: string) {
    const result: LeanDocument<ICommentDocument[]> = await Comment.find({
      post: postId,
    }).lean();

    return JSON.parse(JSON.stringify(result)) as CommentType[];
  }

  public async getCommentsWithPostByUserName(
    username: string,
    order: 'asc' | 'desc' = 'asc'
  ) {
    const result: LeanDocument<ICommentDocumentWithPost[]> = await Comment.find(
      {
        'author.username': username,
      }
    )
      .where({ isDeleted: false })
      .populate('post')
      .sort({ createdAt: order === 'desc' ? -1 : 1 })
      .lean();

    return JSON.parse(JSON.stringify(result)) as CommentWithPostType[];
  }
}

export default CommentRepository;
