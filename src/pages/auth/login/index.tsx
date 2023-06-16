import React, { ChangeEvent, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { AppProviders } from 'next-auth/providers';
import { GetServerSideProps } from 'next';
import { TextField, Typography } from '@material-ui/core';
import Alert, { Color } from '@material-ui/lab/Alert';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Head from 'next/head';
import Footer from '../../../components/Footer/Footer';
// import { JsonLd } from 'react-schemaorg';
// import { RegisterAction } from 'schema-dts';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: theme.spacing(2),
  },
  elements: {
    width: '100%',
    maxWidth: '350px',
    '& > *': {
      marginBottom: theme.spacing(1.5),
    },
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
  },
  divider: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerBorder: {
    width: '100%',
    borderBottom: `1px solid ${theme.palette.grey[700]}`,
  },
  dividerText: {
    padding: theme.spacing(0, 1),
    color: theme.palette.grey[700],
    fontSize: '15px',
  },
}));

interface LoginProps {
  providers: AppProviders;
  baseUrl: string;
  title: string;
  authError?: {
    severity: Color;
    message: string;
  };
}

const Login = (props: LoginProps) => {
  const classes = useStyles();
  const { providers } = props;
  const [email, setEmail] = useState('');

  const setEmailHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.value;

    setEmail(value);
  };

  const handleLogin = (providerId: string) => {
    window.sessionStorage.setItem('signInEmail', email);

    signIn(providerId, {
      email,
      callbackUrl: `${props.baseUrl}${prevUrl}`,
    });
  };

  let prevUrl: string = '';
  if (process.browser) {
    prevUrl = window.sessionStorage.getItem('prevUrl') ?? '';
  }

  return (
    <>
      {/* <JsonLd<RegisterAction>
        item={{
          '@context': 'https://schema.org',
          '@type': 'RegisterAction',
          object: {
            '@type': 'Product',
            name: 'u-review.me',
          },
        }}
      /> */}
      <Head>
        <title>{props.title ? props.title : 'Login'} - u-review.me</title>
        <meta title="description" content="Login/Signup page" />
      </Head>
      <div className={classes.container}>
        <div className={classes.elements}>
          <div className={classes.title}>
            <LockOutlinedIcon color="primary" fontSize="large" />
            <Typography variant="h4">{props.title ?? 'Login'}</Typography>
          </div>
          {props.authError && (
            <Alert
              variant="outlined"
              icon={false}
              severity={props.authError.severity}
            >
              {props.authError.message}
            </Alert>
          )}
          {Object.values(providers).map((provider) => (
            <React.Fragment key={provider.name}>
              {provider.id === 'email' && (
                <>
                  <div className={classes.divider}>
                    <span className={classes.dividerBorder}></span>
                    <span className={classes.dividerText}>or</span>
                    <span className={classes.dividerBorder}></span>
                  </div>
                  <div>
                    <Typography variant="body2">Email</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      placeholder="email@example.com"
                      value={email}
                      type="email"
                      onChange={setEmailHandler}
                      autoComplete="email"
                    />
                  </div>
                </>
              )}
              <Button
                variant="contained"
                fullWidth
                style={{ textTransform: 'none' }}
                onClick={() => handleLogin(provider.id)}
              >
                {props.title ?? 'Login'} with {provider.name}
              </Button>
            </React.Fragment>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const providers = await getProviders();
  const session = await getSession({ req });
  const baseUrl = process.env.NEXTAUTH_URL;

  if (session) {
    return {
      redirect: {
        statusCode: 302,
        destination: `/user/${session.user.username}`,
      },
    };
  }

  let authError = null;

  const commonErrorValues = {
    severity: 'info',
    statusCode: 200,
    message: 'Try to login with a different account.',
  };

  const errors = {
    Configuration: {
      severity: 'error',
      statusCode: 500,
      message:
        'Server error! There is a problem on our side. Please try again later.',
    },
    AccessDenied: {
      severity: 'warning',
      statusCode: 403,
      message: 'You do not have permission to sign in.',
    },
    Verification: {
      severity: 'error',
      statusCode: 403,
      message:
        'The login link is no longer valid. It may have been used already or it may have expired. Please login again.',
    },
    OAuthAccountNotLinked: {
      severity: 'info',
      statusCode: 200,
      message:
        'To confirm your identity, login with the same account you used originally.',
    },
    Signin: commonErrorValues,
    OAuthSignin: commonErrorValues,
    OAuthCallback: commonErrorValues,
    OAuthCreateAccount: commonErrorValues,
    EmailCreateAccount: commonErrorValues,
    Callback: commonErrorValues,
    EmailSignin: {
      severity: 'error',
      statusCode: 200,
      message: 'Something went wrong! Please try again.',
    },
    CredentialsSignin: {
      severity: 'error',
      statusCode: 200,
      message: 'Login failed. Check the details you provided are correct.',
    },
    default: {
      severity: 'error',
      statusCode: 200,
      message: 'Unable to login.',
    },
  };

  type errorType = typeof errors;

  if (query['error']) {
    const errorKey = query['error'] as keyof errorType;

    if (errors[errorKey]) {
      authError = errors[errorKey];
      res.statusCode = authError.statusCode;
    } else {
      authError = errors['default'];
    }
  }

  return {
    props: {
      providers: providers,
      authError: authError,
      baseUrl: baseUrl,
    },
  };
};

export default Login;
