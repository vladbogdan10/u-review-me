import React, { useContext, useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { CommentType } from '../../types/types';
import Comment from '../Comment/Comment';
import CommentCreate from '../Comment/CommentCreate';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import {
  LoginSignupButton,
  LoginSignupButtons,
} from '../common/ActionButtons/LoginSignupButtons';
import { Typography, useMediaQuery } from '@material-ui/core';
import {
  FinishAccountSetupButton,
  FinishAccountSetupButtonMobile,
} from '../common/ActionButtons/FinishAccountSetupButton';
import { Session } from 'next-auth';
import { GlobalContext } from '../../context/global-context';
import { NEW_COMMENT } from '../../context/actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    actionButtons: {
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.grey[600]}`,
      borderRadius: theme.shape.borderRadius,
      [theme.breakpoints.up('sm')]: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    },
    circularProgress: {
      display: 'flex',
      justifyContent: 'center',
      minHeight: '200px',
    },
    commentsContainer: {
      marginTop: theme.spacing(3),
    },
  })
);

const updateCommentList = (
  commentList: [] | CommentType[],
  comment: CommentType
) => {
  const comments = [...commentList];

  const siblingIndex = commentList.findIndex(
    (i) => i._id === comment.repliesTo.id
  );

  comments.splice(siblingIndex + 1, 0, comment);

  return comments;
};

const CommentSection = (props: {
  comments: CommentType[];
  postId: string;
  session: Session | null;
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('xs'));

  const [comments, setComments] = useState(props.comments);
  const { globalState, dispatchAction } = useContext(GlobalContext);

  useEffect(() => {
    setComments(props.comments);
  }, [props.comments]);

  useEffect(() => {
    if (globalState.newComment) {
      const commentList = updateCommentList(comments, globalState.newComment);

      setComments(commentList);
      dispatchAction({ type: NEW_COMMENT, payload: null });
    }
  }, [globalState.newComment]);

  return (
    <Paper elevation={0} component="section" className={classes.root}>
      <>
        {props.session ? (
          <>
            {props.session.user.newUser ? (
              <>
                {isMobileView ? (
                  <FinishAccountSetupButtonMobile />
                ) : (
                  <div className={classes.actionButtons}>
                    <Typography>
                      Please finish setting up your account to leave a comment
                    </Typography>
                    <FinishAccountSetupButton />
                  </div>
                )}
              </>
            ) : (
              <CommentCreate postId={props.postId} isReply={false} />
            )}
          </>
        ) : (
          <>
            {isMobileView ? (
              <LoginSignupButton />
            ) : (
              <div className={classes.actionButtons}>
                <Typography>Log in or sign up to leave a comment</Typography>
                <LoginSignupButtons />
              </div>
            )}
          </>
        )}
      </>
      {comments.length > 0 && (
        <div className={classes.commentsContainer}>
          {comments.map((comment) => (
            <Comment comment={comment} noIndent={false} key={comment._id} />
          ))}
        </div>
      )}
    </Paper>
  );
};

export default CommentSection;
