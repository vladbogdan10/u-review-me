import React from 'react';
import Grid from '@material-ui/core/Grid';
import Feed from '../Feed/Feed';
import Sidebar from '../Sidebar/Sidebar';
import { PostType } from '../../types/types';
import FeaturedCategories from '../FeaturedCategories/FeaturedCategories';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface HomepageProps {
  posts: PostType[];
  sidebar: {
    latestPosts: PostType[];
    mostHelpful: PostType[];
  };
}

const Homepage = (props: HomepageProps) => {
  const theme = useTheme();

  return (
    <>
      {useMediaQuery(theme.breakpoints.up('sm')) && <FeaturedCategories />}
      <Grid container spacing={3}>
        <Feed posts={props.posts} />
        <Sidebar {...props.sidebar} />
      </Grid>
    </>
  );
};

export default Homepage;
