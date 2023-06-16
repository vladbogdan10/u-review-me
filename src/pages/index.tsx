import React from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Homepage from '../components/Homepage/Homepage';
import { PostType } from '../types/types';
import HomepageManager from '../services/pages/homepage/HomepageManager';
import { getSession } from 'next-auth/react';
import { Container } from '@material-ui/core';

interface IndexPageProps {
  posts: PostType[];
  sidebar: {
    latestPosts: PostType[];
    mostHelpful: PostType[];
  };
}

const IndexPage = (props: IndexPageProps) => {
  return (
    <>
      <Head>
        <title>Tech and Game Reviews from Users like You - u-review.me</title>
        <meta
          name="description"
          content="u-review.me - a user reviews platform meant to encourage meaningful product reviews and experiences from users that own, use and test the products."
        />
        <link rel="canonical" href="https://u-review.me" />
      </Head>

      <Container maxWidth={false}>
        <Homepage {...props} />
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  try {
    const homepageManager = new HomepageManager(session?.user.id);
    const data = await homepageManager.getData();

    return { props: data };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};

export default IndexPage;
