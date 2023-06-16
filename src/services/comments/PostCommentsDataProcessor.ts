import { CommentType, LikeType } from '../../types/types';
import CommentsDataProcessor from './CommentsDataProcessor';

class PostCommentsDataProcessor extends CommentsDataProcessor<CommentType[]> {
  private comments: any;

  constructor(comments: CommentType[], currentUserLikes: LikeType[]) {
    super(comments, currentUserLikes);
    super.init();
  }

  public init() {
    this.groupByParentId();
    this.setHasReplies();
    this.reverseObject();
    this.transformToArray();

    return this.comments as CommentType[];
  }

  // This approach only works if the comments from db come in the order they were created
  private groupByParentId() {
    const comments = this.data;

    this.comments = comments.reduce((groupedComments, comment) => {
      const id = comment._id;

      if (comment.level === 0) {
        groupedComments[id] = (groupedComments[id] || []).concat(comment);
      }

      // Only level 1 and 2 have a parent
      if (comment.parent !== null) {
        const parentId = comment.parent;
        groupedComments[parentId].push(comment);
      }

      return groupedComments;
    }, {} as Record<string, CommentType[]>);
  }

  private setHasReplies() {
    const comments: Record<string, CommentType[]> = this.comments;
    const commentsObj = { ...comments };

    for (let key in comments) {
      comments[key].forEach((comment1) => {
        if (comment1.repliesTo.id) {
          commentsObj[key].forEach((comment2) => {
            if (!comment2.hasOwnProperty('hasReplies')) {
              const repliesToId = comment1.repliesTo.id;
              const commentId = comment2._id;

              if (repliesToId === commentId) {
                Object.assign(comment2, { hasReplies: true });
              }
            }
          });
        }
      });
    }

    this.comments = commentsObj;
  }

  private reverseObject() {
    let reversedObj: Record<string, CommentType[]> = {};

    Object.keys(this.comments)
      .reverse()
      .forEach((key) => {
        reversedObj[key] = this.comments[key];
      });

    this.comments = reversedObj;
  }

  private transformToArray() {
    const comments: Record<string, CommentType[]> = this.comments;
    const commentsArray: CommentType[] = [];

    for (let key in comments) {
      comments[key].forEach((comment) => {
        commentsArray.push(comment);
      });
    }

    this.comments = commentsArray;
  }
}

export default PostCommentsDataProcessor;
