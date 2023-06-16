import LikeRepository from '../../../repository/LikeRepository';
import PostRepository from '../../../repository/PostRepository';
import dbConnect from '../../../utils/dbConnect';
import PostsDataProcessor from '../../posts/PostsDataProcessor';
import PostsService from '../../posts/PostsService';
import Sidebar from '../../sidebar/SidebarHomepage';

class HomepageManager {
  private sessionUserId;

  constructor(sessionUserId: string | unknown) {
    this.sessionUserId = sessionUserId;
  }

  public async getData() {
    await dbConnect();

    const allPosts = await this.getAllPosts();
    const sidebar = new Sidebar();

    return {
      posts: allPosts,
      sidebar: await sidebar.getData(),
    };
  }

  private async getAllPosts() {
    const postRepository = new PostRepository();
    let posts = await postRepository.getPosts('desc');

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

export default HomepageManager;
