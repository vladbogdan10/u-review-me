import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

class AwsS3Client {
  readonly BUCKET_NAME = process.env.S3_BUCKET_NAME;

  public async uploadImage(
    path: string,
    imageIdentifier: string,
    body: Buffer
  ) {
    const command = new PutObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `${path}/${imageIdentifier}.jpeg`,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000',
      Body: body,
    });

    await this.saveToS3(command);
  }

  public async deleteImage(path: string, imageIdentifier: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.BUCKET_NAME,
      Key: `${path}/${imageIdentifier}.jpeg`,
    });

    await this.saveToS3(command);
  }

  private async saveToS3<T>(command: T) {
    const client = this.s3Client();

    try {
      // @ts-ignore
      await client.send(command);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to upload to s3');
    }
  }

  private s3Client() {
    return new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY ?? '',
      },
    });
  }
}

export default AwsS3Client;
