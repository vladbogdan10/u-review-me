import { PostType } from '../../types/types';

class PostService {
  private posts: PostType[] = [];

  public setPosts(posts: PostType[]) {
    this.posts = posts;
  }

  public getPosts() {
    return this.posts;
  }

  public getLikedPostsId() {
    const postIds = this.posts.reduce((ids, post) => {
      if (post.likes > 0) {
        ids.push(post._id);
      }

      return ids;
    }, [] as string[]);

    return postIds;
  }
}

export default PostService;
