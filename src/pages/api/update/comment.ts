import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import CommentManager from '../../../services/api/comment/CommentManager';
import isReqAllowed from '../../../utils/isReqAllowed';

export type CommentUpdateBody = {
  id: string;
  content: string;
  authorId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const comment: CommentUpdateBody = req.body;

  const isRequestAllowed = await isReqAllowed(req, res, comment.authorId);
  if (!isRequestAllowed) return;

  await dbConnect();
  const commentManager = new CommentManager();

  try {
    if (!comment.id || !comment.content) {
      throw new Error('One or more mandatory properties are missing!').stack;
    }

    await commentManager.updateComment(comment);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`ERR: ${err}`);
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(400).send('Bad Request');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};
