import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Button, Tooltip, Typography } from '@material-ui/core';
import cleanQuillEditor from '../../utils/cleanQuillEditor';
import { CommentType } from '../../types/types';
import { GlobalContext } from '../../context/global-context';
import { NEW_COMMENT, SHOW_NOTIFICATION } from '../../context/actions';
import { useSession } from 'next-auth/react';
import { Info } from '@material-ui/icons';
import dynamic from 'next/dynamic';

const CommentEditor = dynamic(() => import('./CommentEditor'), {
  ssr: false,
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    border: {
      border: `1px solid ${theme.palette.grey[600]}`,
      borderRadius: theme.shape.borderRadius,
    },
    reply: {
      margin: `${theme.spacing(1)}px 0`,
    },
    cancelButton: {
      marginRight: theme.spacing(1),
    },
    top: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(1, 2),
      borderBottom: `1px solid ${theme.palette.grey[600]}`,
    },
    bottom: {
      padding: theme.spacing(1),
      borderTop: `1px solid ${theme.palette.grey[600]}`,
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    info: {
      color: theme.palette.text.secondary,
    },
  })
);

interface CommentCreateProps {
  postId: string;
  isReply: boolean;
  parentComment?: CommentType;
  setIsReply?: Dispatch<SetStateAction<boolean>>;
}

const CommentCreate = (props: CommentCreateProps) => {
  const classes = useStyles();

  const [isDisabled, setIsDisabled] = useState(true);
  const [content, setContent] = useState('');
  const { data: session } = useSession();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  useEffect(() => {
    if (cleanQuillEditor(content) !== '') {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [content]);

  const commentData = {
    author: {
      id: session?.user.id,
      username: session?.user.username,
      image: session?.user.image,
    },
    post: props.postId,
    content: content,
  };

  if (props.isReply && props.parentComment) {
    const { parentComment } = props;

    Object.assign(commentData, {
      parent: parentComment.parent ?? parentComment._id,
      repliesTo: {
        id: parentComment._id,
        username: parentComment.author.username,
      },
      level: parentComment.level === 0 ? 1 : 2,
    });
  }

  const sendComment = async () => {
    const response = await fetch('/api/create/comment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    const responseJson = await response.json();
    dispatchAction({ type: NEW_COMMENT, payload: responseJson.commentData });

    setContent('');
    setReplyToFalse();
  };

  const setReplyToFalse = () => {
    if (props.setIsReply) {
      props.setIsReply(false);
    }
  };

  return (
    <>
      <div className={`${classes.border} ${props.isReply && classes.reply}`}>
        {!props.isReply && (
          <div className={classes.top}>
            <Typography component="span" color="textSecondary">
              Leave a comment
            </Typography>
            <Tooltip disableFocusListener title="Highlight text to modify">
              <Info fontSize="small" className={classes.info} />
            </Tooltip>
          </div>
        )}
        <CommentEditor
          content={content}
          setContent={setContent}
          isReply={props.isReply}
        />
        {!props.isReply && (
          <div className={classes.bottom}>
            <Button
              variant="contained"
              fullWidth
              size="small"
              disabled={isDisabled}
              onClick={sendComment}
              color="primary"
            >
              Comment
            </Button>
          </div>
        )}
      </div>
      {props.isReply && (
        <div className={classes.buttons}>
          <Button
            variant="outlined"
            size="small"
            onClick={setReplyToFalse}
            className={classes.cancelButton}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={isDisabled}
            onClick={sendComment}
            color="primary"
          >
            Reply
          </Button>
        </div>
      )}
    </>
  );
};

export default CommentCreate;
