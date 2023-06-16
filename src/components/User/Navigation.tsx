import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Person, RateReview, Comment } from '@material-ui/icons';
import Link from 'next/link';
import Box from '@material-ui/core/Box';

const Navigation = (props: { username: string }) => {
  return (
    <Box position="sticky" top="76px">
      <Paper variant="outlined">
        <List component="nav" aria-labelledby="profileOptions">
          <Link href={`/user/${props.username}`} passHref>
            <ListItem component="a" button>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
          <Link href={`/user/${props.username}/reviews`} passHref>
            <ListItem component="a" button>
              <ListItemIcon>
                <RateReview />
              </ListItemIcon>
              <ListItemText primary="Reviews" />
            </ListItem>
          </Link>
          <Link href={`/user/${props.username}/comments`} passHref>
            <ListItem component="a" button>
              <ListItemIcon>
                <Comment />
              </ListItemIcon>
              <ListItemText primary="Comments" />
            </ListItem>
          </Link>
        </List>
      </Paper>
    </Box>
  );
};

export default Navigation;
