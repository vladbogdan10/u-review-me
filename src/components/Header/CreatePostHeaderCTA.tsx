import React, { useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core';
import { GlobalContext } from '../../context/global-context';
import { OPEN_CREATE_POST_DIALOG } from '../../context/actions';
import useAuthorized from '../../hooks/useAuthorized';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('sm')]: {
        order: 2,
      },
    },
  })
);

const CreatePostHeader = () => {
  const [isAuthorized] = useAuthorized();

  const classes = useStyles();
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const openCreatePostModal = () => {
    dispatchAction({ type: OPEN_CREATE_POST_DIALOG, payload: true });
  };

  return (
    <div className={classes.root}>
      <Tooltip disableFocusListener title="Add review">
        <IconButton onClick={() => isAuthorized(openCreatePostModal)}>
          <BorderColorIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default CreatePostHeader;
