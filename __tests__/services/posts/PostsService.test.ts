import PostService from '../../../src/services/posts/PostsService';
import posts from '../../../__mocks__/posts.json';

describe('Test getLikedPostsId method', () => {
  const postService = new PostService();

  it('should return an array of mongodb object ids', () => {
    postService.setPosts(posts);

    const ids = postService.getLikedPostsId();

    const expectedResult = [
      '61c97a6513c15500133fcc5c',
      '61c9af9a20c3da0013a00f4a',
    ];

    expect(ids).toEqual(expectedResult);
  });

  it('should return empty array if list of posts is empty', () => {
    postService.setPosts([]);

    const result = postService.getLikedPostsId();

    expect([]).toEqual(result);
  });
});
