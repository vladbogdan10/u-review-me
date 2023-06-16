import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  createStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { GlobalContext } from '../../context/global-context';
import { SHOW_NOTIFICATION } from '../../context/actions';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { makeStyles } from '@material-ui/styles';
import { UserType } from '../../types/types';
import UserAvatar from '../../components/User/UserAvatar';
import buildAvatarUrl from '../../utils/buildAvatarUrl';
import Footer from '../../components/Footer/Footer';
import UserRepository from '../../repository/UserRepository';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 'auto',
      padding: theme.spacing(2),
    },
    elements: {
      width: '100%',
      maxWidth: '370px',
      marginTop: theme.spacing(2),
    },
    input: {
      marginTop: theme.spacing(2),
    },
    button: {
      marginTop: theme.spacing(2),
    },
    avatarContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(4),
    },
    avatar: {
      width: '70px',
      height: '70px',
    },
  })
);

const newuser = (props: { user: UserType; error: boolean }) => {
  if (props.error) {
    return (
      <Typography>
        Something went wrong during sign up! Please try again. If the issue
        persits, please contact support.
      </Typography>
    );
  }

  const classes = useStyles();
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const initialState = {
    error: false,
    errorFields: false,
    errorMessage: '',
    errorFieldsMessage: '',
    isUserTaken: false,
  };

  const [state, setState] = useState(initialState);

  const checkForSpecialCharacters = (text: string) => {
    const regex = /[^A-Za-z0-9_-]/g;
    const found = text.match(regex);

    return found;
  };

  const generateDefaultUserName = () => {
    const userEmail = props.user.email;
    let [username] = userEmail!.split('@');
    const specialCharacters = checkForSpecialCharacters(username);

    if (specialCharacters) {
      specialCharacters.forEach((character) => {
        username = username.replace(character, '');
      });

      return username;
    }

    return username;
  };

  const initialUserData = {
    _id: props.user._id,
    username: generateDefaultUserName(),
    name: props.user.name ?? '',
    bio: '',
    newUser: false,
    showName: true,
    image: props.user.image ?? '',
  };

  const [userData, setUserData] = useState(initialUserData);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let value;

    const target = event.target;
    const name = target.name;

    if (name === 'showName') {
      value = target.checked;
    } else {
      value = target.value;
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

  const save = async () => {
    const isUserNameReady = await checkIfUserNameRequirementsAreFulfilled();
    const isEmptyFields = checkForEmptyFields();

    if (isEmptyFields || isUserNameReady) {
      return;
    }

    const response = await sendRequest({
      endpoint: '/api/update/user',
      data: userData,
      method: 'PUT',
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    const prevUrl = window.sessionStorage.getItem('prevUrl');

    // use window.location.href to redirect because
    // router.push() redirects the user to the previous state of the page.
    if (prevUrl) {
      window.location.href = `${window.location.origin}${prevUrl}`;
    } else {
      window.location.href = window.location.origin;
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      checkIfUserNameRequirementsAreFulfilled();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [userData.username]);

  const checkIfUserNameRequirementsAreFulfilled = async () => {
    const specialCharactersInUserName = checkForSpecialCharacters(
      userData.username
    );

    if (specialCharactersInUserName) {
      setState({
        ...state,
        error: true,
        errorMessage: 'Only letters, numbers, dashes, and underscores allowed.',
      });

      return true;
    }

    if (
      (userData.username !== '' && userData.username.length < 3) ||
      userData.username.length > 20
    ) {
      setState({
        ...state,
        error: true,
        errorMessage: 'Username must be between 3 and 20 characters',
      });

      return true;
    }

    const isUserTaken = await checkIfUserNameTaken();
    if (isUserTaken) {
      setState({
        ...state,
        isUserTaken: true,
        error: true,
        errorMessage: 'Username already taken',
      });

      return true;
    }

    setState(initialState);

    return false;
  };

  const checkIfUserNameTaken = async () => {
    const response = await sendRequest({
      endpoint: '/api/get/is-user-taken',
      data: userData.username,
      method: 'POST',
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    if (response !== undefined) {
      const jsonResponse = await response.json();
      const isUserTaken = jsonResponse.isUserTaken;

      if (isUserTaken) {
        return true;
      }
    }

    return false;
  };

  const sendRequest = async (payload: {
    endpoint: string;
    data: any;
    method: string;
  }) => {
    const response = await fetch(payload.endpoint, {
      method: payload.method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload.data),
    });

    return response;
  };

  const checkForEmptyFields = () => {
    if (userData.username === '') {
      setState({
        ...state,
        error: true,
        errorMessage: "Can't be empty",
      });

      return true;
    }

    if (userData.name === '') {
      setState({
        ...state,
        errorFields: true,
        errorFieldsMessage: "Can't be empty",
      });

      return true;
    }

    return false;
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.elements}>
          <Typography variant="h6" component="h1">
            Almost there! Please review, change or add missing data and then
            continue.
          </Typography>
          <div className={classes.avatarContainer}>
            <UserAvatar
              src={buildAvatarUrl(userData.image)}
              alt={''}
              setAvatar={setAvatar}
              className={classes.avatar}
              showOptions={true}
            />
          </div>
          <TextField
            className={classes.input}
            label="Username"
            id="username"
            name="username"
            value={userData.username}
            variant="outlined"
            onChange={handleChange}
            fullWidth
            error={state.error}
            helperText={state.errorMessage}
            required
          />
          <TextField
            className={classes.input}
            label="Name"
            id="name"
            name="name"
            value={userData.name}
            variant="outlined"
            onChange={handleChange}
            fullWidth
            error={state.errorFields}
            helperText={state.errorFieldsMessage}
            required
          />
          <div>
            <Checkbox
              id="showName"
              name="showName"
              defaultChecked
              size="small"
              color="primary"
              inputProps={{ 'aria-label': 'set name to be public' }}
              onChange={handleChange}
            />
            <label htmlFor="showName">
              <Typography variant="caption" color="textSecondary">
                Show name on profile page
              </Typography>
            </label>
          </div>
          <TextField
            className={classes.input}
            id="userBio"
            placeholder="Write something about youself. Like what are your hobbies, what you're passionate about, etc."
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            multiline
            rows={4}
            variant="outlined"
            fullWidth
          />
          <Button
            className={classes.button}
            variant="contained"
            onClick={save}
            color="primary"
            fullWidth
          >
            Continue
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session === null) {
    return { redirect: { permanent: false, destination: '/auth/signup' } };
  }

  const userRepository = new UserRepository();

  try {
    let userId;

    if (session.user && session.user.id) {
      userId = session.user.id;
    } else {
      throw new Error('User id missing');
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new Error(`No user found with id: ${userId}`);
    }

    if (user.newUser === false) {
      return { redirect: { permanent: false, destination: '/' } };
    }

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)) as UserType,
      },
    };
  } catch (error) {
    console.error(error);

    return { props: { error: true } };
  }
};

export default newuser;
