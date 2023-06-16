import React, { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Link } from '@material-ui/core';
import NextLink from 'next/link';
import Head from 'next/head';
import Footer from '../../components/Footer/Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    '& > *': {
      marginBottom: theme.spacing(3.5),
    },
  },
  icon: {
    height: '100px',
    width: '100px',
  },
}));

const VerifyRequest = () => {
  const classes = useStyles();
  const [text, setText] = useState('');
  const [redirect, setRedirect] = useState({
    origin: '',
    prevUrl: '',
  });

  useEffect(() => {
    const signInEmail = window.sessionStorage.getItem('signInEmail') ?? '';

    setText(
      `A sign in link has been sent to your email address${
        signInEmail ? ` (${signInEmail}).` : '.'
      }`
    );

    setRedirect({
      origin: window.location.origin,
      prevUrl: window.sessionStorage.getItem('prevUrl') ?? '/',
    });
  }, []);

  return (
    <>
      <Head>
        <title>Check email - u-review.me</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={classes.root}>
        <div>
          <MailOutlineIcon className={classes.icon} color="disabled" />
        </div>
        <Typography component="h1" variant="h4">
          Check your email
        </Typography>
        <Typography variant="body1">{text}</Typography>
        <div>
          <NextLink href={redirect.prevUrl} passHref>
            <Link variant="body1">{`${redirect.origin}${redirect.prevUrl}`}</Link>
          </NextLink>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyRequest;
