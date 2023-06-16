/* eslint-disable no-use-before-define */
import React, { ChangeEvent, useState } from 'react';
import {
  alpha,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import { IconButton, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      marginRight: theme.spacing(1),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
      [theme.breakpoints.down('sm')]: {
        order: 1,
      },
    },
    button: {
      position: 'absolute',
      right: 4,
    },
    inputRoot: {
      width: '100%',
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 4.5, 1, 1.5),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '24ch',
        '&:focus': {
          width: '32ch',
        },
      },
    },
  })
);

const SearchInput = () => {
  const classes = useStyles();
  const router = useRouter();

  const [query, setQuery] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query !== '') {
      router.push(`/search?q=${query}`);
    }

    setQuery('');
  };

  return (
    <div className={classes.search}>
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        value={query}
        onChange={handleInputChange}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <IconButton
        size="small"
        title="Search button"
        className={classes.button}
        onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
};

export default SearchInput;
