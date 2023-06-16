import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { GlobalContext } from '../../context/global-context';
import CategorySelect from './CategorySelect';
import PostTypeSelect from './PostTypeSelect';
import CreatePost from './CreatePost';
import { useMediaQuery, useTheme } from '@material-ui/core';

const CreatePostSelector = () => {
  const theme = useTheme();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  return (
    <>
      <Dialog
        open={globalState.isCreatePostDialogOpen}
        aria-labelledby="create-post-dialog"
        role="create-post"
        fullWidth
        maxWidth={globalState.newPostSubcategory.slug ? 'md' : 'xs'}
        fullScreen={useMediaQuery(theme.breakpoints.down('xs'))}
      >
        {!globalState.newPostCategory ? (
          <PostTypeSelect />
        ) : !globalState.newPostSubcategory.slug ? (
          <CategorySelect />
        ) : (
          <CreatePost />
        )}
      </Dialog>
    </>
  );
};

export default CreatePostSelector;
