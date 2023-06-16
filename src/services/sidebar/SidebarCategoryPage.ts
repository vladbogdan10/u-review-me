import PostRepository from '../../repository/PostRepository';
import Sidebar from './Sidebar';

class SidebarCategoryPage extends Sidebar {
  protected category;

  constructor(category: string, limit?: number) {
    super(undefined, category, limit);

    this.category = category;
  }

  public async getData() {
    const sidebarData = await this.data;

    const postRepository = new PostRepository();
    let latestPosts = await postRepository.getPostsByCategory(
      this.category,
      'desc',
      this.limit
    );
    latestPosts = await this.fallback(latestPosts);

    return {
      ...sidebarData,
      latestPosts: latestPosts,
    };
  }
}

export default SidebarCategoryPage;
