import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import FooterCopyright from './FooterCopyright';
import FooterLinks from './FooterLinks';

const useStyles = makeStyles((theme: Theme) => ({
  links: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(1),
    '& > a': {
      marginBottom: theme.spacing(0.5),
    },
  },
}));

const FooterSmall = () => {
  const classes = useStyles();

  return (
    <footer>
      <FooterLinks className={classes.links} />
      <FooterCopyright />
    </footer>
  );
};

export default FooterSmall;
