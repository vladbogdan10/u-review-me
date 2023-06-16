import PostRepository from '../../repository/PostRepository';
import Sidebar from './Sidebar';

class SidebarSubcategoryPage extends Sidebar {
  private subcategory;

  constructor(category: string, subcategory: string, limit?: number) {
    super(undefined, category, limit);

    this.subcategory = subcategory;
  }

  public async getData() {
    const sidebarData = await this.data;

    const postRepository = new PostRepository();
    let latestPosts = await postRepository.getPostsBySubcategory(
      this.subcategory,
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

export default SidebarSubcategoryPage;
