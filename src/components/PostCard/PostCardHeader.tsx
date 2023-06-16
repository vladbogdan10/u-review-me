import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { Box, Link, Tooltip } from '@material-ui/core';
import LinkNext from 'next/link';
import PostCardHeaderOptions from './PostCardHeaderOptions';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { PostCardProps } from './PostCard';
import { useSession } from 'next-auth/react';
import buildAvatarUrl from '../../utils/buildAvatarUrl';

dayjs.extend(RelativeTime);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    caption: {
      color: theme.palette.grey[500],
    },
    avatar: {
      backgroundColor: 'white',
      '&:hover': {
        outline: `${theme.palette.grey[300]} solid 1px`,
      },
    },
  })
);

const PostCardHeader = (post: PostCardProps) => {
  const classes = useStyles();
  const { data: session } = useSession();

  const formattedDate = new Date(post.createdAt).toDateString();

  return (
    <CardHeader
      disableTypography
      avatar={
        post.isDeleted ? (
          <Avatar>{'⌣_⌣'}</Avatar>
        ) : (
          <LinkNext
            href={`/user/${post.author.username}`}
            prefetch={false}
            passHref
          >
            <Link underline="none">
              <Avatar
                aria-label="avatar"
                className={classes.avatar}
                src={buildAvatarUrl(post.author.image)}
                alt="User avatar"
              />
            </Link>
          </LinkNext>
        )
      }
      title={
        <Box lineHeight={1.3} clone>
          <Typography
            variant="h6"
            component={post.isFullSizedPost ? 'h1' : 'h2'}
          >
            <LinkNext
              href={`/${post.category}/${post.subcategory}/${post.urlId}/${post.slug}`}
              prefetch={false}
              passHref
            >
              <Link underline="none" color="textPrimary">
                {post.title}
              </Link>
            </LinkNext>
          </Typography>
        </Box>
      }
      action={
        !post.isDeleted &&
        session &&
        session.user.id === post.author.id && (
          <PostCardHeaderOptions {...post} />
        )
      }
      subheader={
        <Typography variant="caption" className={classes.caption}>
          Posted by{' '}
          {post.isDeleted ? (
            'unknown'
          ) : (
            <>
              {post.author.id === null ? (
                <Typography variant="caption" color="textSecondary">
                  {post.author.username}
                </Typography>
              ) : (
                <LinkNext
                  href={`/user/${post.author.username}`}
                  prefetch={false}
                  passHref
                >
                  <Link color="textSecondary">
                    <strong>{post.author.username}</strong>
                  </Link>
                </LinkNext>
              )}
            </>
          )}{' '}
          <Tooltip disableFocusListener title={formattedDate}>
            <time dateTime={post.createdAt}>
              {dayjs(post.createdAt).fromNow()}
            </time>
          </Tooltip>
        </Typography>
      }
    />
  );
};

export default PostCardHeader;
