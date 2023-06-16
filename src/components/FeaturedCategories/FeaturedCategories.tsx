import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import NextLink from 'next/link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Devices, SportsEsports } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { GlobalContext } from '../../context/global-context';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: '4px !important',
    },
    paper: {
      padding: theme.spacing(1.5),
      transition: `0.2s background ${theme.transitions.easing.easeInOut}`,
      '&:hover': {
        background: theme.palette.action.selected,
      },
    },
    active: {
      border: `2px solid ${theme.palette.brand}`,
    },
    textWithIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',

      '& svg': {
        marginRight: theme.spacing(1),
      },
    },
  })
);

const FeaturedCategories = () => {
  const classes = useStyles();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  return (
    <Grid container spacing={3} component="aside">
      <Grid item xs={12} sm={6}>
        <NextLink href="/tech" passHref>
          <Link underline="none">
            <Paper
              variant="outlined"
              className={`${classes.paper} ${
                globalState.activeCategory === 'tech' && classes.active
              }`}
            >
              <div className={classes.textWithIcon}>
                <Devices />
                <Typography variant="h6" component="span">
                  Tech Reviews
                </Typography>
              </div>
            </Paper>
          </Link>
        </NextLink>
      </Grid>
      <Grid item xs={12} sm={6}>
        <NextLink href="/games" passHref>
          <Link variant="h6" underline="none">
            <Paper
              variant="outlined"
              className={`${classes.paper} ${
                globalState.activeCategory === 'games' && classes.active
              }`}
            >
              <div className={classes.textWithIcon}>
                <SportsEsports />
                <Typography variant="h6" component="span">
                  Game Reviews
                </Typography>
              </div>
            </Paper>
          </Link>
        </NextLink>
      </Grid>
    </Grid>
  );
};

export default FeaturedCategories;
