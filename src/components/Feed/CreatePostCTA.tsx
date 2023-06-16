import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { GlobalContext } from '../../context/global-context';
import { OPEN_CREATE_POST_DIALOG } from '../../context/actions';
import useAuthorized from '../../hooks/useAuthorized';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(1.5),
    },
  })
);

const CreatePostCTA = () => {
  const classes = useStyles();
  const { globalState, dispatchAction } = useContext(GlobalContext);

  const [isAuthorized] = useAuthorized();

  const openCreatePostModal = () => {
    dispatchAction({ type: OPEN_CREATE_POST_DIALOG, payload: true });
  };

  return (
    <Paper variant="outlined" className={classes.root}>
      <TextField
        id="outlined-full-width"
        // label="Label"
        style={{ padding: 16 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BorderColorIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Add Review"
        fullWidth
        variant="outlined"
        onClick={() => isAuthorized(openCreatePostModal)}
        onChange={() => isAuthorized(openCreatePostModal)}
      />
    </Paper>
  );
};

export default CreatePostCTA;
