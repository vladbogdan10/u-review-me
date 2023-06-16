import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Devices, SportsEsports } from '@material-ui/icons';
import { GlobalContext } from '../../context/global-context';
import {
  OPEN_CREATE_POST_DIALOG,
  SET_NEW_POST_CATEGORY,
  SET_NEW_POST_SUBCATEGORY,
} from '../../context/actions';
import DialogTitle from './DialogTitle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      paddingBottom: theme.spacing(2),
    },
    buttonsContainer: {
      display: 'flex',

      '& button:not(:last-child)': {
        marginRight: theme.spacing(2),
      },
    },
  })
);

const PostTypeSelect = () => {
  const classes = useStyles();

  const { globalState, dispatchAction } = useContext(GlobalContext);

  const setCategory = (category: string) => {
    dispatchAction({ type: SET_NEW_POST_CATEGORY, payload: category });
  };

  const closeHandle = () => {
    dispatchAction({ type: OPEN_CREATE_POST_DIALOG, payload: false });
    dispatchAction({ type: SET_NEW_POST_CATEGORY, payload: '' });
    dispatchAction({ type: SET_NEW_POST_SUBCATEGORY, payload: '' });
  };

  return (
    <React.Fragment>
      <DialogTitle onClose={closeHandle}>
        Which type of review you want to add?
      </DialogTitle>
      <DialogContent className={classes.content}>
        <div className={classes.buttonsContainer}>
          <Button
            onClick={() => setCategory('tech')}
            variant="contained"
            fullWidth
            startIcon={<Devices />}
          >
            Tech Review
          </Button>
          <Button
            onClick={() => setCategory('games')}
            variant="contained"
            fullWidth
            startIcon={<SportsEsports />}
          >
            Game Review
          </Button>
        </div>
      </DialogContent>
    </React.Fragment>
  );
};

export default PostTypeSelect;
