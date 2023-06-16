import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import LikeManager from '../../../services/api/like/LikeManager';
import { ILike } from '../../../models/Like';
import isReqAllowed from '../../../utils/isReqAllowed';

export type LikeBody = {
  contentType: ILike['contentType'];
  userId: string;
  contentId: string;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed = await isReqAllowed(req, res);
  if (!isRequestAllowed) return;

  await dbConnect();

  const like: LikeBody = req.body;
  const likesManager = new LikeManager(like);

  try {
    await likesManager.createLike();

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(`ERR: ${err}`);
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(400).send('Bad Request');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};
