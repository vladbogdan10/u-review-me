import PostTransformer from '../../../../src/services/api/post/PostTransformer';
import postData from '../../../../__mocks__/post.json';

describe('Test PostTransformer class', () => {
  test('transformed post data should contain the the initial data', () => {
    const data = PostTransformer.preparePost(postData);

    expect(data).toMatchObject(postData);
  });

  it('should sanitize post title', () => {
    const post = {
      ...postData,
      title: '<p id="test"><script>alert("bad")</script></p>clean title',
    };

    const data = PostTransformer.preparePost(post);

    expect(data.title).toEqual('clean title');
  });

  it('should remove special characters and slugify post slug', () => {
    const title = 'some title that will be slugify';
    const capitalizeAll = title.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
    const badTitle =
      capitalizeAll + PostTransformer.specialCharacters + ' <p>test</p>';
    const expected = 'some-title-that-will-be-slugify-test';

    const post = {
      ...postData,
      title: badTitle,
    };

    const data = PostTransformer.preparePost(post);

    expect(data.slug).toEqual(expected);
  });

  it('should map images data', () => {
    const post = {
      ...postData,
      images: [
        {
          dataURL: 'test',
          identifier: 'test',
          height: '1080',
          width: '1920',
          type: 'jpg',
        },
      ],
    };

    const data = PostTransformer.preparePost(post);

    expect(data.images[0]).toHaveProperty('alt');
    expect(data.images[0].alt).toEqual('test title!');
  });

  it('should return enriched post data', () => {
    const data = PostTransformer.preparePost(postData);

    expect(data).toHaveProperty('slug');
    expect(data).toHaveProperty('urlId');
    expect(typeof data.urlId).toBe('string');
    expect(data.urlId.length).toEqual(6);
  });
});
