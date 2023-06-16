import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import CommentManager from '../../../services/api/comment/CommentManager';
import isReqAllowed from '../../../utils/isReqAllowed';

export type CommentBody = {
  author: {
    id: string;
    username: string;
    image: string | null;
  };
  post: string;
  content: string;
  parent?: string;
  repliesTo?: {
    id: string;
    username: string | undefined;
  };
  level?: number | undefined;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed = await isReqAllowed(req, res);
  if (!isRequestAllowed) return;

  await dbConnect();

  const commentManager = new CommentManager();
  const comment: CommentBody = req.body;

  try {
    const result = await commentManager.createComment(comment);

    res.status(201).json({
      success: true,
      commentData: result,
    });
  } catch (err) {
    console.error(`ERR: ${err}`);
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(400).send(err);
    } else {
      res.status(500).send(err);
    }
  }
};
