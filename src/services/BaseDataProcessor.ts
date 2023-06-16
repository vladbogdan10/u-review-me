// TODO: fix types in this file
// @ts-nocheck
import { LikeType } from '../types/types';

class BaseDataProcessor<T> {
  protected data;

  constructor(data: T) {
    this.data = data;
  }

  protected setIsLikedByCurrentUser(currentUserLikes: LikeType[]) {
    const likeContentIds =
      BaseDataProcessor.getLikeContentIds(currentUserLikes);

    const dataWithLikedByCurrentUser = this.data.map((el: T) => {
      const contentId = el._id;
      if (likeContentIds[contentId]) {
        Object.assign(el, { isLikedByCurrentUser: true });
      }

      return el;
    });

    this.data = dataWithLikedByCurrentUser;
  }

  private static getLikeContentIds(currentUserLikes: LikeType[]) {
    const likeContentIds = currentUserLikes.reduce((ids, like) => {
      const id = like.contentId;
      ids[id] = like.contentId;

      return ids;
    }, {} as Record<string, string>);

    return likeContentIds;
  }
}

export default BaseDataProcessor;
