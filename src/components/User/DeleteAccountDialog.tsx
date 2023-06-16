import React, { Dispatch, SetStateAction, useContext } from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogTitle,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { SHOW_NOTIFICATION } from '../../context/actions';
import { GlobalContext } from '../../context/global-context';
import { signOut } from 'next-auth/react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      padding: theme.spacing(2),
    },
    deleteButton: {
      background: theme.palette.error.main,
      color: theme.palette.text.primary,
      '&:hover': {
        background: theme.palette.error.dark,
      },
    },
  })
);

const DeleteAccountDialog = (props: {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
}) => {
  const classes = useStyles();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const handleClose = () => {
    props.setIsOpen(false);
  };

  const handleDelete = () => {
    signOut({ callbackUrl: '/' });
    handleClose();
  };

  const deleteAccount = async () => {
    const response = await fetch('/api/delete/user', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: props.userId }),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    handleDelete();
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="delete-account-dialog"
      >
        <DialogTitle id="delete-account-dialog">
          Are you sure you want to delete your account? This action cannot be
          reverted!
        </DialogTitle>
        <DialogActions className={classes.actions}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button className={classes.deleteButton} onClick={deleteAccount}>
            Yes, delete my account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAccountDialog;
