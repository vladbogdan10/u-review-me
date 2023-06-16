import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import LinkNext from 'next/link';
import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { CommentType } from '../../types/types';
import Tooltip from '@material-ui/core/Tooltip';

dayjs.extend(RelativeTime);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flex: '1 1 auto',
      flexWrap: 'wrap',
      marginBottom: '4px',
      paddingRight: theme.spacing(2),
    },
    commentName: {
      paddingRight: '5px',
      fontWeight: 500,
      fontSize: '13px',
    },
    caption: {
      color: theme.palette.grey[500],
    },
  })
);

const Comment = (props: CommentType) => {
  const classes = useStyles();
  const formattedCreateDate = new Date(props.createdAt).toDateString();
  const formattedUpdatedDate = props.commentUpdatedAt
    ? new Date(props.commentUpdatedAt).toDateString()
    : null;

  return (
    <div className={classes.root}>
      {props.author.id === null ? (
        <Typography className={classes.commentName}>
          {props.author.username}
        </Typography>
      ) : (
        <LinkNext
          href={`/user/${props.author.username}`}
          prefetch={false}
          passHref
        >
          <Link underline="none" color="textPrimary">
            <Typography className={classes.commentName} variant="body2">
              {props.author.username}
            </Typography>
          </Link>
        </LinkNext>
      )}
      <Tooltip disableFocusListener title={formattedCreateDate}>
        <Typography
          className={classes.caption}
          component="span"
          variant="caption"
        >
          {dayjs(props.createdAt).fromNow()}
        </Typography>
      </Tooltip>
      {props.commentUpdatedAt && formattedUpdatedDate && (
        <Tooltip disableFocusListener title={formattedUpdatedDate}>
          <Typography
            className={classes.caption}
            component="span"
            variant="caption"
            style={{ fontStyle: 'italic' }}
          >
            &nbsp;- edited {dayjs(props.commentUpdatedAt).fromNow()}
          </Typography>
        </Tooltip>
      )}
    </div>
  );
};

export default Comment;
