import React, { ChangeEvent, useContext, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Checkbox, Paper, Typography } from '@material-ui/core';
import { UserType } from '../../types/types';
import { GlobalContext } from '../../context/global-context';
import { SHOW_NOTIFICATION } from '../../context/actions';
import UserAvatar from './UserAvatar';
import buildAvatarUrl from '../../utils/buildAvatarUrl';
import DeleteAccountDialog from './DeleteAccountDialog';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    profileMain: {
      display: 'flex',

      '& form': {
        width: '100%',
      },

      [theme.breakpoints.down('xs')]: {
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
    },
    profileMainItems: {
      marginTop: theme.spacing(0.4),
      '& > div:not(:first-child)': {
        marginTop: theme.spacing(2),
      },
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    deleteButton: {
      background: theme.palette.error.main,
      color: theme.palette.text.primary,
      '&:hover': {
        background: theme.palette.error.dark,
      },
    },
    buttons: {
      marginLeft: 'auto',
      '& button:nth-child(2)': {
        marginLeft: theme.spacing(1),
      },
    },
    avatarContainer: {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(1.5),
    },
    avatar: {
      width: '130px',
      height: '130px',
      [theme.breakpoints.down('xs')]: {
        width: '60px',
        height: '60px',
      },
    },
    resetMarginTop: {
      marginTop: '0 !important',
    },
  })
);

const UserProfileLoggedIn = (props: { user: UserType }) => {
  const classes = useStyles();

  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState(props.user);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const editHandler = () => {
    setIsEdit(true);
  };

  const cancelHandle = () => {
    setUserData(props.user);
    setIsEdit(false);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;

    let value: string | boolean = target.value;

    if (name === 'showName') {
      value = target.checked;
    }

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const setAvatar = (image: string) => {
    setUserData({
      ...userData,
      image: image,
    });
  };

  const saveHandle = async () => {
    const response = await fetch('/api/update/user', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    setIsEdit(false);

    // ensure no old user state
    window.location.reload();
  };

  return (
    <>
      <Paper variant="outlined" className={classes.root}>
        <div className={classes.profileMain}>
          <div className={classes.avatarContainer}>
            <UserAvatar
              src={buildAvatarUrl(userData.image)}
              alt={userData.name}
              setAvatar={setAvatar}
              className={classes.avatar}
              showOptions={isEdit}
            />
          </div>
          <form>
            <div className={classes.profileMainItems}>
              <TextField
                label="username"
                id="username"
                value={userData.username}
                variant="outlined"
                fullWidth
                disabled
              />
              <TextField
                label="Name"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                disabled={!isEdit}
              />
              <div className={classes.resetMarginTop}>
                <Checkbox
                  id="showName"
                  name="showName"
                  defaultChecked={props.user.showName}
                  size="small"
                  color="primary"
                  inputProps={{ 'aria-label': 'set name to be public' }}
                  onChange={handleChange}
                  disabled={!isEdit}
                />
                <label htmlFor="showName">
                  <Typography variant="caption" color="textSecondary">
                    Show name on profile page
                  </Typography>
                </label>
              </div>
              <TextField
                label="E-mail"
                id="userEmail"
                name="email"
                value={userData.email}
                variant="outlined"
                helperText={
                  isEdit ? 'Email change not available for now' : undefined
                }
                fullWidth
                type="email"
                disabled
              />
              <TextField
                id="userBio"
                label="Bio"
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                disabled={!isEdit}
              />
              <div className={classes.buttonsContainer}>
                {isEdit === true ? (
                  <>
                    <Button
                      variant="contained"
                      className={classes.deleteButton}
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                    <div className={classes.buttons}>
                      <Button
                        variant="outlined"
                        onClick={cancelHandle}
                        color="primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={saveHandle}
                        color="primary"
                      >
                        Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={editHandler}
                    color="primary"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </Paper>
      <DeleteAccountDialog
        open={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        userId={props.user._id}
      />
    </>
  );
};

export default UserProfileLoggedIn;
