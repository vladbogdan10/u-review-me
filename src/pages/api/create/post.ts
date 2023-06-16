import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import PostManager from '../../../services/api/post/PostManager';
import isReqAllowed from '../../../utils/isReqAllowed';

export type PostBody = {
  category: string;
  subcategory: string;
  title: string;
  content: string;
  images: {
    dataURL: string;
    identifier: string;
  }[];
  rating: number;
  author: {
    id: string;
    username: string;
    image: string | null;
  };
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const isRequestAllowed = await isReqAllowed(req, res);
  if (!isRequestAllowed) return;

  await dbConnect();

  const post: PostBody = req.body;
  const postManager = new PostManager();

  try {
    const result = await postManager.createPost(post);

    res.status(201).json({
      success: true,
      post: result,
    });
  } catch (err) {
    console.error(`ERR: ${err}`);
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(400).send('Bad Request');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
};
