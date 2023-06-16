import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NextLink from 'next/link';
import Comment from '../Comment/Comment';
import Paper from '@material-ui/core/Paper';
import { IUserComment } from '../../services/user/UserCommentsTransformer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: theme.spacing(1.5),
    },
    comments: {
      padding: theme.spacing(2),
      '& article': {
        '&:not(:last-child)': {
          borderBottom: `1px solid ${theme.palette.grey[700]}`,
          paddingBottom: theme.spacing(2),
        },
        '&:not(:first-child)': {
          paddingTop: theme.spacing(2),
        },
      },
    },
    header: {
      borderBottom: `1px solid ${theme.palette.grey[700]}`,
      padding: theme.spacing(2),
    },
  })
);

const UserComments = (props: {
  comments: IUserComment[];
  username: string;
}) => {
  const classes = useStyles();

  return (
    <>
      {props.comments.map((commentData) => (
        <div key={commentData.post._id} className={classes.root}>
          <Paper variant="outlined">
            <div className={classes.header}>
              <Typography component="h2" variant="body2" color="textPrimary">
                <NextLink
                  href={`/user/${props.username}`}
                  passHref
                  prefetch={false}
                >
                  <Link color="textPrimary">{props.username}</Link>
                </NextLink>{' '}
                <Typography
                  component="span"
                  variant="body2"
                  color="textSecondary"
                >
                  commented on
                </Typography>{' '}
                <NextLink
                  href={`/${commentData.post.category}/${commentData.post.subcategory}/${commentData.post.urlId}/${commentData.post.slug}`}
                  passHref
                  prefetch={false}
                >
                  <Link color="textPrimary">{commentData.post.title}</Link>
                </NextLink>
              </Typography>
            </div>
            <div className={classes.comments}>
              {commentData.comments.map((comment) => (
                <Comment
                  comment={comment}
                  noIndent={true}
                  postUrl={`/${commentData.post.category}/${commentData.post.subcategory}/${commentData.post.urlId}/${commentData.post.slug}#${comment._id}`}
                  key={comment._id}
                />
              ))}
            </div>
          </Paper>
        </div>
      ))}
    </>
  );
};

export default UserComments;
