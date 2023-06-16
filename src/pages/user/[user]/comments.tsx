import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import Grid from '@material-ui/core/Grid';
import Navigation from '../../../components/User/Navigation';
import MainContainer from '../../../components/User/MainContainer';
import UserCommentsComponent from '../../../components/User/UserComments';
import NoContentPlaceholder from '../../../components/common/NoContentPlaceholder';
import UserCommentsManager from '../../../services/pages/user/UserCommentsManager';
import { getSession } from 'next-auth/react';
import UserRepository from '../../../repository/UserRepository';
import Footer from '../../../components/Footer/Footer';
import { Container } from '@material-ui/core';
import { IUserComment } from '../../../services/user/UserCommentsTransformer';

const Comments = (props: { comments: IUserComment[]; username: string }) => {
  const username = props.username;
  const page = 'comments';

  return (
    <>
      <Head>
        <title>{username} Comments - u-review.me</title>
        <meta title="description" content={`User ${username} comments page`} />
      </Head>

      <Container maxWidth={false} style={{ marginBottom: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} component="aside">
            <Navigation username={username} />
          </Grid>
          <Grid item xs={12} md={8} component="main">
            <MainContainer
              component={
                props.comments.length === 0 ? (
                  <NoContentPlaceholder
                    title="No comments yet &#128575;"
                    type={page}
                  />
                ) : (
                  <UserCommentsComponent {...props} />
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

    const userCommentsManager = new UserCommentsManager(
      user.username,
      session?.user.id
    );
    const comments = await userCommentsManager.getData();

    return {
      props: {
        comments: comments,
        username: user.username,
      },
    };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};

export default Comments;
