import React, { useState, MouseEvent, useContext } from 'react';
import { PostCardProps } from './PostCard';
import MoreOptionsMenu from '../MoreOptionsMenu/MoreOptionsMenu';
import { GlobalContext } from '../../context/global-context';
import {
  DELETE_POST,
  EDIT_POST,
  SHOW_NOTIFICATION,
} from '../../context/actions';
import EditPost from '../PostCreator/EditPost';

const PostCardHeaderAction = (post: PostCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    dispatchAction({ type: EDIT_POST, payload: post._id });
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    const deletionAlert = confirm(
      "Are you sure you want to delete your review? You can't undo this."
    );

    if (deletionAlert === true) {
      const response = await fetch('/api/delete/post', {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post._id,
          authorId: post.author.id,
        }),
      });

      if (!response.ok) {
        dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });
        setAnchorEl(null);

        return;
      }

      dispatchAction({ type: DELETE_POST, payload: post._id });
      setAnchorEl(null);
    } else {
      setAnchorEl(null);
    }
  };

  return (
    <>
      <MoreOptionsMenu
        anchorEl={anchorEl}
        handleClick={handleClick}
        handleClose={handleClose}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {globalState.editedPostId === post._id && <EditPost {...post} />}
    </>
  );
};

export default PostCardHeaderAction;
