import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import LinkNext from 'next/link';
import { CommentProps } from './Comment';
import buildAvatarUrl from '../../utils/buildAvatarUrl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2),
    },
    avatarReplies: {
      width: 30,
      height: 30,
    },
  })
);

const CommentAvatar = (props: CommentProps) => {
  const classes = useStyles();

  const { comment } = props;

  const avatarSize =
    !props.noIndent && comment.level > 0 ? classes.avatarReplies : '';

  return (
    <div className={classes.root}>
      {comment.isDeleted ? (
        <Avatar className={avatarSize}>{'⌣_⌣'}</Avatar>
      ) : (
        <>
          {comment.author.id === null ? (
            <Avatar
              className={avatarSize}
              alt="User avatar"
              src={buildAvatarUrl(comment.author.image)}
              style={{ background: 'white' }}
            />
          ) : (
            <LinkNext
              href={`/user/${comment.author.username}`}
              prefetch={false}
              passHref
            >
              <Link underline="none">
                <Avatar
                  className={avatarSize}
                  alt="User avatar"
                  src={buildAvatarUrl(comment.author.image)}
                  style={{ background: 'white' }}
                />
              </Link>
            </LinkNext>
          )}
        </>
      )}
    </div>
  );
};

export default CommentAvatar;
