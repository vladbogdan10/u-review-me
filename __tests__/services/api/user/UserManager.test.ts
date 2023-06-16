import Post, { IPostDocument } from '../../../../src/models/Post';
import User, { IUserDocument } from '../../../../src/models/User';
import UserManager from '../../../../src/services/api/user/UserManager';
import {
  testDbCloseConnection,
  testDbConnect,
} from '../../../../src/utils/testDbConnect';
import userData from '../../../../__mocks__/user.json';
import postData from '../../../../__mocks__/post.json';
import Comment, { ICommentDocument } from '../../../../src/models/Comment';
import { LeanDocument } from 'mongoose';

let user: IUserDocument;

const userManager = new UserManager();

beforeAll(async () => {
  await testDbConnect();
  await populateDb();
});

afterAll(async () => {
  await testDbCloseConnection();
});

describe('Test updateUser method', () => {
  it('should throw error if user data cannot be updated', async () => {
    let error;

    try {
      // @ts-ignore
      await userManager.updateUser({ _id: '61c97a6513c15500133fcc9b' }); // non-existing id
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should update user data', async () => {
    await userManager.updateUser({
      ...userData,
      name: 'New Name',
      bio: 'new bio',
      newUser: true,
      showName: false,
    });

    const result: LeanDocument<IUserDocument> = await User.findById(
      user._id
    ).lean();

    expect(result.name).toEqual('New Name');
    expect(result.bio).toEqual('new bio');
    expect(result.newUser).toBe(true);
    expect(result.showName).toBe(false);
  });

  it('should updated user image on all user posts', async () => {
    const imageString = 'newUserImage';

    await userManager.updateUser({
      ...userData,
      image: imageString,
    });

    const allPosts: LeanDocument<IPostDocument[]> = await Post.find({
      'author.id': user._id,
    }).lean();

    expect(allPosts[0].author.image).toEqual(imageString);
    expect(allPosts[1].author.image).toEqual(imageString);
  });

  it('should updated user image on all user comments', async () => {
    const imageString = 'newUserImage';

    await userManager.updateUser({
      ...userData,
      image: imageString,
    });

    const allComments: LeanDocument<ICommentDocument[]> = await Comment.find({
      'author.id': user._id,
    }).lean();

    expect(allComments[0].author.image).toEqual(imageString);
    expect(allComments[1].author.image).toEqual(imageString);
  });
});

describe('Test deleteUser method', () => {
  it('should throw error if user cannot be deleted', async () => {
    let error;

    try {
      await userManager.deleteUser('61c97a6513c15500133fcc9b'); // non-existing id
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
  });

  it('should delete user succesfully', async () => {
    await userManager.deleteUser(user._id.toString());
  });

  test('deleted user posts are updated', async () => {
    const allPosts: LeanDocument<IPostDocument[]> = await Post.find({}).lean();

    allPosts.forEach((post) => {
      expect(post.author.id).toBe(null);
      expect(post.author.username).toEqual('[deleted]');
      expect(post.author.image).toContain('data:image/svg+xml;utf8,');
    });
  });

  test('deleted user comments are updated', async () => {
    const allComments: LeanDocument<ICommentDocument[]> = await Comment.find(
      {}
    ).lean();

    allComments.forEach((comment) => {
      expect(comment.author.id).toBe(null);
      expect(comment.author.username).toEqual('[deleted]');
      expect(comment.author.image).toContain('data:image/svg+xml;utf8,');
    });
  });
});

async function populateDb() {
  user = await User.create(userData);

  const post = {
    ...postData,
    author: {
      id: user._id,
      username: user.username,
      image: user.image,
    },
    slug: 'test',
  };

  const commentData = {
    author: {
      id: user._id,
      username: user.username,
      image: user.image,
    },
    post: '',
    content: '<p>test comment</p>',
  };

  for (let i = 1; i <= 2; i++) {
    post.title = 'test' + i;
    post.slug = 'test' + i;
    const newPost = await Post.create(post);

    commentData.post = newPost._id;
    await Comment.create(commentData);
  }
}
