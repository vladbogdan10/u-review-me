import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import { ListItem, ListItemText } from '@material-ui/core';
import Link from 'next/link';
import Box from '@material-ui/core/Box';

const SideNavigation = () => {
  return (
    <Box position="sticky" top="76px">
      <Paper variant="outlined">
        <List component="nav" aria-labelledby="profileOptions">
          <Link href={`/legal/privacy`} passHref>
            <ListItem component="a" button>
              <ListItemText primary="Privacy Policy" />
            </ListItem>
          </Link>
          <Link href={`/legal/cookie-policy`} passHref>
            <ListItem component="a" button>
              <ListItemText primary="Cookie Policy" />
            </ListItem>
          </Link>
          <Link href={`/legal/imprint`} passHref>
            <ListItem component="a" button>
              <ListItemText primary="Imprint" />
            </ListItem>
          </Link>
        </List>
      </Paper>
    </Box>
  );
};

export default SideNavigation;
