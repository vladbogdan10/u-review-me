import LikeRepository from '../../../repository/LikeRepository';
import PostRepository from '../../../repository/PostRepository';
import dbConnect from '../../../utils/dbConnect';
import PostsDataProcessor from '../../posts/PostsDataProcessor';
import PostsService from '../../posts/PostsService';
import Sidebar from '../../sidebar/SidebarSubcategoryPage';

class SubcategoryManager {
  private category;
  private subcategory;
  private sessionUserId;

  constructor(
    category: string,
    subcategory: string,
    sessionUserId: string | unknown
  ) {
    this.category = category;
    this.subcategory = subcategory;
    this.sessionUserId = sessionUserId;
  }

  public async getData() {
    await dbConnect();

    const posts = await this.subcategoryPosts();
    const sidebar = new Sidebar(this.category, this.subcategory);

    return {
      posts: posts,
      sidebar: await sidebar.getData(),
    };
  }

  private async subcategoryPosts() {
    const postRepository = new PostRepository();
    let posts = await postRepository.getPostsBySubcategory(
      this.subcategory,
      'desc'
    );

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

export default SubcategoryManager;
