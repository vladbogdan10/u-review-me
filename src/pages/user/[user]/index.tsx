import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Grid from '@material-ui/core/Grid';
import Navigation from '../../../components/User/Navigation';
import MainContainer from '../../../components/User/MainContainer';
import UserProfile from '../../../components/User/UserProfile';
import { UserType } from '../../../types/types';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import UserProfileLoggedIn from '../../../components/User/UserProfileLoggedIn';
import { Container } from '@material-ui/core';
import Footer from '../../../components/Footer/Footer';
import UserRepository from '../../../repository/UserRepository';

const Main = (props: {
  user: UserType;
  username: string;
  session: Session | null;
}) => {
  const page = 'profile';
  const username = props.username;

  return (
    <>
      <Head>
        <title>{username} Profile - u-review.me</title>
        <meta title="description" content={`User ${username} profile page`} />
      </Head>

      <Container maxWidth={false} style={{ marginBottom: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} component="aside">
            <Navigation username={username} />
          </Grid>
          <Grid item xs={12} md={8} component="main">
            <MainContainer
              component={
                props.session?.user.username === username ? (
                  <UserProfileLoggedIn {...props} />
                ) : (
                  <UserProfile {...props} />
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
  await dbConnect();
  const session = await getSession({ req });

  // TODO: fix user type
  const username = params?.user as string;
  const userRepository = new UserRepository();

  try {
    let user = await userRepository.findByUsername(username);

    if (!user) {
      throw new Error(`No user found for username: ${username}`);
    }

    // TODO: create global constant for new user url
    if (user.newUser) {
      return {
        redirect: {
          statusCode: 302,
          destination: '/auth/new-user',
        },
      };
    }

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)) as UserType,
        username: user.username,
        session: session,
      },
    };
  } catch (error) {
    console.info(error);

    return { notFound: true };
  }
};

export default Main;
