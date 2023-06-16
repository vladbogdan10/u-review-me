import CommentsService from '../../../src/services/comments/CommentsService';
import comments from '../../../__mocks__/comments.json';

describe('getLikedCommentsId method works as expected', () => {
  const commentsService = new CommentsService();

  it('should return an array of ids', () => {
    commentsService.setComments(comments);

    const ids = commentsService.getLikedCommentsId();

    const expectedResult = [
      '61c9956d20c3da0013a00cea',
      '61c995fa20c3da0013a00d3c',
    ];

    expect(ids).toEqual(expectedResult);
  });

  it('should return empty array if list of comments is empty', () => {
    commentsService.setComments([]);

    const result = commentsService.getLikedCommentsId();

    expect([]).toEqual(result);
  });
});
