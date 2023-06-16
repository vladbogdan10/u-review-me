import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Theme, withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import PostRating from '../PostRating/PostRating';
import { useRouter } from 'next/router';
import { GlobalContext } from '../../context/global-context';
import { EDIT_POST, SHOW_NOTIFICATION } from '../../context/actions';
import DialogTitle from './DialogTitle';
import dynamic from 'next/dynamic';
import { PostType } from '../../types/types';

const ReactQuill = dynamic(() => import('./RichTextEditor/ReactQuill'), {
  ssr: false,
});

const ReactQuillBubble = dynamic(
  () => import('./RichTextEditor/ReactQuillBubble'),
  {
    ssr: false,
  }
);

const EditPost = (props: PostType) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobileView = useMediaQuery(theme.breakpoints.down('xs'));

  const [isDisabled, setIsDisabled] = useState(true);

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const initialState = {
    id: props._id,
    title: props.title,
    content: props.content,
    rating: props.rating,
    authorId: props.author.id,
  };

  const [post, setPost] = useState(initialState);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (globalState.postWordsCount >= 150) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [post, globalState.postWordsCount]);

  const setContent = (content: string) => {
    setPost({ ...post, content: content });
  };

  const setRating = (_e: ChangeEvent<{}>, value: number | null) => {
    const rating = value ?? post.rating;
    setPost({ ...post, rating: rating });
  };

  const handleClose = () => {
    if (post.content !== props.content) {
      handleCloseAction('Are you sure that you want to discard your edits?');
    } else {
      resetState();
    }
  };

  const handleCloseAction = (message: string) => {
    const alertDiscard = confirm(message);

    if (alertDiscard === true) {
      resetState();
    }
  };

  if (typeof window !== 'undefined') {
    window.onbeforeunload = (e: Event) => {
      if (post.content !== props.content) {
        e.preventDefault();
        e.returnValue = true;
      }
    };
  }

  const sendRequest = async () => {
    const response = await fetch(`/api/update/post`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    resetState();

    const res = await response.json();
    router.push(
      `/${res.post.category}/${res.post.subcategory}/${res.post.urlId}/${res.post.slug}`
    );
  };

  const resetState = () => {
    setPost(initialState);
    dispatchAction({ type: EDIT_POST, payload: null });
  };

  return (
    <Dialog
      aria-labelledby="edit-post"
      role="edit-post"
      fullWidth
      maxWidth="md"
      fullScreen={isMobileView}
      open={globalState.editedPostId ? true : false}
    >
      <DialogTitle onClose={handleClose}>Edit Review</DialogTitle>
      <DialogContent dividers>
        <Box mt={1.5} mb={1.5}>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            fullWidth
            value={post.title}
            margin="none"
            disabled={true}
          />
        </Box>
        {isMobileView ? (
          <ReactQuillBubble onChange={setContent} value={post.content} />
        ) : (
          <ReactQuill onChange={setContent} value={post.content} />
        )}
      </DialogContent>
      <DialogActions>
        <PostRating rating={post.rating} setRating={setRating} />
        <div>
          {!isMobileView && (
            <Box mr={1} clone>
              <Button variant="outlined" onClick={handleClose} color="primary">
                Cancel
              </Button>
            </Box>
          )}
          <Button
            variant="contained"
            onClick={sendRequest}
            disabled={isDisabled}
            color="primary"
            size={isMobileView ? 'small' : 'medium'}
          >
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    justifyContent: 'space-between',
  },
}))(MuiDialogActions);

export default EditPost;
