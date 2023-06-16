import React from 'react';
import Grid from '@material-ui/core/Grid';
import Sidebar from '../Sidebar/Sidebar';
import PostCard from '../PostCard/PostCard';
import CommentSection from './CommentSection';
import Paper from '@material-ui/core/Paper';
import { FullPostType } from '../../pages/[category]/[subcategory]/[urlId]/[post]';

const FullPost = (post: FullPostType) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} component="main">
        <Paper variant="outlined">
          <PostCard {...post.post} isFullSizedPost={true} />
          <CommentSection
            comments={post.comments}
            postId={post.post._id}
            session={post.session}
          />
        </Paper>
      </Grid>
      <Sidebar {...post.sidebar} />
    </Grid>
  );
};

export default FullPost;
