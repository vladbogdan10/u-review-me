import LikeRepository from '../../../repository/LikeRepository';
import PostRepository from '../../../repository/PostRepository';
import dbConnect from '../../../utils/dbConnect';
import PostsDataProcessor from '../../posts/PostsDataProcessor';
import PostsService from '../../posts/PostsService';

class UserPostsManager {
  private username;
  private sessionUserId;

  constructor(username: string, sessionUserId: string | unknown) {
    this.username = username;
    this.sessionUserId = sessionUserId;
  }

  public async getData() {
    await dbConnect();

    const postRepository = new PostRepository();
    let posts = await postRepository.getPostsByUserName(this.username, 'desc');

    const postsService = new PostsService();
    postsService.setPosts(posts);

    const likeRepository = new LikeRepository();
    const currentUserLikes = await likeRepository.getLikes(
      this.sessionUserId,
      postsService.getLikedPostsId()
    );

    const postsDataProcessor = new PostsDataProcessor(posts, currentUserLikes);

    posts = postsDataProcessor.init();

    return posts;
  }
}

export default UserPostsManager;
