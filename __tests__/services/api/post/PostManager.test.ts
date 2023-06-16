import { IPostDocument } from '../../../../src/models/Post';
import PostManager from '../../../../src/services/api/post/PostManager';
import {
  testDbCloseConnection,
  testDbConnect,
} from '../../../../src/utils/testDbConnect';
import postData from '../../../../__mocks__/post.json';

let post: IPostDocument;

const postManager = new PostManager();

beforeAll(async () => {
  await testDbConnect();
});

afterAll(async () => {
  await testDbCloseConnection();
});

describe('Test postCreate method', () => {
  it('should throw mongoose validationError if expected data is missing', async () => {
    let error;

    try {
      const postDataCopy = {
        ...postData,
      };
      // @ts-ignore
      delete postDataCopy.rating;
      await postManager.createPost(postDataCopy);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    // @ts-ignore
    expect(error.name).toEqual('ValidationError');
  });

  it('should create an enriched post', async () => {
    post = await postManager.createPost(postData);

    expect(JSON.parse(JSON.stringify(post))).toMatchObject(postData);
    expect(post.slug).toEqual('test-title');
    expect(post).toHaveProperty('urlId');
    expect(typeof post.urlId).toBe('string');
  });
});

describe('Test postUpdate method', () => {
  it('should throw an Error if no post found to update', async () => {
    let error;

    try {
      await postManager.updatePost({
        id: '61c74f6bcb6b4b0014fbf775', // non-existing id
        title: '',
        content: '',
        rating: 5,
        authorId: '',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should update the post', async () => {
    const postContent = '<p>updated test comment</p>';

    const result = await postManager.updatePost({
      id: post._id.toString(),
      title: '',
      content: postContent,
      rating: 5,
      authorId: '',
    });

    expect(result.content).toEqual(postContent);
    expect(result.rating).toEqual(5);
  });
});

describe('Test postDelete method', () => {
  it('should throw an Error if no post found to "delete"', async () => {
    let error;

    try {
      await postManager.deletePost('61c74f6bcb6b4b0014fbf775');
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should flag post as deleted', async () => {
    const result = await postManager.deletePost(post._id.toString());

    expect(result.isDeleted).toBe(true);
  });
});
