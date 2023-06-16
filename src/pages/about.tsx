import React from 'react';
import Head from 'next/head';
import {
  Container,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Footer from '../components/Footer/Footer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: 'auto',
      marginBottom: 'auto',
      padding: theme.spacing(4, 2),
    },
    text: {
      textAlign: 'center',
      fontSize: '45px',
      [theme.breakpoints.down('xs')]: {
        fontSize: '30px',
      },
    },
  })
);

const AboutPage = () => {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>About - u-review.me</title>
        <meta title="description" content="u-review.me about page" />
        <meta name="robots" content="noindex" />
      </Head>

      <Container maxWidth={false} className={classes.root}>
        <Typography className={classes.text}>
          Expected to find more here? Well it's simple.
        </Typography>
        <Typography className={classes.text}>
          Our motto is <em>"Power Reviews for Power Users"</em>.
        </Typography>
        <Typography className={classes.text}>
          Yup, That's it.{' '}
          <span style={{ whiteSpace: 'nowrap' }}>(づ ◕‿◕ )づ</span>
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default AboutPage;
