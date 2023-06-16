import React from 'react';
import Head from 'next/head';
import { Box, Container, Grid, Paper } from '@material-ui/core';
import SideNavigation from '../../components/Legal/SideNavigation';
import Footer from '../../components/Footer/Footer';

const ImpressumPage = () => {
  return (
    <>
      <Head>
        <title>Imprint - u-review.me</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Container maxWidth={false} style={{ marginBottom: 'auto' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} component="aside">
            <SideNavigation />
          </Grid>
          <Grid item xs={12} md={9} component="main">
            <Box p={2} clone>
              <Paper variant="outlined">
                <h1>Imprint</h1>
                <p>u-review.me</p>
                <p>The Street</p>
                <p>12345 ZipCode</p>
                <p>E-Mail: contact@u-review.me</p>
                <p>Phone: +49 123 456 78901</p>
                <p>Owner: Bogdan Vlad</p>
                <br />
                <p>
                  Privacy policy:{' '}
                  <a href="/legal/privacy">https://u-review.me/legal/privacy</a>
                </p>
                Cookie policy:{' '}
                <a href="/legal/cookie-policy">
                  https://u-review.me/legal/cookie-policy
                </a>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ImpressumPage;
