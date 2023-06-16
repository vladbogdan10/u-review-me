import { CommentType } from '../../types/types';

class CommentsService {
  private comments: CommentType[] = [];

  public setComments<T>(comments: T) {
    // @ts-ignore
    this.comments = comments;
  }

  public getComments() {
    return this.comments;
  }

  public getLikedCommentsId() {
    const commentIds = this.comments.reduce((ids, comment) => {
      if (comment.likes > 0) {
        ids.push(comment._id);
      }

      return ids;
    }, [] as string[]);

    return commentIds;
  }
}

export default CommentsService;
