import Button from '@material-ui/core/Button';
import Link from 'next/link';
import React from 'react';
import saveCurrentUrlToSessionStorage from '../../../utils/saveCurrentUrlToSessionStorage';

export const FinishAccountSetupButton = () => {
  return (
    <Link href="/auth/new-user" passHref>
      <Button
        variant="contained"
        onClick={saveCurrentUrlToSessionStorage}
        color="primary"
      >
        Continue
      </Button>
    </Link>
  );
};

export const FinishAccountSetupButtonMobile = () => {
  return (
    <Link href="/auth/new-user" passHref>
      <Button
        size="small"
        variant="contained"
        fullWidth
        style={{ textTransform: 'none', textAlign: 'center' }}
        onClick={saveCurrentUrlToSessionStorage}
        color="primary"
      >
        Finish setting up your account to leave a comment
      </Button>
    </Link>
  );
};
