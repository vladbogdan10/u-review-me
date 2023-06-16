import UserService from './UserService';
import User, { IUserDocument } from '../../../models/User';
import { UserType } from '../../../types/types';
import Post from '../../../models/Post';
import Comment from '../../../models/Comment';
import Account from '../../../models/Account';
import { nanoid } from 'nanoid';
import { toSvg } from 'jdenticon';

class UserManager {
  private userService;

  public constructor() {
    this.userService = new UserService();
  }

  public async updateUser(userData: UserType) {
    userData.image = await this.userService.saveImageAndReturnUrlOrIdentifier(
      userData.image
    );

    // returns the document unmodified
    // which is helpful for checking what data changed
    const result: IUserDocument | null = await User.findByIdAndUpdate(
      { _id: userData._id },
      userData
    );

    if (result === null) {
      throw new Error(`Cannot update! User with id: ${userData._id} not found`);
    }

    await this.updateUserImageOnAllContent(result, userData.image);
  }

  public async deleteUser(userId: string) {
    const user: UserType | null = await User.findOneAndDelete({ _id: userId });

    if (user === null) {
      throw new Error(
        `Something went wrong! User with id: ${userId} cannot be deleted`
      );
    }

    await Account.deleteOne({ userId: user._id });
    await this.updateDeletedUserContent(user._id);
  }

  private async updateUserImageOnAllContent(
    userData: IUserDocument,
    newImage: string
  ) {
    if (userData.image !== newImage) {
      await Post.updateMany(
        { 'author.id': userData._id },
        { 'author.image': newImage }
      );

      await Comment.updateMany(
        { 'author.id': userData._id },
        { 'author.image': newImage }
      );
    }
  }

  private async updateDeletedUserContent(userId: string) {
    await Post.updateMany(
      { 'author.id': userId },
      {
        'author.username': '[deleted]',
        'author.id': null,
        'author.image': UserManager.generateImage(),
      }
    );

    await Comment.updateMany(
      { 'author.id': userId },
      {
        'author.username': '[deleted]',
        'author.id': null,
        'author.image': UserManager.generateImage(),
      }
    );
  }

  private static generateImage() {
    const randomString = nanoid(6);
    const svgString = toSvg(randomString, 100);

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  }
}

export default UserManager;
