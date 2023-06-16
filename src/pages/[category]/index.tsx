import React from 'react';
import Head from 'next/head';
import Category from '../../components/Category/Category';
import { GetServerSideProps } from 'next';
import categories from '../../../categories.json';
import { getSession } from 'next-auth/react';
import { CategoryType, PostType } from '../../types/types';
import CategoryManager from '../../services/pages/category/CategoryManager';
import { Container } from '@material-ui/core';

export interface CategoryPageProps {
  posts: [] | PostType[];
  sidebar: {
    latestPosts: PostType[];
    mostHelpful: PostType[];
  };
  category: string;
}

const CategoryPage = (props: CategoryPageProps) => {
  const category = (categories as CategoryType)[props.category];

  return (
    <>
      <Head>
        <title>{`${category.title} - u-review.me`}</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={`https://u-review.me/${props.category}`} />
        {props.posts.length < 3 && <meta name="robots" content="noindex" />}
      </Head>
      <Container maxWidth={false}>
        <Category {...props} />
      </Container>
    </>
  );
};
export default CategoryPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const category = params?.category as string;

  try {
    const categoryExists = (categories as CategoryType)[category];

    if (!categoryExists) {
      throw new Error(`Category "${category}" does not exist`);
    }

    const categoryManager = new CategoryManager(category, session?.user.id);

    const data = await categoryManager.getData();

    return {
      props: {
        ...data,
        category,
      },
    };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};
