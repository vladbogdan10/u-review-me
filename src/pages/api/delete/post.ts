import type { NextApiRequest, NextApiResponse } from 'next';
import PostManager from '../../../services/api/post/PostManager';
import isReqAllowed from '../../../utils/isReqAllowed';
import dbConnect from '../../../utils/dbConnect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const reqData = {
    id: req.body.postId,
    authorId: req.body.authorId,
  };

  const isRequestAllowed = await isReqAllowed(req, res, reqData.authorId);

  if (!isRequestAllowed) return;

  await dbConnect();
  const postManager = new PostManager();

  try {
    await postManager.deletePost(reqData.id);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`ERR: ${err}`);
    res.status(500).send('Internal Server Error');
  }
};
