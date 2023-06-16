import React from 'react';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SidebarList from './SidebarList';
import { PostType } from '../../types/types';
import FooterSmall from '../Footer/FooterSmall';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > section': {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(1.5),
    },
  },
  footer: {
    position: 'sticky',
    top: 76,
  },
  title: {
    fontSize: theme.typography.fontSize,
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  ol: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
}));

interface SidebarProps {
  latestPosts: PostType[];
  mostHelpful: PostType[];
}

const Sidebar = (props: SidebarProps) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Grid item xs={12} md={4} component="aside" className={classes.root}>
      <Paper variant="outlined" component="section">
        <Typography className={classes.title} component="h3">
          Recent reviews
        </Typography>
        <ol className={classes.ol}>
          {props.latestPosts.map((post: PostType) => (
            <SidebarList {...post} key={post._id} />
          ))}
        </ol>
      </Paper>

      <Paper variant="outlined" component="section">
        <Typography className={classes.title} component="h3">
          Most helpful reviews
        </Typography>
        <ol className={classes.ol}>
          {props.mostHelpful.map((post: PostType) => (
            <SidebarList {...post} key={post._id} />
          ))}
        </ol>
      </Paper>

      {useMediaQuery(theme.breakpoints.up('md')) && (
        <Paper
          variant="outlined"
          component="section"
          className={classes.footer}
        >
          <FooterSmall />
        </Paper>
      )}
    </Grid>
  );
};

export default Sidebar;
