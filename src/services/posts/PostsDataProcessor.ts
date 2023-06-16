import { LikeType, PostType } from '../../types/types';
import BaseDataProcessor from '../BaseDataProcessor';

class PostsDataProcessor extends BaseDataProcessor<PostType[]> {
  private posts;
  private currentUserLikes;

  constructor(posts: PostType[], currentUserLikes: LikeType[]) {
    super(posts);

    this.posts = this.data;
    this.currentUserLikes = currentUserLikes;
  }

  public init() {
    if (this.currentUserLikes.length > 0) {
      this.setIsLikedByCurrentUser(this.currentUserLikes);
    }

    return this.posts;
  }
}

export default PostsDataProcessor;
