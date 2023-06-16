import { CommentWithPostType } from '../../repository/CommentRepository';
import { CommentType, PostType } from '../../types/types';

export interface IUserComment {
  post: PostType;
  comments: CommentType[];
}

class UserCommentsTransformer {
  public static transform(userComments: CommentWithPostType[]) {
    return this.transformToArray(this.groupCommentsByPostId(userComments));
  }

  private static groupCommentsByPostId(userComments: CommentWithPostType[]) {
    return userComments.reduce((commentsByPost, comment) => {
      const postId = comment.post._id.toString();

      if (!commentsByPost[postId]) {
        commentsByPost[postId] = {
          post: comment.post,
          comments: [],
        };
      }

      // set comment['post'] to the postId instead of the full post.
      // The full post is not needed on the final data.
      comment = Object.assign(comment, { post: comment.post._id });

      // @ts-ignore
      commentsByPost[postId].comments.push(comment);

      return commentsByPost;
    }, {} as Record<string, IUserComment>);
  }

  private static transformToArray(comments: Record<string, IUserComment>) {
    const commentsArray = [];

    for (let key in comments) {
      commentsArray.push(comments[key]);
    }

    return commentsArray;
  }
}

export default UserCommentsTransformer;
