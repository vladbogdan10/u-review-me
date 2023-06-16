import LikeRepository from '../../../repository/LikeRepository';
import PostRepository from '../../../repository/PostRepository';
import dbConnect from '../../../utils/dbConnect';
import PostsDataProcessor from '../../posts/PostsDataProcessor';
import PostsService from '../../posts/PostsService';
import Sidebar from '../../sidebar/SidebarCategoryPage';

class CategoryManager {
  private category;
  private sessionUserId;

  constructor(category: string, sessionUserId: string | unknown) {
    this.category = category;
    this.sessionUserId = sessionUserId;
  }

  public async getData() {
    await dbConnect();

    const posts = await this.categoryPosts();
    const sidebar = new Sidebar(this.category);

    return {
      posts: posts,
      sidebar: await sidebar.getData(),
    };
  }

  private async categoryPosts() {
    const postRepository = new PostRepository();
    let posts = await postRepository.getPostsByCategory(this.category, 'desc');

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

export default CategoryManager;
