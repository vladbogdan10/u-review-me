import { ObjectId } from 'mongoose';
import Comment, { ICommentDocument } from '../../../models/Comment';
import Post from '../../../models/Post';
import { CommentBody } from '../../../pages/api/create/comment';
import { CommentUpdateBody } from '../../../pages/api/update/comment';
import cleanQuillEditor from '../../../utils/cleanQuillEditor';

class CommentManager {
  public async createComment(comment: CommentBody) {
    comment = {
      ...comment,
      content: cleanQuillEditor(comment.content),
    };
    const result: ICommentDocument = await Comment.create(comment);

    if (!result) {
      throw new Error('Something went wrong! Could not create new comment.');
    }

    await this.updatePostCommentsCount(result.post, 1);

    return result;
  }

  public async updateComment(comment: CommentUpdateBody) {
    const fieldsToUpdate = {
      content: cleanQuillEditor(comment.content),
      commentUpdatedAt: Date.now(),
    };

    const result: ICommentDocument | null = await Comment.findByIdAndUpdate(
      { _id: comment.id },
      fieldsToUpdate,
      { new: true }
    );

    if (result === null) {
      throw new Error(
        `Cannot update! Comment with id: ${comment.id} not found`
      );
    }

    return result;
  }

  public async deleteComment(id: string) {
    const result: ICommentDocument | null = await Comment.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (result === null) {
      throw new Error(`Cannot delete! Comment with id: ${id} not found`);
    }

    await this.updatePostCommentsCount(result.post, -1);

    return result;
  }

  private async updatePostCommentsCount(
    postId: ObjectId,
    updateCountsBy: 1 | -1
  ) {
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: updateCountsBy },
    });
  }
}

export default CommentManager;
