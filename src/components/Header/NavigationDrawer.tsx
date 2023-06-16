import React, { useContext, useEffect } from 'react';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import NextLink from 'next/link';
import ListSubheader from '@material-ui/core/ListSubheader';
import Logo from './Logo';
import FooterSmall from '../Footer/FooterSmall';
import { GlobalContext } from '../../context/global-context';
import NavigationDrawerUserActions from './NavigationDrawerUserActions';
import { TOGGLE_OPEN_NAV_DRAWER } from '../../context/actions';
import { Backdrop } from '@material-ui/core';

const drawerWidth = 250;
const drawerHeaderHeigth = 64;

// TODO: improve this styles at some point
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: theme.zIndex.drawer + 100,
      position: 'fixed',
      inset: '0px',
    },
    drawerPaper: {
      width: drawerWidth,
      height: '100%',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      minHeight: drawerHeaderHeigth,
      padding: theme.spacing(0, 0, 0, 2),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      borderBottom: `1px solid ${theme.palette.grey[700]}`,
    },
    drawerContent: {
      paddingTop: 0,
      [theme.breakpoints.down('sm')]: {
        overflowY: 'auto',
      },
      '& li:first-child': {
        padding: 0,
      },
    },
    drawerBottom: {
      padding: theme.spacing(2),
      '& a': {
        width: '100%',
        '&:first-child': {
          marginBottom: theme.spacing(1),
        },
      },
      '& > footer': {
        marginTop: theme.spacing(2),
      },
      borderTop: `1px solid ${theme.palette.grey[700]}`,
    },
    listSubheader: {
      textTransform: 'capitalize',
      backgroundColor: theme.palette.background.paper,
    },
    active: {
      color: theme.palette.brand,
    },
    backdrop: {
      zIndex: theme.zIndex.drawer - 1,
    },
  })
);

const lockScrollbar = (isNavOpen: boolean) => {
  if (isNavOpen) {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
  } else {
    if (document.body.hasAttribute('style')) {
      document.body.removeAttribute('style');
    }
  }
};

const NavigationDrawer = () => {
  const theme = useTheme();
  const classes = useStyles();

  const { globalState, dispatchAction } = useContext(GlobalContext);
  const {
    categories,
    isNavigationDrawerOpen,
    activeCategory,
    activeSubcategory,
  } = globalState;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      dispatchAction({ type: TOGGLE_OPEN_NAV_DRAWER, payload: false });
    }
  };

  const handleClose = () => {
    dispatchAction({ type: TOGGLE_OPEN_NAV_DRAWER, payload: false });
  };

  useEffect(() => {
    lockScrollbar(isNavigationDrawerOpen);
  }, [isNavigationDrawerOpen]);

  return (
    <nav
      className={isNavigationDrawerOpen ? classes.root : ''}
      aria-label="Main navigation"
    >
      <Drawer
        variant="persistent"
        open={isNavigationDrawerOpen}
        onClose={handleClose}
        classes={{
          paper: classes.drawerPaper,
        }}
        onKeyDown={handleKeyDown}
      >
        {(useMediaQuery(theme.breakpoints.down('xs')) ||
          isNavigationDrawerOpen) && (
          <div className={classes.drawerHeader}>
            <Logo size="small" />
          </div>
        )}
        <div className={classes.drawerContent}>
          {Object.keys(categories).map((category) => (
            <List key={category}>
              <ListSubheader className={classes.listSubheader}>
                <NextLink href={`/${category}`} prefetch={false} passHref>
                  <ListItem
                    component="a"
                    button
                    onClick={handleClose}
                    color={activeCategory === category ? 'primary' : undefined}
                  >
                    <Typography
                      component="span"
                      variant="h6"
                      color={
                        activeCategory === category ? 'primary' : undefined
                      }
                    >
                      {category}
                    </Typography>
                  </ListItem>
                </NextLink>
              </ListSubheader>
              {Object.keys(categories[category].subcategories).map(
                (subcategory) => (
                  <li key={subcategory}>
                    <NextLink
                      href={`/${category}/${subcategory}`}
                      prefetch={false}
                      passHref
                    >
                      <ListItem
                        component="a"
                        button
                        onClick={handleClose}
                        className={
                          activeSubcategory === subcategory
                            ? classes.active
                            : ''
                        }
                      >
                        {categories[category].subcategories[subcategory].name}
                      </ListItem>
                    </NextLink>
                  </li>
                )
              )}
            </List>
          ))}
        </div>
        {useMediaQuery(theme.breakpoints.down('sm')) && (
          <div className={classes.drawerBottom}>
            <NavigationDrawerUserActions />
            <FooterSmall />
          </div>
        )}
      </Drawer>
      {isNavigationDrawerOpen && (
        <Backdrop open={isNavigationDrawerOpen} onClick={handleClose} />
      )}
    </nav>
  );
};

export default NavigationDrawer;
