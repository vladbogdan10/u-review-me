import Post, { IPostDocument } from '../../../models/Post';
import PostImagesService from './PostImagesService';
import PostTransformer from './PostTransformer';
import cleanQuillEditor from '../../../utils/cleanQuillEditor';
import { PostBody } from '../../../pages/api/create/post';
import { PostUpdateBody } from '../../../pages/api/update/post';

class PostManager {
  private postImagesService;

  constructor() {
    this.postImagesService = new PostImagesService();
  }

  public async createPost(post: PostBody) {
    await this.postImagesService.saveImages(post.images);

    const postData = PostTransformer.preparePost(post);
    const result: IPostDocument = await Post.create(postData);

    if (!result) {
      throw new Error('Something went wrong! Could not create new post.');
    }

    return result;
  }

  public async updatePost(post: PostUpdateBody) {
    const result: IPostDocument | null = await Post.findByIdAndUpdate(
      { _id: post.id },
      {
        content: cleanQuillEditor(post.content),
        rating: post.rating,
        postUpdatedAt: Date.now(),
      },
      { new: true }
    );

    if (result === null) {
      throw new Error(`Cannot update! Post with id: ${post.id} not found`);
    }

    return result;
  }

  public async deletePost(id: string) {
    const result: IPostDocument | null = await Post.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (result === null) {
      throw new Error(`Cannot delete! Post with id: ${id} not found`);
    }

    return result;
  }
}

export default PostManager;
