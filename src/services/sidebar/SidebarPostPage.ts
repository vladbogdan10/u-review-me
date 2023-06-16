import { LeanDocument } from 'mongoose';
import Post, { IPostDocument } from '../../models/Post';
import { PostType } from '../../types/types';
import Sidebar from './Sidebar';

class SidebarPostPage extends Sidebar {
  protected category;

  constructor(category: string, excludedId?: string, limit?: number) {
    super(excludedId, category, limit);

    this.category = category;
  }

  public async getData() {
    const sidebarData = await this.data;

    let latestPosts = await this.getLatestPostsFromCategory();
    latestPosts = await this.fallback(latestPosts);

    return {
      ...sidebarData,
      latestPosts: latestPosts,
    };
  }

  private async getLatestPostsFromCategory() {
    let result: LeanDocument<IPostDocument[]> = await Post.find({
      category: this.category,
      _id: { $ne: this.excludedId },
    })
      .where({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(this.limit)
      .lean();

    return JSON.parse(JSON.stringify(result)) as PostType[];
  }
}

export default SidebarPostPage;
