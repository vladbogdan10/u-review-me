import { LeanDocument } from 'mongoose';
import Like, { ILikeDocument } from '../models/Like';
import { LikeType } from '../types/types';

class LikeRepository {
  public async getLike(userId: string | undefined, contentId: string) {
    if (!userId) {
      return [];
    }

    const result: LeanDocument<ILikeDocument> = await Like.findOne({
      userId: userId,
      contentId: contentId,
    }).lean();

    return JSON.parse(JSON.stringify(result)) as LikeType;
  }

  public async getLikes(userId: string | unknown, contentIds: string[]) {
    if (!userId) {
      return [];
    }

    const result: LeanDocument<ILikeDocument[]> = await Like.find({
      userId: userId,
      contentId: { $in: contentIds },
    }).lean();

    return JSON.parse(JSON.stringify(result)) as LikeType[];
  }
}

export default LikeRepository;
