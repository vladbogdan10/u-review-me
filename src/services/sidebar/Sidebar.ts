import { LeanDocument } from 'mongoose';
import Post, { IPostDocument } from '../../models/Post';
import { PostType } from '../../types/types';

class Sidebar {
  protected data;
  protected excludedId;
  protected limit = 10;
  protected category;

  constructor(excludedId?: string, category?: string, limit = 10) {
    this.excludedId = excludedId;
    this.category = category;
    this.limit = limit;
    this.data = this.getMostHelpful();
  }

  public async getData() {
    return await this.data;
  }

  private async getMostHelpfulPosts() {
    let query = {};

    if (this.excludedId) {
      Object.assign(query, {
        _id: { $ne: this.excludedId },
      });
    }
    if (this.category) {
      Object.assign(query, {
        category: this.category,
      });
    }

    const result: LeanDocument<IPostDocument[]> = await Post.find(query)
      .where({ isDeleted: false })
      .sort({ likes: -1 })
      .limit(this.limit)
      .lean();

    return JSON.parse(JSON.stringify(result)) as PostType[];
  }

  protected async fallback(initialPosts: PostType[]) {
    let posts = initialPosts;

    if (posts.length < this.limit) {
      const postIds = posts.map((post) => post._id);

      if (this.excludedId) {
        postIds.push(this.excludedId);
      }

      const limit = this.limit - posts.length;

      let query = {
        _id: { $nin: postIds },
      };

      if (this.category) {
        Object.assign(query, { category: this.category });
      }

      const result: LeanDocument<IPostDocument[]> = await Post.find(query)
        .where({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      const parsedResult = JSON.parse(JSON.stringify(result)) as PostType[];

      return posts.concat(parsedResult);
    }

    return posts;
  }

  private async getMostHelpful() {
    const mostHelpful = await this.getMostHelpfulPosts();

    return {
      mostHelpful: mostHelpful,
    };
  }
}

export default Sidebar;
