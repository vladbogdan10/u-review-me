import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import { CommentType } from '../../types/types';
import { GlobalContext } from '../../context/global-context';
import { SHOW_NOTIFICATION } from '../../context/actions';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import dynamic from 'next/dynamic';

const CommentEditor = dynamic(() => import('./CommentEditor'), {
  ssr: false,
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `1px solid ${theme.palette.grey[600]}`,
      borderRadius: theme.shape.borderRadius,
      margin: `${theme.spacing(1)}px 0`,
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
      '& button:first-child': {
        marginRight: theme.spacing(1),
      },
    },
  })
);

interface CommentEditProps {
  content: string;
  comment: CommentType;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentEdit = (props: CommentEditProps) => {
  const classes = useStyles();
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const handleCancel = () => {
    if (props.content !== props.comment.content) {
      const alertDiscard = confirm(
        'Are you sure that you want to discard your edits?'
      );

      if (alertDiscard === true) {
        props.setContent(props.comment.content);

        props.setIsEdit(false);
      }
    } else {
      props.setIsEdit(false);
    }
  };

  const saveEdits = async () => {
    const response = await fetch('/api/update/comment', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: props.content,
        id: props.comment._id,
        authorId: props.comment.author.id,
      }),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    props.setIsEdit(false);
  };

  return (
    <>
      <div className={classes.root}>
        <CommentEditor
          content={props.content}
          setContent={props.setContent}
          isReply={false}
        />
      </div>
      <div className={classes.buttons}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={saveEdits}
        >
          Save edits
        </Button>
      </div>
    </>
  );
};

export default CommentEdit;
