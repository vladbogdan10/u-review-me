import React, { useContext, useEffect, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import { PostType } from '../../types/types';
import PostCardHeader from './PostCardHeader';
import PostCardContent from './PostCardContent';
import PostCardActions from './PostCardActions';
import { Product } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';
import truncate from 'truncate-html';
import { GlobalContext } from '../../context/global-context';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '100%',
      marginBottom: (isFullSizedPost) =>
        isFullSizedPost ? 0 : theme.spacing(1.5),
    },
    hover: {
      transition: '0.05s',
      '& .ql-editor > *': {
        cursor: 'inherit',
      },
      '&:hover': {
        cursor: 'pointer',
        border: `1px solid ${theme.palette.grey[300]}`,
      },
    },
  })
);

export interface PostCardProps extends PostType {
  isFullSizedPost: boolean;
}

const PostCard = (props: PostCardProps) => {
  const classes = useStyles(props.isFullSizedPost);

  const [post, setPost] = useState(props);
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const router = useRouter();
  const card = useRef<HTMLInputElement | null>(null);

  if (!props.isFullSizedPost && card.current) {
    card.current.onclick = (e) =>
      e.target ? cardClickHandler(e.target as Element) : null;
  }

  const cardClickHandler = (targetElement: Element) => {
    if (targetElement.closest('button') || targetElement.closest('a')) {
      return;
    }

    router.push(
      `/${props.category}/${props.subcategory}/${props.urlId}/${props.slug}`
    );
  };

  useEffect(() => {
    setPost(props);
  }, [props]);

  useEffect(() => {
    if (globalState.deletedPostId === post._id) {
      setPost({
        ...post,
        isDeleted: true,
      });
    }
  }, [globalState.deletedPostId]);

  const jsonLdImage = post.images[0]
    ? `${process.env.NEXT_PUBLIC_S3_ASSETS_PATH}/images/${post.images[0].identifier}.jpeg`
    : undefined;

  return (
    <>
      {post.isFullSizedPost && (
        <JsonLd<Product>
          item={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            image: jsonLdImage,
            name: post.title,
            review: {
              '@type': 'Review',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: post.rating,
                worstRating: 1,
                bestRating: 5,
              },
              name: post.title,
              author: {
                '@type': 'Person',
                name: post.author.username,
              },
              dateModified: post.postUpdatedAt ? post.postUpdatedAt : undefined,
              datePublished: post.createdAt,
              reviewBody: truncate(post.content, post.content.length, {
                stripTags: true,
              }),
              publisher: {
                '@type': 'Organization',
                name: 'u-review.me',
              },
            },
          }}
        />
      )}
      {!post.isFullSizedPost && post.isDeleted ? undefined : (
        <Card
          ref={card}
          variant={post.isFullSizedPost ? undefined : 'outlined'}
          elevation={0}
          className={`${classes.root} ${
            props.isFullSizedPost ? '' : classes.hover
          }`}
          component="article"
        >
          <PostCardHeader {...post} />
          <PostCardContent {...post} />
          <PostCardActions {...post} />
        </Card>
      )}
    </>
  );
};

export default PostCard;
