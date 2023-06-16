import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Button,
  Container,
  createStyles,
  Grid,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { GlobalContext } from '../context/global-context';
import { SHOW_NOTIFICATION } from '../context/actions';
import Footer from '../components/Footer/Footer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    container: {
      maxWidth: '800px',
      margin: theme.spacing(3, 0),
    },
    text: {
      '& > p': {
        marginTop: theme.spacing(2),
      },
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
      },
    },
    inputsContainer: {
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        boxShadow: 'none',
        background: theme.palette.background.default,
      },
    },
    inputs: {
      display: 'flex',
      flexDirection: 'column',
      '& > div': {
        marginBottom: theme.spacing(2),
      },
    },
  })
);

const subjects = [
  {
    value: 'Found a bug',
    label: 'Found a bug',
  },
  {
    value: 'Suggestion/Feedback',
    label: 'Suggestion/Feedback',
  },
  {
    value: 'Need help',
    label: 'Need help',
  },
  {
    value: 'Other',
    label: 'Other',
  },
];

const SupportPage = () => {
  const classes = useStyles();

  const initialData = {
    name: '',
    email: '',
    requestType: '',
    description: '',
  };

  const [error, setError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState(initialData);

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const changeHandle = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  const checkMandatoryFieldsNotEmpty = () => {
    if (
      data.name !== '' &&
      data.email !== '' &&
      data.requestType !== '' &&
      data.description !== ''
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const isEmailValid = () => {
    const regex = /^\S+@\S+$/;
    if (data.email.match(regex)) {
      setError(false);
      return true;
    }

    setError(true);
    return false;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      checkMandatoryFieldsNotEmpty();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [data]);

  const sendHandle = async () => {
    if (isEmailValid() === false) {
      return;
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      dispatchAction({ type: SHOW_NOTIFICATION, payload: { type: 'error' } });

      return;
    }

    dispatchAction({
      type: SHOW_NOTIFICATION,
      payload: {
        type: 'success',
        message: 'Thank you! We received your request.',
      },
    });

    setData(initialData);
  };

  return (
    <>
      <Head>
        <title>Support - u-review.me</title>
        <meta title="description" content="Get support on u-review.me" />
      </Head>

      <Container maxWidth={false} className={classes.root}>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} md={6}>
            <div className={classes.text}>
              <Typography variant="h4" component="h1">
                How can we help you?
              </Typography>
              <Typography>
                You need help or you found a bug or simply just want to say hi?
              </Typography>
              <Typography>
                Please fill the form and select the appropriate "Request" type.
              </Typography>
              <Typography>
                We'll respond to you via email within 24h.
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.inputsContainer}>
              <div className={classes.inputs}>
                <TextField
                  id="name"
                  label="Name"
                  name="name"
                  value={data.name}
                  onChange={changeHandle}
                  variant="outlined"
                  placeholder="Scooby Doo"
                  required
                />
                <TextField
                  id="email"
                  label="Email"
                  name="email"
                  value={data.email}
                  onChange={changeHandle}
                  variant="outlined"
                  placeholder="email@example.com"
                  autoComplete="email"
                  required
                  error={error}
                  helperText={error ? 'Invalid email address' : undefined}
                />
                <TextField
                  id="requestType"
                  select
                  label="Request"
                  name="requestType"
                  value={data.requestType}
                  onChange={changeHandle}
                  variant="outlined"
                  required
                >
                  {subjects.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  id="description"
                  label="Description"
                  name="description"
                  multiline
                  rows={14}
                  value={data.description}
                  onChange={changeHandle}
                  variant="outlined"
                  required
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isDisabled}
                  onClick={sendHandle}
                >
                  Send
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default SupportPage;
