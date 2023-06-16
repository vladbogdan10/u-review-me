import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import PostManager from '../../../services/api/post/PostManager';
import isReqAllowed from '../../../utils/isReqAllowed';

export type PostUpdateBody = {
  id: string;
  title: string;
  content: string;
  rating: number;
  authorId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const post: PostUpdateBody = req.body;

  const isRequestAllowed = await isReqAllowed(req, res, post.authorId);
  if (!isRequestAllowed) return;

  await dbConnect();
  const postManager = new PostManager();

  try {
    if (!post.id || !post.content || !post.rating) {
      throw new Error('One or more mandatory properties are missing!').stack;
    }

    const result = await postManager.updatePost(post);

    res.status(200).json({
      success: true,
      post: result,
    });
  } catch (err) {
    console.error(`ERR: ${err}`);
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(400).send('Bad Request');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};
