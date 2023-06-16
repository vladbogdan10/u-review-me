import React, { useContext, useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import {
  createStyles,
  Theme,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import NavigationDrawer from './NavigationDrawer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CreatePostHeader from './CreatePostHeaderCTA';
import Logo from './Logo';
import Box from '@material-ui/core/Box';
import HeaderAuth from './HeaderAuth';
import { GlobalContext } from '../../context/global-context';
import {
  ACTIVE_CATEGORY,
  ACTIVE_SUBCATEGORY,
  TOGGLE_OPEN_NAV_DRAWER,
} from '../../context/actions';
import { useRouter } from 'next/router';
import LogoutDialog from './LogoutDialog';
import SearchInput from './SearchInput';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: theme.mixins.toolbar.minHeight,
      [theme.breakpoints.up('sm')]: {
        minHeight: `calc(${theme.mixins.toolbar.minHeight}px + 20px)`,
      },
    },
    appBar: {
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

const Header = () => {
  const theme = useTheme();
  const classes = useStyles();
  const router = useRouter();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  useEffect(() => {
    dispatchAction({ type: ACTIVE_CATEGORY, payload: router.query.category });
    dispatchAction({
      type: ACTIVE_SUBCATEGORY,
      payload: router.query.subcategory,
    });
  }, [router.query]);

  return (
    <>
      <div className={classes.root}>
        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          className={`${classes.appBar} MuiPaper-outlined`}
        >
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              aria-label="open drawer"
              onClick={() =>
                dispatchAction({ type: TOGGLE_OPEN_NAV_DRAWER, payload: true })
              }
            >
              <MenuIcon />
            </IconButton>
            {useMediaQuery(theme.breakpoints.up('sm')) &&
              globalState.isNavigationDrawerOpen === false && <Logo />}
            <Box
              display="flex"
              alignItems="center"
              flexGrow="1"
              justifyContent="flex-end"
            >
              <CreatePostHeader />
              <SearchInput />
              {useMediaQuery(theme.breakpoints.up('md')) && <HeaderAuth />}
            </Box>
          </Toolbar>
        </AppBar>
        <NavigationDrawer />
      </div>
      <LogoutDialog />
    </>
  );
};

export default Header;
