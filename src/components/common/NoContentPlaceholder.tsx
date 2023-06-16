import React from 'react';
import { Comment, RateReview } from '@material-ui/icons';
import { Box, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
  icon: {
    width: '100%',
    height: 'auto',
    maxHeight: '420px',
    color: 'rgba(255, 255, 255, 0.02)', // handle white theme later
  },
});

const NoContentPlaceholder = (props: {
  title: string;
  type: 'comments' | 'reviews';
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box ml={2} mr={2}>
        <Typography component="h2" variant="body1" color="textSecondary">
          {props.title}
        </Typography>
      </Box>
      {props.type === 'reviews' && <RateReview className={classes.icon} />}
      {props.type === 'comments' && <Comment className={classes.icon} />}
    </div>
  );
};

export default NoContentPlaceholder;
