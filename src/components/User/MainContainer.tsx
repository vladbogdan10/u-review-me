import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    profileHeader: {
      padding: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(2),
      '& svg': {
        marginRight: theme.spacing(1),
      },
    },
    profileMainContainer: {
      minHeight: '500px',
    },
  })
);

interface MainContainerProps {
  component: JSX.Element;
  header: {
    username: string;
    page: 'profile' | 'reviews' | 'comments';
  };
}

const MainContainer = (props: MainContainerProps) => {
  const classes = useStyles();

  return (
    <div>
      <Paper
        variant="outlined"
        component="section"
        className={classes.profileHeader}
      >
        <PersonIcon />
        <Typography component="h1" variant="h6">
          {props.header.username} {props.header.page}
        </Typography>
      </Paper>
      <div className={classes.profileMainContainer}>{props.component}</div>
    </div>
  );
};

export default MainContainer;
