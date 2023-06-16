import React, { useContext } from 'react';
import NextLink from 'next/link';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { GlobalContext } from '../../context/global-context';
import { TOGGLE_OPEN_NAV_DRAWER } from '../../context/actions';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      width: (props: { size?: 'small' | 'normal' }) =>
        `${props.size === 'small' ? '150px' : '160px'}`,
    },
    logoSvg: {
      '& > .text': {
        fill: 'white',
        fontFamily: 'Roboto',
        fontWeight: 'bold',
      },
      '& > .dot': {
        fill: theme.palette.brand,
        fontSize: '30px',
      },
      '& > .claim': {
        fill: 'white',
        textTransform: 'uppercase',
        fontFamily: 'Roboto',
        fontSize: '0.311em',
        fontWeight: 'bold',
      },
    },
    activeCategory: {
      background: theme.palette.brand,
      color: theme.palette.grey[800],
      padding: (props: { size?: 'small' | 'normal' }) =>
        `${props.size === 'small' ? '0.12em 0.2em' : '0.16em 0.3em'}`,
      marginLeft: '6px',
      borderRadius: theme.shape.borderRadius,
      '& span': {
        fontWeight: 'bold',
      },
    },
  })
);

const Logo = (props: { size?: 'small' | 'normal' }) => {
  const { size } = props;
  const classes = useStyles({ size });
  const router = useRouter();

  const { globalState, dispatchAction } = useContext(GlobalContext);
  const { activeCategory } = globalState;

  return (
    <div className={classes.root}>
      <div className={classes.logo}>
        <NextLink href="/" passHref>
          <Link
            display="block"
            underline="none"
            color="textPrimary"
            onClick={() =>
              dispatchAction({
                type: TOGGLE_OPEN_NAV_DRAWER,
                payload: false,
              })
            }
          >
            <svg
              viewBox="0 0 79 19"
              xmlns="http://www.w3.org/2000/svg"
              className={classes.logoSvg}
            >
              <text className="text" x="0" y="12">
                u-review
              </text>
              <text className="dot" x="53" y="11.7">
                .
              </text>
              <text className="text" x="59" y="12">
                me
              </text>
              <text className="claim" x="0.5" y="18">
                Power Reviews For Power Users
              </text>
            </svg>
          </Link>
        </NextLink>
      </div>
      {(router.asPath === '/' || activeCategory) && (
        <Typography component={router.query.urlId ? 'div' : 'h1'}>
          <NextLink href={`/${activeCategory ?? ''}`} passHref>
            <Link
              className={classes.activeCategory}
              display="block"
              underline="none"
              color="textPrimary"
              onClick={() =>
                dispatchAction({
                  type: TOGGLE_OPEN_NAV_DRAWER,
                  payload: false,
                })
              }
            >
              <Typography component="span">
                {activeCategory ?? 'home'}
              </Typography>
            </Link>
          </NextLink>
        </Typography>
      )}
    </div>
  );
};

export default Logo;
