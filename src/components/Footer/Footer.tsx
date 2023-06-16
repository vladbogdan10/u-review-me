import * as React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import FooterLinks from './FooterLinks';
import FooterCopyright from './FooterCopyright';

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6, 2),
    marginTop: theme.spacing(1.5),
  },
  links: {
    marginBottom: theme.spacing(2),
    '& > a': {
      marginRight: theme.spacing(2),
    },
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="md" disableGutters>
        <FooterLinks className={classes.links} />
        <FooterCopyright />
      </Container>
    </footer>
  );
};

export default Footer;
