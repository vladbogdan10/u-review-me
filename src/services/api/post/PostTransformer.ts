import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { PostBody } from '../../../pages/api/create/post';
import cleanQuillEditor from '../../../utils/cleanQuillEditor';

class PostTransformer {
  public static specialCharacters = '*+~.()\'"!:@?';

  public static preparePost(post: PostBody) {
    return this.mapPostData(post);
  }

  private static mapPostData(post: PostBody) {
    const postData = {
      ...post,
      urlId: nanoid(6),
      title: sanitizeHtml(post.title, {
        allowedTags: [],
        allowedAttributes: {},
      }),
      content: cleanQuillEditor(post.content),
    };

    return {
      ...postData,
      slug: this.slugifyTitle(postData.title),
      images: this.mapImageData(post.images, postData.title),
    };
  }

  private static slugifyTitle(title: string) {
    return slugify(title, {
      lower: true,
      remove: new RegExp(`[${this.specialCharacters}]`),
    });
  }

  private static mapImageData(images: PostBody['images'], alt: string) {
    return images.map((image) => {
      return {
        identifier: image.identifier,
        alt: alt,
      };
    });
  }
}

export default PostTransformer;
