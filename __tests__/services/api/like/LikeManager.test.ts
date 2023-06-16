import Comment, { ICommentDocument } from '../../../../src/models/Comment';
import Post, { IPostDocument } from '../../../../src/models/Post';
import LikeManager from '../../../../src/services/api/like/LikeManager';
import {
  testDbCloseConnection,
  testDbConnect,
} from '../../../../src/utils/testDbConnect';
import postData from '../../../../__mocks__/post.json';
import commentData from '../../../../__mocks__/comment.json';

let post: IPostDocument;
let comment: ICommentDocument;

const userId = '61c97a6513c15500133fcc5c';

beforeAll(async () => {
  await testDbConnect();
  await populateDb();
});

afterAll(async () => {
  testDbCloseConnection();
});

describe('Test createLike method', () => {
  it('should throw mongoose ValidationError if required data is missing', async () => {
    let error;

    // @ts-ignore
    const likeManager = new LikeManager({});

    try {
      await likeManager.createLike();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    // @ts-ignore
    expect(error.name).toEqual('ValidationError');
  });

  it('should create a like and update post likes count', async () => {
    const likeManager = new LikeManager({
      contentType: 'Post',
      userId: userId,
      contentId: post._id.toString(),
    });

    const result = await likeManager.createLike();

    expect(result.contentType).toEqual('Post');
    expect(result.userId.toString()).toEqual(userId);
    expect(result.contentId).toEqual(post._id);
  });

  test('post likes count increased by 1', async () => {
    const result: IPostDocument | null = await Post.findById(post._id);

    expect(result?.likes).toEqual(1);
  });

  it('should create a like and update comment likes count', async () => {
    const likeManager = new LikeManager({
      contentType: 'Comment',
      userId: userId,
      contentId: comment._id.toString(),
    });

    const result = await likeManager.createLike();

    expect(result.contentType).toEqual('Comment');
    expect(result.userId.toString()).toEqual(userId);
    expect(result.contentId).toEqual(comment._id);
  });

  test('comment likes count increased by 1', async () => {
    const result: ICommentDocument | null = await Comment.findById(comment._id);

    expect(result?.likes).toEqual(1);
  });
});

describe('Test deleteLike method', () => {
  it('should throw error if required data is missing', async () => {
    let error;

    // @ts-ignore
    const likeManager = new LikeManager({});

    try {
      await likeManager.deleteLike();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should throw error if it cannot delete like', async () => {
    let error;

    const likeManager = new LikeManager({
      contentType: 'Post',
      userId: userId,
      contentId: '61c97a6513c15500133fcabc', // non-existing id
    });

    try {
      await likeManager.deleteLike();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should delete a like and update post likes count', async () => {
    const likeManager = new LikeManager({
      contentType: 'Post',
      userId: userId,
      contentId: post._id.toString(),
    });

    await likeManager.deleteLike();
  });

  test('post likes count decreased by 1', async () => {
    const result: IPostDocument | null = await Post.findById(post._id);

    expect(result?.likes).toEqual(0);
  });

  it('should delete a like and update comment likes count', async () => {
    const likeManager = new LikeManager({
      contentType: 'Comment',
      userId: userId,
      contentId: comment._id.toString(),
    });

    await likeManager.deleteLike();
  });

  test('comment likes count decreased by 1', async () => {
    const result: ICommentDocument | null = await Comment.findById(comment._id);

    expect(result?.likes).toEqual(0);
  });
});

async function populateDb() {
  post = await Post.create({
    ...postData,
    slug: 'test',
  });

  comment = await Comment.create(commentData);
}
