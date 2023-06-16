import React, { ChangeEvent, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { GlobalContext } from '../../context/global-context';
import {
  OPEN_CREATE_POST_DIALOG,
  SET_NEW_POST_CATEGORY,
  SET_NEW_POST_SUBCATEGORY,
} from '../../context/actions';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from './DialogTitle';

const useStyles = makeStyles((theme) => ({
  content: {
    paddingBottom: theme.spacing(2),
  },
  categoriesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'flex-start',
    minHeight: '350px',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  searchInput: {
    padding: theme.spacing(1, 3),
  },
}));

const CategorySelect = () => {
  const classes = useStyles();

  const { globalState, dispatchAction } = useContext(GlobalContext);
  const { categories } = globalState;

  const category = globalState.newPostCategory;

  const [subcategories, setSubcategories] = useState(
    Object.values(categories[category].subcategories)
  );

  // TODO: types
  const setSubcategory = (subcategory: { slug: string; name: string }) => {
    dispatchAction({ type: SET_NEW_POST_SUBCATEGORY, payload: subcategory });
  };

  const searchForCategory = (query: string) => {
    const found = Object.values(categories[category].subcategories).filter(
      (subcategory) =>
        subcategory.name.toLowerCase().includes(query.toLowerCase())
    );

    setSubcategories(found);
  };

  const searchInputHandle = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = event.target.value;

    searchForCategory(value);
  };

  const closeHandle = () => {
    dispatchAction({ type: OPEN_CREATE_POST_DIALOG, payload: false });
    dispatchAction({ type: SET_NEW_POST_CATEGORY, payload: '' });
    dispatchAction({ type: SET_NEW_POST_SUBCATEGORY, payload: '' });

    backHandle();
  };

  const backHandle = () => {
    dispatchAction({ type: SET_NEW_POST_CATEGORY, payload: '' });
  };

  return (
    <React.Fragment>
      <DialogTitle onClose={closeHandle} onBack={backHandle}>
        {`Pick a ${category === 'games' ? 'genre' : 'category'}`}
      </DialogTitle>
      <div className={classes.searchInput}>
        <TextField
          id="search-subcategory"
          label="Search for category"
          variant="outlined"
          size="small"
          fullWidth
          onChange={(e) => searchInputHandle(e)}
        />
      </div>
      <DialogContent className={classes.content}>
        <div className={classes.categoriesContainer}>
          {subcategories.map((subcategory) => (
            <Chip
              key={subcategory.slug}
              label={subcategory.name}
              onClick={() =>
                setSubcategory({
                  slug: subcategory.slug,
                  name: subcategory.name,
                })
              }
            />
          ))}
        </div>
      </DialogContent>
    </React.Fragment>
  );
};

export default CategorySelect;
