import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { LoginSignupButtons } from '../common/ActionButtons/LoginSignupButtons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { GlobalContext } from '../../context/global-context';
import {
  OPEN_LOGOUT_MODAL,
  TOGGLE_OPEN_NAV_DRAWER,
} from '../../context/actions';
import buildAvatarUrl from '../../utils/buildAvatarUrl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 28,
      height: 28,
    },
    icon: {
      width: 28,
      height: 28,
      color: theme.palette.grey[500],
    },
  })
);

const NavigationDrawerUserActions = () => {
  const classes = useStyles();
  const { data: session } = useSession();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const handleSignOut = () => {
    dispatchAction({ type: OPEN_LOGOUT_MODAL, payload: true });
    dispatchAction({ type: TOGGLE_OPEN_NAV_DRAWER, payload: false });
  };

  return (
    <>
      {!session ? (
        <LoginSignupButtons buttonSize="small" />
      ) : (
        <div>
          <Link href={`/user/${session.user.username}`} prefetch={false}>
            <Button
              size="small"
              onClick={() =>
                dispatchAction({
                  type: TOGGLE_OPEN_NAV_DRAWER,
                  payload: false,
                })
              }
              startIcon={
                <Avatar
                  src={buildAvatarUrl(session.user.image ?? '')}
                  className={classes.avatar}
                  style={{ background: 'white' }}
                />
              }
            >
              Go to profile
            </Button>
          </Link>
          <Button
            size="small"
            onClick={handleSignOut}
            startIcon={<ExitToAppIcon className={classes.icon} />}
          >
            Logout
          </Button>
        </div>
      )}
    </>
  );
};

export default NavigationDrawerUserActions;
