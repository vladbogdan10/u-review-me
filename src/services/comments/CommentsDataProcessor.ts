import { LikeType } from '../../types/types';
import BaseDataProcessor from '../BaseDataProcessor';

class CommentsDataProcessor<T> extends BaseDataProcessor<T> {
  private currentUserLikes;

  constructor(comments: T, currentUserLikes: LikeType[]) {
    super(comments);

    this.currentUserLikes = currentUserLikes;
  }

  public init() {
    if (this.currentUserLikes.length > 0) {
      this.setIsLikedByCurrentUser(this.currentUserLikes);
    }

    return this.data;
  }
}

export default CommentsDataProcessor;
