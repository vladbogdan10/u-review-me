import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Theme, withStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import ImageUplad from './ImageUpload';
import Box from '@material-ui/core/Box';
import cleanQuillEditor from '../../utils/cleanQuillEditor';
import PostRating from '../PostRating/PostRating';
import { ImageListType } from 'react-images-uploading/dist/typings';
import { useRouter } from 'next/router';
import { GlobalContext } from '../../context/global-context';
import {
  OPEN_CREATE_POST_DIALOG,
  SET_NEW_POST_CATEGORY,
  SET_NEW_POST_SUBCATEGORY,
  SHOW_NOTIFICATION,
} from '../../context/actions';
import { useSession } from 'next-auth/react';
import DialogTitle from './DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@material-ui/core';

const ReactQuill = dynamic(() => import('./RichTextEditor/ReactQuill'), {
  ssr: false,
});

const ReactQuillBubble = dynamic(
  () => import('./RichTextEditor/ReactQuillBubble'),
  {
    ssr: false,
  }
);

const CreatePost = () => {
  const router = useRouter();
  const theme = useTheme();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const isMobileView = useMediaQuery(theme.breakpoints.down('xs'));
  const discardAlertTreshold: number = 11; // reactquill initial value
  const titlePlaceholder =
    globalState.newPostCategory === 'tech'
      ? 'e.g. Asus ZenBook 13" OLED'
      : 'e.g. Cyberpunk 2077';

  const [isDisabled, setIsDisabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();

  type InitialState = {
    category: string;
    subcategory: string;
    title: string;
    content: string;
    images: ImageListType;
    rating: number;
    author: {
      id: string | unknown;
      username: string | null | undefined;
      image: string | null | undefined;
    };
  };

  const initialState: InitialState = {
    category: '',
    subcategory: '',
    title: '',
    content: '',
    images: [],
    rating: 3,
    author: {
      id: '',
      username: '',
      image: '',
    },
  };

  const [post, setPost] = useState(initialState);

  useEffect(() => {
    setPost({
      ...post,
      category: globalState.newPostCategory,
      subcategory: globalState.newPostSubcategory.slug,
      author: {
        id: session?.user.id,
        username: session?.user.username,
        image: session?.user.image,
      },
    });
  }, []);

  const isRequiredFields = () => {
    if (post.title !== '' && globalState.postWordsCount >= 150) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isRequiredFields() === true) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [post]);

  const setTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, title: e.target.value });
  };

  const setContent = (content: string) => {
    setPost({ ...post, content: content });
  };

  const setRating = (_e: ChangeEvent<{}>, value: number | null) => {
    const rating = value ?? post.rating;
    setPost({ ...post, rating: rating });
  };

  const setImage = (imageList: ImageListType) => {
    setPost({ ...post, images: imageList });
  };

  const handleClose = () => {
    if (cleanQuillEditor(post.content) !== '' || post.title !== '') {
      const alertDiscard = confirm(
        "You're about to discard your review! Are you sure?"
      );

      if (alertDiscard === true) {
        resetState();
      }
    } else {
      resetState();
    }
  };

  if (typeof window !== 'undefined') {
    window.onbeforeunload = (e: Event) => {
      if (post.content.length > discardAlertTreshold) {
        e.preventDefault();
        e.returnValue = true;
      }
    };
  }

  const sendRequest = async () => {
    showSavingState();

    const response = await fetch(`/api/create/post`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });
      showSavingState();

      return;
    }

    resetState();

    const res = await response.json();
    router.push(
      `/${res.post.category}/${res.post.subcategory}/${res.post.urlId}/${res.post.slug}`
    );
  };

  const resetState = () => {
    showSavingState();
    setPost(initialState);
    dispatchAction({ type: OPEN_CREATE_POST_DIALOG, payload: false });
    dispatchAction({ type: SET_NEW_POST_CATEGORY, payload: '' });
    dispatchAction({ type: SET_NEW_POST_SUBCATEGORY, payload: '' });
  };

  const showSavingState = () => {
    setIsSaving((prevState) => !prevState);
    setIsDisabled((prevState) => !prevState);
  };

  const backHandle = () => {
    if (cleanQuillEditor(post.content) !== '' || post.title !== '') {
      const alertDiscard = confirm(
        'Navigating back will discard your review! Are you sure?'
      );
      if (alertDiscard === true) {
        dispatchAction({ type: SET_NEW_POST_SUBCATEGORY, payload: '' });
      }
    } else {
      dispatchAction({ type: SET_NEW_POST_SUBCATEGORY, payload: '' });
    }
  };

  return (
    <React.Fragment>
      <DialogTitle onClose={handleClose} onBack={backHandle}>
        {globalState.newPostSubcategory.name}
      </DialogTitle>
      <DialogContent dividers>
        <ImageUplad images={post.images} setImage={setImage} />
        <Box mt={1.5} mb={1.5}>
          <TextField
            id="outlined-basic"
            label="Title"
            placeholder={titlePlaceholder}
            variant="outlined"
            fullWidth
            required={true}
            value={post.title}
            margin="none"
            onChange={setTitle}
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
        <Button
          variant="contained"
          onClick={sendRequest}
          disabled={isDisabled}
          color="primary"
          size={isMobileView ? 'small' : 'medium'}
        >
          <span style={isSaving ? { visibility: 'hidden' } : {}}>
            Add Review
          </span>
          {isSaving && (
            <CircularProgress
              size={isMobileView ? 20 : 25}
              style={{ position: 'absolute' }}
            />
          )}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    justifyContent: 'space-between',
  },
}))(MuiDialogActions);

export default CreatePost;
