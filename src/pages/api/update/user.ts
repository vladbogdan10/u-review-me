import type { NextApiRequest, NextApiResponse } from 'next';
import UserManager from '../../../services/api/user/UserManager';
import { UserType } from '../../../types/types';
import isReqAllowed from '../../../utils/isReqAllowed';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const userData: UserType = req.body;

  const isRequestAllowed = await isReqAllowed(req, res, userData._id);

  if (!isRequestAllowed) return;

  const userManager = new UserManager();

  try {
    await userManager.updateUser(userData);

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
