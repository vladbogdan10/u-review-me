import Comment from '../../../models/Comment';
import Like, { ILikeDocument } from '../../../models/Like';
import Post from '../../../models/Post';
import { LikeBody } from '../../../pages/api/create/like';

class LikeManager {
  private like;

  constructor(like: LikeBody) {
    this.like = like;
  }

  public async createLike() {
    const result: ILikeDocument = await Like.create(this.like);

    if (!result) {
      throw new Error(
        `Could not create like for userId: ${this.like.userId}, contentId: ${this.like.contentId}`
      );
    }

    await this.updateLikeCounts(1);

    return result;
  }

  public async deleteLike() {
    const result = await Like.deleteOne({
      userId: this.like.userId,
      contentId: this.like.contentId,
    });

    if (result.deletedCount === 0) {
      throw new Error(
        `Cannot delete! Like with userId: ${this.like.userId}, contentId: ${this.like.contentId} not found`
      );
    }

    await this.updateLikeCounts(-1);
  }

  private async updateLikeCounts(updateCountsBy: 1 | -1) {
    let model = Post;
    if (this.like.contentType === 'Comment') {
      model = Comment;
    }

    const result = await model.findByIdAndUpdate(
      { _id: this.like.contentId },
      { $inc: { likes: updateCountsBy } }
    );

    if (!result) {
      throw new Error(
        `Could not update like counts for id: ${this.like.contentId}`
      );
    }
  }
}

export default LikeManager;
