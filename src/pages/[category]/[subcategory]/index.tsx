import React from 'react';
import Head from 'next/head';
import Category from '../../../components/Category/Category';
import { GetServerSideProps } from 'next';
import categories from '../../../../categories.json';
import SubcategoryManager from '../../../services/pages/subcategory/SubcategoryManager';
import { getSession } from 'next-auth/react';
import { CategoryPageProps } from '../index';
import { Container } from '@material-ui/core';
import { CategoryType } from '../../../types/types';

interface SubcategoryPageProps extends CategoryPageProps {
  subcategory: string;
}

const SubcategoryPage = (props: SubcategoryPageProps) => {
  const category = (categories as CategoryType)[props.category];
  const subcategory = category.subcategories[props.subcategory];

  return (
    <>
      <Head>
        <title>{`${subcategory.title} - u-review.me`}</title>
        <meta name="description" content={subcategory.description} />
        <link
          rel="canonical"
          href={`https://u-review.me/${props.category}/${props.subcategory}`}
        />
        {props.posts.length < 3 && <meta name="robots" content="noindex" />}
      </Head>
      <Container maxWidth={false}>
        <Category {...props} />
      </Container>
    </>
  );
};
export default SubcategoryPage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });
  const category = params?.category as string;
  const subcategory = params?.subcategory as string;

  try {
    const subcategoryExists = (categories as CategoryType)[category]
      .subcategories[subcategory];

    if (!subcategoryExists) {
      throw new Error(
        `Category "${category}" or subcategory "${subcategory}" does not exist`
      );
    }

    const subcategoryManager = new SubcategoryManager(
      category,
      subcategory,
      session?.user.id
    );

    const data = await subcategoryManager.getData();

    return {
      props: {
        ...data,
        category,
        subcategory,
      },
    };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};
