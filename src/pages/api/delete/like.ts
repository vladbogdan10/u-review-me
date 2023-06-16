import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import LikeManager from '../../../services/api/like/LikeManager';
import { LikeBody } from '../create/like';
import isReqAllowed from '../../../utils/isReqAllowed';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const like: LikeBody = req.body;

  const isRequestAllowed = await isReqAllowed(req, res, like.userId);

  if (!isRequestAllowed) return;

  await dbConnect();
  const likesManager = new LikeManager(like);

  try {
    await likesManager.deleteLike();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`ERR: ${err}`);
    res.status(500).send('Internal Server Error');
  }
};
