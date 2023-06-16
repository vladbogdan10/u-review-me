import React from 'react';
import { Box, Container, Grid, Paper, Typography } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import PostCard from '../components/PostCard/PostCard';
import Sidebar from '../components/Sidebar/Sidebar';
import { PostType } from '../types/types';
import SearchManager from '../services/pages/search/SearchManager';
import { getSession } from 'next-auth/react';
import NoContentPlaceholder from '../components/common/NoContentPlaceholder';
import Head from 'next/head';

interface SearchPageProps {
  posts: PostType[];
  query: string;
  sidebar: {
    latestPosts: PostType[];
    mostHelpful: PostType[];
  };
}

const SearchPage = (props: SearchPageProps) => {
  const { posts, query, sidebar } = props;

  return (
    <>
      <Head>
        <title>Search - u-review.me</title>
        <meta name="description" content="Search reviews on u-review.me" />
        <meta name="robots" content="noindex" />
      </Head>

      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} component="main">
            <Box p={2} mb={1.5} clone>
              <Paper variant="outlined">
                <Typography
                  variant="h5"
                  component="h1"
                  style={{ fontWeight: 'bold' }}
                >
                  Results for:{' '}
                  <span style={{ fontStyle: 'italic' }}>{query}</span>
                </Typography>
              </Paper>
            </Box>
            {posts.length === 0 ? (
              <NoContentPlaceholder
                title="No reviews yet for your search &#128576;"
                type="reviews"
              />
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} {...post} isFullSizedPost={false} />
              ))
            )}
          </Grid>
          <Sidebar {...sidebar} />
        </Grid>
      </Container>
    </>
  );
};

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const queryString = query.q;
  const session = await getSession({ req });

  if (!queryString) {
    return { notFound: true };
  }

  try {
    const searchManager = new SearchManager(queryString, session?.user.id);
    const data = await searchManager.getData();

    return {
      props: {
        ...data,
        query: queryString,
      },
    };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};
