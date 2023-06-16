import CommentsDataProcessor from '../../../src/services/comments/CommentsDataProcessor';
import comments from '../../../__mocks__/comments.json';
import commentUserLikes from '../../../__mocks__/commentUserLikes.json';

describe('CommentsDataProcessor works as expected', () => {
  const commentsDataProcessor = new CommentsDataProcessor(
    comments,
    // @ts-ignore
    commentUserLikes
  );

  test('isLikedByCurrentUser property is added only to the first 2 comments', () => {
    const comments = commentsDataProcessor.init();

    comments.forEach((comment, index) => {
      if (index === 0 || index === 1) {
        // @ts-ignore
        expect(comment.isLikedByCurrentUser).toBeDefined();
      } else {
        // @ts-ignore
        expect(comment.isLikedByCurrentUser).not.toBeDefined();
      }
    });
  });
});
