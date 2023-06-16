import Sidebar from './Sidebar';
import PostRepository from '../../repository/PostRepository';

class SidebarHomepage extends Sidebar {
  constructor(limit?: number) {
    super(undefined, undefined, limit);
  }

  public async getData() {
    const sidebarData = await this.data;

    const postRepository = new PostRepository();
    let latestPosts = await postRepository.getPosts('desc', this.limit);
    latestPosts = await this.fallback(latestPosts);

    return {
      ...sidebarData,
      latestPosts: latestPosts,
    };
  }
}

export default SidebarHomepage;
