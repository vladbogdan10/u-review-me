import React from 'react';
import Grid from '@material-ui/core/Grid';
import PostCard from '../PostCard/PostCard';
import CreatePostCTA from './CreatePostCTA';
import { PostType } from '../../types/types';
import NoContentPlaceholder from '../common/NoContentPlaceholder';

const Feed = (props: { posts: PostType[] }) => {
  const { posts } = props;

  return (
    <>
      <Grid item xs={12} md={8} component="main">
        <CreatePostCTA />
        {posts.length === 0 ? (
          <NoContentPlaceholder
            title="No reviews in this category. Be the first to add one! &#128568;"
            type="reviews"
          />
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} {...post} isFullSizedPost={false} />
          ))
        )}
      </Grid>
    </>
  );
};

export default Feed;
