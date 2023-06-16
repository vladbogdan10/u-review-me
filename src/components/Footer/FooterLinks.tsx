import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const FooterLinks = (props: { className?: string }) => {
  return (
    <div className={props.className}>
      <Link href="/about" color="textPrimary">
        <Typography variant="body2" component="span">
          About
        </Typography>
      </Link>
      <Link href="/support" color="textPrimary">
        <Typography variant="body2" component="span">
          Support
        </Typography>
      </Link>
      <Link href="/legal/privacy" color="textPrimary">
        <Typography variant="body2" component="span">
          Privacy policy
        </Typography>
      </Link>
      <Link href="/legal/cookie-policy" color="textPrimary">
        <Typography variant="body2" component="span">
          Cookie policy
        </Typography>
      </Link>
      <Link href="/legal/imprint" color="textPrimary">
        <Typography variant="body2" component="span">
          Imprint
        </Typography>
      </Link>
    </div>
  );
};

export default FooterLinks;
