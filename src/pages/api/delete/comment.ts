import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import CommentManager from '../../../services/api/comment/CommentManager';
import isReqAllowed from '../../../utils/isReqAllowed';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqData = {
    id: req.body.id,
    authorId: req.body.authorId,
  };

  const isRequestAllowed = await isReqAllowed(req, res, reqData.authorId);
  if (!isRequestAllowed) return;

  await dbConnect();
  const commentManager = new CommentManager();

  try {
    await commentManager.deleteComment(reqData.id);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`ERR: ${err}`);
    res.status(500).send('Internal Server Error');
  }
};
