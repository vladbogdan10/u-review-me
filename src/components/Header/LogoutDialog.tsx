import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GlobalContext } from '../../context/global-context';
import { OPEN_LOGOUT_MODAL } from '../../context/actions';
import { signOut } from 'next-auth/react';

const LogoutDialog = () => {
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const handleClose = () => {
    dispatchAction({ type: OPEN_LOGOUT_MODAL, payload: false });
  };

  const handleLogout = () => {
    signOut();
    handleClose();
  };

  return (
    <>
      <Dialog
        open={globalState.isLogoutModalOpen}
        onClose={handleClose}
        aria-labelledby="logout-dialog"
      >
        <DialogTitle id="logout-dialog">
          Are you sure you want to log out?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
