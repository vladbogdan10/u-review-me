import type { NextApiRequest, NextApiResponse } from 'next';
import isReqAllowed from '../../../utils/isReqAllowed';
import dbConnect from '../../../utils/dbConnect';
import UserManager from '../../../services/api/user/UserManager';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed = await isReqAllowed(req, res, req.body.userId);
  if (!isRequestAllowed) return;

  await dbConnect();
  const userManager = new UserManager();

  try {
    await userManager.deleteUser(req.body.userId);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(`ERR: ${err}`);
    res.status(500).send('Internal Server Error');
  }
};
