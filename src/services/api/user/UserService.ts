import { nanoid } from 'nanoid';
import AwsS3Client from '../../AwsS3Client';

class UserService {
  public async saveImageAndReturnUrlOrIdentifier(image: string) {
    const regex = /^data:image\/\w+;base64,/;

    if (image && image.match(regex)) {
      const base64Image = image.replace(regex, '');
      const imageIdentifier = await this.saveImageAndReturnIdentifier(
        base64Image
      );

      return imageIdentifier;
    }

    return image;
  }

  private async saveImageAndReturnIdentifier(base64Image: string) {
    const s3 = new AwsS3Client();

    const imageIdentifier = `avt-${nanoid()}`;
    const buf = Buffer.from(base64Image, 'base64');

    await s3.uploadImage('avatars', imageIdentifier, buf);

    return imageIdentifier;
  }
}

export default UserService;
