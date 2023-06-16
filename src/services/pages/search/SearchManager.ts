import Post, { IPostDocument } from '../../../models/Post';
import LikeRepository from '../../../repository/LikeRepository';
import { PostType } from '../../../types/types';
import dbConnect from '../../../utils/dbConnect';
import PostsDataProcessor from '../../posts/PostsDataProcessor';
import PostsService from '../../posts/PostsService';
import Sidebar from '../../sidebar/SidebarHomepage';

class SearchManager {
  private queryString;
  private sessionUserId;

  constructor(queryString: string | string[], sessionUserId: string | unknown) {
    this.queryString = queryString;
    this.sessionUserId = sessionUserId;
  }

  public async getData() {
    await dbConnect();

    const posts = await this.getProcessedPosts();
    const sidebar = new Sidebar();

    return {
      posts: posts,
      sidebar: await sidebar.getData(),
    };
  }

  private async getProcessedPosts() {
    let posts = await this.getSearchResults();

    const postsService = new PostsService();
    postsService.setPosts(posts);

    const likeRepository = new LikeRepository();
    const currentUserLikes = await likeRepository.getLikes(
      this.sessionUserId,
      postsService.getLikedPostsId()
    );

    const postsDataProcessor = new PostsDataProcessor(posts, currentUserLikes);
    posts = postsDataProcessor.init();

    return posts;
  }

  private async getSearchResults() {
    const result: IPostDocument[] = await Post.aggregate().search({
      index: 'default',
      text: {
        query: this.queryString,
        path: {
          wildcard: '*',
        },
      },
    });

    return JSON.parse(JSON.stringify(result)) as PostType[];
  }
}

export default SearchManager;
