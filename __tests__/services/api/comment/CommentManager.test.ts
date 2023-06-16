import { ICommentDocument } from '../../../../src/models/Comment';
import Post, { IPostDocument } from '../../../../src/models/Post';
import CommentManager from '../../../../src/services/api/comment/CommentManager';
import {
  testDbCloseConnection,
  testDbConnect,
} from '../../../../src/utils/testDbConnect';
import postData from '../../../../__mocks__/post.json';
import commentData from '../../../../__mocks__/comment.json';

let post: IPostDocument | null;
let comment: ICommentDocument;

beforeAll(async () => {
  await testDbConnect();

  post = await Post.create({ ...postData, slug: 'test' });
});

afterAll(async () => {
  await testDbCloseConnection();
});

const commentManager = new CommentManager();

describe('Test createComment method', () => {
  it('should throw mongoose validationError if expected data is missing', async () => {
    let error;

    try {
      // @ts-ignore
      await commentManager.createComment({ content: '<p>test comment</p>' });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    // @ts-ignore
    expect(error.name).toEqual('ValidationError');
  });

  it('should create a new comment and update post "commentsCount" by 1', async () => {
    const someId = '61c9956d20c3da0013a00cea';

    comment = await commentManager.createComment({
      ...commentData,
      post: post!._id.toString(),
      parent: someId,
      repliesTo: {
        id: someId,
        username: 'replyUser',
      },
      level: 1,
    });

    expect(JSON.parse(JSON.stringify(comment['author']))).toMatchObject(
      commentData.author
    );
    expect(comment.post).toEqual(post?._id);
    expect(comment.content).toEqual(commentData.content);
    expect(comment.parent!.toString()).toEqual(someId);
    expect(comment.repliesTo.id!.toString()).toEqual(someId);
    expect(comment.level).toEqual(1);

    post = await Post.findById(post?._id);
    expect(post?.commentsCount).toEqual(1);
  });
});

describe('Test updateComment method', () => {
  it('should throw an Error if no comment found to update', async () => {
    let error;

    try {
      await commentManager.updateComment({
        id: '61c74f6bcb6b4b0014fbf775', // non-existing id
        content: 'test',
        authorId: '',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should update comment', async () => {
    const commentContent = '<p>updated test comment</p>';

    const result = await commentManager.updateComment({
      id: comment._id.toString(),
      content: commentContent,
      authorId: '',
    });

    expect(result.content).toEqual(commentContent);
  });
});

describe('Test deleteComment method', () => {
  it('should throw an Error if no comment found to "delete"', async () => {
    let error;

    try {
      await commentManager.deleteComment('61c74f6bcb6b4b0014fbf775');
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should flag comment as deleted and update post "commentsCount" by -1', async () => {
    const result = await commentManager.deleteComment(comment._id.toString());

    expect(result.isDeleted).toBe(true);

    // notice: post.commentsCount should be 1 from the previous tests
    post = await Post.findById(post?._id);
    expect(post?.commentsCount).toEqual(0);
  });
});
