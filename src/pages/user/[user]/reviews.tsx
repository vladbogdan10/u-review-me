import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Grid from '@material-ui/core/Grid';
import Navigation from '../../../components/User/Navigation';
import MainContainer from '../../../components/User/MainContainer';
import UserReviews from '../../../components/User/UserReviews';
import { PostType } from '../../../types/types';
import NoContentPlaceholder from '../../../components/common/NoContentPlaceholder';
import UserPostsManager from '../../../services/pages/user/UserPostsManager';
import { getSession } from 'next-auth/react';
import UserRepository from '../../../repository/UserRepository';
import { Container } from '@material-ui/core';
import Footer from '../../../components/Footer/Footer';

const Reviews = (props: { posts: PostType[]; username: string }) => {
  const username = props.username;
  const page = 'reviews';

  return (
    <>
      <Head>
        <title>{username} Reviews - u-review.me</title>
        <meta title="description" content={`User ${username} reviews page`} />
      </Head>

      <Container maxWidth={false} style={{ marginBottom: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} component="aside">
            <Navigation username={username} />
          </Grid>
          <Grid item xs={12} md={8} component="main">
            <MainContainer
              component={
                props.posts.length === 0 ? (
                  <NoContentPlaceholder
                    title="No reviews yet &#128575;"
                    type={page}
                  />
                ) : (
                  <UserReviews {...props} />
                )
              }
              header={{ username: username, page: page }}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  // TODO: fix user type
  const username = params?.user as string;
  const userRepository = new UserRepository();

  try {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new Error(`No user found for username: ${username}`);
    }

    if (user.newUser) {
      return {
        redirect: {
          statusCode: 302,
          destination: '/auth/new-user',
        },
      };
    }

    const userPostsManager = new UserPostsManager(
      user.username,
      session?.user.id
    );
    const posts = await userPostsManager.getData();

    return {
      props: {
        posts: posts,
        username: user.username,
      },
    };
  } catch (error) {
    console.info(error);

    return { notFound: true };
  }
};

export default Reviews;
