import PostCommentsDataProcessor from '../../../src/services/comments/PostCommentsDataProcessor';
import comments from '../../../__mocks__/comments.json';
import commentUserLikes from '../../../__mocks__/commentUserLikes.json';
import postCommentsExpectedData from '../../../__mocks__/postCommentsExpectedResult.json';

describe('PostCommentsDataProcessor works as expected', () => {
  const postCommentsDataProcessor = new PostCommentsDataProcessor(
    comments,
    // @ts-ignore
    commentUserLikes
  );

  it('should return expected data', () => {
    const data = postCommentsDataProcessor.init();

    expect(JSON.parse(JSON.stringify(data))).toEqual(postCommentsExpectedData);
  });
});
