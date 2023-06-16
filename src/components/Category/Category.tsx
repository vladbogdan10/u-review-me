import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Feed from '../Feed/Feed';
import Sidebar from '../Sidebar/Sidebar';
import { CategoryPageProps } from '../../pages/[category]';
import FeaturedCategories from '../FeaturedCategories/FeaturedCategories';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const Category = (props: CategoryPageProps) => {
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

export default Category;
