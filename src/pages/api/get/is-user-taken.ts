import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import UserRepository from '../../../repository/UserRepository';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  const userRepository = new UserRepository();

  try {
    const isUserTaken = await userRepository.checkIfUserExists(req.body);

    res.status(200).json({ isUserTaken: isUserTaken });
  } catch (err) {
    console.error(`ERR: ${err}`);
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(400).json('Bad Request');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};
