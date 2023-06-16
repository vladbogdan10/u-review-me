import PostsDataProcessor from '../../../src/services/posts/PostsDataProcessor';
import posts from '../../../__mocks__/posts.json';
import postUserLikes from '../../../__mocks__/postUserLikes.json';

describe('PostsDataProcessor works as expected', () => {
  // @ts-ignore
  const postsDataProcessor = new PostsDataProcessor(posts, postUserLikes);

  test('isLikedByCurrentUser property is added only to the first 2 posts', () => {
    const posts = postsDataProcessor.init();

    posts.forEach((post, index) => {
      if (index === 0 || index === 1) {
        // @ts-ignore
        expect(post.isLikedByCurrentUser).toBeDefined();
      } else {
        // @ts-ignore
        expect(post.isLikedByCurrentUser).not.toBeDefined();
      }
    });
  });
});
