import CommentRepository from '../../../repository/CommentRepository';
import LikeRepository from '../../../repository/LikeRepository';
import dbConnect from '../../../utils/dbConnect';
import CommentsDataProcessor from '../../comments/CommentsDataProcessor';
import CommentsService from '../../comments/CommentsService';
import UserCommentsTransformer from '../../user/UserCommentsTransformer';

class UserCommentsManager {
  private username;
  private sessionUserId;

  constructor(username: string, sessionUserId: string | unknown) {
    this.username = username;
    this.sessionUserId = sessionUserId;
  }

  public async getData() {
    await dbConnect();

    const commentRepository = new CommentRepository();
    const userComments = await commentRepository.getCommentsWithPostByUserName(
      this.username,
      'desc'
    );

    const commentsService = new CommentsService();
    commentsService.setComments(userComments);

    const likeRepository = new LikeRepository();
    const currentUserLikes = await likeRepository.getLikes(
      this.sessionUserId,
      commentsService.getLikedCommentsId()
    );

    const commentsDataProcessor = new CommentsDataProcessor(
      userComments,
      currentUserLikes
    );

    const processedComments = commentsDataProcessor.init();
    const comments = UserCommentsTransformer.transform(processedComments);

    return comments;
  }
}

export default UserCommentsManager;
