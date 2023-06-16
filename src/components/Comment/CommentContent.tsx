import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NextLink from 'next/link';
import { CommentType } from '../../types/types';

const useStyles = makeStyles(() =>
  createStyles({
    comment: {
      padding: 0,
      height: 'auto',
    },
  })
);

interface CommentContentProps extends CommentType {
  content: string;
}

const CommentContent = (props: CommentContentProps) => {
  const classes = useStyles();

  return (
    <>
      {props.repliesTo.username && props.level === 2 && (
        <NextLink
          href={`/user/${props.repliesTo.username}`}
          prefetch={false}
          passHref
        >
          <Link>@{props.repliesTo.username}</Link>
        </NextLink>
      )}
      <Typography
        className={`${classes.comment} ql-editor`}
        variant="body2"
        component="div"
        dangerouslySetInnerHTML={{
          __html: props.content,
        }}
      ></Typography>
    </>
  );
};

export default CommentContent;
