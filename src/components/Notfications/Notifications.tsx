import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { GlobalContext } from '../../context/global-context';
import { SHOW_NOTIFICATION } from '../../context/actions';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Notifications = () => {
  const classes = useStyles();

  const { globalState, dispatchAction } = useContext(GlobalContext);
  const { notification } = globalState;

  // TODO: strange error when set state "notification: {open: false}"
  // for an empty payload works
  const handleClose = () => {
    dispatchAction({ type: SHOW_NOTIFICATION, payload: '' });
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <>
          {notification.type === 'success' && (
            <Alert onClose={handleClose} severity="success">
              {notification.message ?? 'Successful'}
            </Alert>
          )}
          {notification.type === 'error' && (
            <Alert onClose={handleClose} severity="error">
              {notification.message ??
                'Oops! Something went wrong. Please try again.'}
            </Alert>
          )}
          {notification.type === 'warning' && (
            <Alert onClose={handleClose} severity="warning">
              {notification.message ?? 'Warning!'}
            </Alert>
          )}
          {notification.type === 'info' && (
            <Alert onClose={handleClose} severity="info">
              {notification.message ?? 'Info'}
            </Alert>
          )}
        </>
      </Snackbar>
    </div>
  );
};

export default Notifications;
