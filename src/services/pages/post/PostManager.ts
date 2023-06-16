import dbConnect from '../../../utils/dbConnect';
import Sidebar from '../../sidebar/SidebarPostPage';
import PostsService from '../../posts/PostsService';
import PostsDataProcessor from '../../posts/PostsDataProcessor';
import CommentsService from '../../comments/CommentsService';
import PostCommentsDataProcessor from '../../comments/PostCommentsDataProcessor';
import PostRepository from '../../../repository/PostRepository';
import LikeRepository from '../../../repository/LikeRepository';
import CommentRepository from '../../../repository/CommentRepository';

class PostManager {
  private urlId;
  private slug;
  private sessionUserId;
  private likeRepository;

  constructor(urlId: string, slug: string, sessionUserId: string | unknown) {
    this.urlId = urlId;
    this.slug = slug;
    this.sessionUserId = sessionUserId;
    this.likeRepository = new LikeRepository();
  }

  public async getData() {
    await dbConnect();

    const post = await this.getPost();

    if (!post) {
      return null;
    }

    const comments = await this.getComments(post._id);
    const sidebar = new Sidebar(post.category, post._id);

    return {
      post: post,
      comments: comments,
      sidebar: await sidebar.getData(),
    };
  }

  private async getPost() {
    const postRepository = new PostRepository();
    let post = await postRepository.getPostByUrlIdAndSlug(
      this.urlId,
      this.slug
    );

    if (!post) {
      return null;
    }

    const postsService = new PostsService();
    postsService.setPosts([post]);

    const currentUserLikes = await this.likeRepository.getLikes(
      this.sessionUserId,
      postsService.getLikedPostsId()
    );

    const postsDataProcessor = new PostsDataProcessor([post], currentUserLikes);
    post = postsDataProcessor.init()[0];

    return post;
  }

  private async getComments(postId: string) {
    const commentRepository = new CommentRepository();
    let comments = await commentRepository.getComentsByPostId(postId);

    const commentsService = new CommentsService();
    commentsService.setComments(comments);

    const currentUserLikes = await this.likeRepository.getLikes(
      this.sessionUserId,
      commentsService.getLikedCommentsId()
    );

    const commentsDataProcessor = new PostCommentsDataProcessor(
      comments,
      currentUserLikes
    );

    comments = commentsDataProcessor.init();

    return comments;
  }
}

export default PostManager;
