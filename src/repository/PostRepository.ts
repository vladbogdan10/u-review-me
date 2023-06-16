import { LeanDocument } from 'mongoose';
import Post, { IPostDocument } from '../models/Post';
import { PostType } from '../types/types';

class PostRepository {
  public async getPostByUrlIdAndSlug(urlId: string, slug: string) {
    const result: LeanDocument<IPostDocument> = await Post.findOne({
      urlId: urlId,
      slug: slug,
    }).lean();

    return JSON.parse(JSON.stringify(result)) as PostType;
  }

  public async getPostByUrlId(urlId: string) {
    const result: LeanDocument<IPostDocument> = await Post.findOne({
      urlId: urlId,
    }).lean();

    return JSON.parse(JSON.stringify(result)) as PostType;
  }

  public async getPosts(order: 'asc' | 'desc' = 'asc', limit: number = 0) {
    const result: LeanDocument<IPostDocument[]> = await Post.find({})
      .where({ isDeleted: false })
      .sort({ createdAt: order === 'desc' ? -1 : 1 })
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(result)) as PostType[];
  }

  public async getPostsBySubcategory(
    subcategory: string,
    order: 'asc' | 'desc' = 'asc',
    limit: number = 0
  ) {
    let result: LeanDocument<IPostDocument[]> = await Post.find({
      subcategory: subcategory,
    })
      .where({ isDeleted: false })
      .sort({ createdAt: order === 'desc' ? -1 : 1 })
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(result)) as PostType[];
  }

  public async getPostsByCategory(
    category: string,
    order: 'asc' | 'desc' = 'asc',
    limit: number = 0
  ) {
    let result: LeanDocument<IPostDocument[]> = await Post.find({
      category: category,
    })
      .where({ isDeleted: false })
      .sort({ createdAt: order === 'desc' ? -1 : 1 })
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(result)) as PostType[];
  }

  public async getPostsByUserName(
    username: string,
    order: 'asc' | 'desc' = 'asc'
  ) {
    const result: LeanDocument<IPostDocument[]> = await Post.find({
      'author.username': username,
    })
      .where({ isDeleted: false })
      .sort({ createdAt: order === 'desc' ? -1 : 1 })
      .lean();

    return JSON.parse(JSON.stringify(result)) as PostType[];
  }
}

export default PostRepository;
