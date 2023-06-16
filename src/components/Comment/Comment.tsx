import React, { useState, MouseEvent, useContext } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { CommentType } from '../../types/types';
import CommentCreate from './CommentCreate';
import CommentContent from './CommentContent';
import CommentActions from './CommentActions';
import CommentHeader from './CommentHeader';
import MoreOptionsMenu from '../MoreOptionsMenu/MoreOptionsMenu';
import CommentAvatar from './CommentAvatar';
import Typography from '@material-ui/core/Typography';
import { GlobalContext } from '../../context/global-context';
import { SHOW_NOTIFICATION } from '../../context/actions';
import { useSession } from 'next-auth/react';
import CommentEdit from './CommentEdit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      position: 'relative',
      paddingTop: theme.spacing(2),
    },
    indent: {
      marginLeft: '56px',
    },
    caption: {
      color: theme.palette.grey[500],
    },
    headerAction: {
      position: 'absolute',
      right: 0,
      marginTop: '-6px',
      marginRight: '-12px',
    },
    deletedComment: {
      display: 'flex',
    },
    deletedCommentText: {
      alignSelf: 'center',
      color: theme.palette.grey[500],
      fontStyle: 'italic',
    },
  })
);

export interface CommentProps {
  comment: CommentType;
  noIndent?: boolean;
  postUrl?: string;
}

const Comment = (props: CommentProps) => {
  const classes = useStyles();
  const { comment, noIndent } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [content, setContent] = useState(comment.content);
  const [isDeleted, setIsDeleted] = useState(comment.isDeleted);
  const [isReply, setIsReply] = useState(false);
  const { data: session } = useSession();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    setIsEdit(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    const alertDiscard = confirm(
      "Are you sure you want to delete your comment? You can't undo this."
    );

    if (alertDiscard === true) {
      const response = await sendRequest('delete', {
        id: comment._id,
        authorId: comment.author.id,
      });

      if (response.ok) {
        handleClose();
        setIsDeleted(true);
      }
    } else {
      handleClose();
    }
  };

  const sendRequest = async (path: string, payload: object) => {
    const response = await fetch(`/api/${path}/comment`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });
    }

    return response;
  };

  const commentIndent = !noIndent && comment.level > 0 ? classes.indent : '';

  return (
    <>
      {isDeleted && !comment.hasReplies ? (
        ''
      ) : isDeleted && comment.hasReplies ? (
        <div className={`${classes.root} ${commentIndent}`}>
          <div className={classes.deletedComment}>
            <CommentAvatar {...props} />
            <Typography
              variant="caption"
              className={classes.deletedCommentText}
            >
              Comment deleted by user
            </Typography>
          </div>
        </div>
      ) : (
        <article
          className={`${classes.root} ${commentIndent}`}
          id={props.comment._id}
        >
          <CommentAvatar {...props} />
          <Box width="100%">
            <CommentHeader {...comment} />
            {isEdit ? (
              <CommentEdit
                content={content}
                comment={comment}
                setContent={setContent}
                setIsEdit={setIsEdit}
              />
            ) : (
              <CommentContent {...comment} content={content} />
            )}
            <CommentActions {...props} setIsReply={setIsReply} />
            {isReply && (
              <CommentCreate
                postId={comment.post}
                isReply={isReply}
                setIsReply={setIsReply}
                parentComment={comment}
              />
            )}
          </Box>
          {session && session.user.id === comment.author.id && (
            <div className={classes.headerAction}>
              <MoreOptionsMenu
                anchorEl={anchorEl}
                handleClick={handleClick}
                handleEdit={handleEdit}
                handleClose={handleClose}
                handleDelete={handleDelete}
                isComment={true}
              />
            </div>
          )}
        </article>
      )}
    </>
  );
};

export default Comment;
