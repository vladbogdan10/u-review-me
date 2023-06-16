import { PostBody } from '../../../pages/api/create/post';
import { ImageType } from '../../../types/types';
import AwsS3Client from '../../AwsS3Client';
import sharp from 'sharp';

class PostImagesService {
  private s3;

  constructor() {
    this.s3 = new AwsS3Client();
  }

  public async saveImages(images: PostBody['images']) {
    const imageList = await this.generateMultipleSizeImages(
      this.base64ToBuffer(images),
      [1200]
    );

    for (const image of imageList) {
      try {
        await this.s3.uploadImage('images', image.identifier, image.buffer);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to save image to S3');
      }
    }
  }

  public async deleteImages(images: ImageType[]) {
    for (const image of images) {
      try {
        await this.s3.deleteImage('images', image.identifier);
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete image from S3');
      }
    }
  }

  private async generateMultipleSizeImages(
    images: {
      buffer: Buffer;
      identifier: string;
    }[],
    sizes: number[]
  ) {
    const imageList = [...images];

    for (const image of images) {
      for (const size of sizes) {
        try {
          const imageBuffer = await sharp(image.buffer)
            .resize(size, size, { fit: 'inside' })
            .jpeg({ quality: 70 })
            .toBuffer();

          imageList.push({
            buffer: imageBuffer,
            identifier: image.identifier + '-' + size,
          });
        } catch (error) {
          throw new Error('Failed to generate multipe size images');
        }
      }
    }

    return imageList;
  }

  private base64ToBuffer(images: PostBody['images']) {
    const regex = /^data:image\/\w+;base64,/;

    return images.map((image) => {
      const base64Image: string = image.dataURL.replace(regex, '');
      const buffer = Buffer.from(base64Image, 'base64');

      return {
        buffer: buffer,
        identifier: image.identifier,
      };
    });
  }
}

export default PostImagesService;
