import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Paper } from '@material-ui/core';
import { UserType } from '../../types/types';
import buildAvatarUrl from '../../utils/buildAvatarUrl';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    profileMain: {
      display: 'flex',
      [theme.breakpoints.down('xs')]: {
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      '& form': {
        width: '100%',
      },
    },
    profileMainItems: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      '& > div': {
        margin: theme.spacing(1, 0),
      },
    },
    avatar: {
      marginRight: theme.spacing(2),
      width: '130px',
      height: '130px',
      background: 'white',
      [theme.breakpoints.down('xs')]: {
        width: '60px',
        height: '60px',
        marginBottom: theme.spacing(1.5),
      },
    },
    input: {
      '& input': {
        color: theme.palette.text.primary,
      },
    },
    textarea: {
      '& textarea': {
        color: theme.palette.text.primary,
      },
    },
  })
);

const UserProfile = (props: { user: UserType }) => {
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.root}>
      <div className={classes.profileMain}>
        <Avatar
          src={buildAvatarUrl(props.user.image)}
          alt="User avatar"
          className={classes.avatar}
        ></Avatar>
        <form>
          <div className={classes.profileMainItems}>
            <TextField
              className={classes.input}
              label="username"
              id="username"
              value={props.user.username}
              variant="outlined"
              fullWidth
              disabled
            />
            {props.user.showName && (
              <TextField
                className={classes.input}
                label="Name"
                id="name"
                name="name"
                value={props.user.name}
                variant="outlined"
                fullWidth
                disabled
              />
            )}
            <TextField
              className={classes.textarea}
              id="userBio"
              label="Bio"
              name="bio"
              value={props.user.bio}
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              disabled
            />
          </div>
        </form>
      </div>
    </Paper>
  );
};

export default UserProfile;
