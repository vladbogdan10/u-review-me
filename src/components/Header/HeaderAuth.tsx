import React from 'react';
import { useSession } from 'next-auth/react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { LoginSignupButtons } from '../common/ActionButtons/LoginSignupButtons';
import UserActions from './UserActions';

const HeaderAction = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {status === 'loading' ? (
        <CircularProgress />
      ) : session ? (
        <UserActions />
      ) : (
        <LoginSignupButtons />
      )}
    </>
  );
};

export default HeaderAction;
