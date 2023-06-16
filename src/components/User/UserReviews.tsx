import React from 'react';
import { PostType } from '../../types/types';
import PostCard from '../PostCard/PostCard';

const UserReviews = (props: { posts: PostType[] }) => {
  const { posts } = props;

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} {...post} isFullSizedPost={false} />
      ))}
    </>
  );
};

export default UserReviews;
