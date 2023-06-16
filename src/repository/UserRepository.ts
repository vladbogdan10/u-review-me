import { LeanDocument } from 'mongoose';
import User, { IUserDocument } from '../models/User';

class UserRepository {
  public async checkIfUserExists(username: string) {
    const result = await User.exists({
      username: { $regex: username, $options: 'i' },
    });

    return result !== null ? true : false;
  }

  public async findByUsername(username: string) {
    const result: LeanDocument<IUserDocument> = await User.findOne({
      username: { $regex: username, $options: 'i' },
    }).lean();

    return result;
  }

  public async findById(userId: string) {
    const result: LeanDocument<IUserDocument> = await User.findById(
      userId
    ).lean();

    return result;
  }
}

export default UserRepository;
