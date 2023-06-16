import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { GlobalContext } from '../../../context/global-context';
import { TOGGLE_OPEN_NAV_DRAWER } from '../../../context/actions';
import saveCurrentUrlToSessionStorage from '../../../utils/saveCurrentUrlToSessionStorage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginSignupButtons: {
      '& a': {
        '&:first-child': {
          marginRight: theme.spacing(1),
        },
      },
    },
  })
);

export const LoginSignupButtons = (props: {
  buttonSize?: 'small' | 'medium' | 'large' | undefined;
}) => {
  const classes = useStyles();
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const buttonAction = () => {
    saveCurrentUrlToSessionStorage();
    dispatchAction({ type: TOGGLE_OPEN_NAV_DRAWER, payload: false });
  };

  return (
    <div className={classes.loginSignupButtons}>
      <Link href="/auth/login" passHref>
        <Button
          variant="outlined"
          size={props.buttonSize}
          onClick={buttonAction}
          color="primary"
        >
          Login
        </Button>
      </Link>
      <Link href="/auth/signup" passHref>
        <Button
          variant="contained"
          size={props.buttonSize}
          disableElevation
          onClick={buttonAction}
          color="primary"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export const LoginSignupButton = () => {
  return (
    <Link href="/auth/login" passHref>
      <Button
        size="small"
        variant="contained"
        fullWidth
        style={{ textTransform: 'none' }}
        onClick={saveCurrentUrlToSessionStorage}
        color="primary"
      >
        Log in or sign up to leave a comment
      </Button>
    </Link>
  );
};
