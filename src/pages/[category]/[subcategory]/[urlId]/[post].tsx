import React from 'react';
import Head from 'next/head';
import FullPost from '../../../../components/Post/FullPost';
import { GetServerSideProps } from 'next';
import { PostType, CommentType } from '../../../../types/types';
import PostManager from '../../../../services/pages/post/PostManager';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { Container } from '@material-ui/core';
import truncate from 'truncate-html';

export interface FullPostType {
  post: PostType;
  comments: [] | CommentType[];
  sidebar: {
    latestPosts: PostType[];
    mostHelpful: PostType[];
  };
  session: Session | null;
  urlPath: string;
}

const Post = (props: FullPostType) => {
  return (
    <>
      <Head>
        <title>{props.post.title} - u-review.me</title>
        {props.post.isDeleted && <meta name="robots" content="noindex" />}
        <meta
          name="description"
          content={truncate(props.post.content, 25, {
            byWords: true,
            stripTags: true,
            excludes: ['h2', '.ql-pro', '.ql-con'],
          })}
        />
        <link rel="canonical" href={`https://u-review.me/${props.urlPath}`} />
      </Head>

      <Container maxWidth={false}>
        <FullPost {...props} />
      </Container>
    </>
  );
};
export default Post;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  const category = params?.category;
  const subcategory = params?.subcategory;
  const urlId = params?.urlId as string;
  const slug = params?.post as string;

  try {
    const postManager = new PostManager(urlId, slug, session?.user.id);
    const data = await postManager.getData();

    if (!data) {
      throw new Error(`No article found for urlId: ${urlId} and slug: ${slug}`);
    }

    const urlPath = `${data.post.category}/${data.post.subcategory}/${data.post.urlId}/${data.post.slug}`;

    if (
      category !== data.post.category ||
      subcategory !== data.post.subcategory
    ) {
      return {
        redirect: {
          permanent: false,
          destination: `/${urlPath}`,
        },
      };
    }

    return {
      props: {
        ...data,
        session,
        urlPath,
      },
    };
  } catch (error) {
    console.error(error);

    return { notFound: true };
  }
};
