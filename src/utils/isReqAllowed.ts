import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function isReqAllowed(
  req: NextApiRequest,
  res: NextApiResponse,
  idToCheckAgainst?: string
) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).send('401 Unauthorized');
    res.end();

    return false;
  }

  if (idToCheckAgainst && session.user.id !== idToCheckAgainst) {
    res.status(401).send('401 Unauthorized');
    res.end();

    return false;
  }

  return true;
}
