import React, { useReducer, createContext } from 'react';
import { reducer } from './reducer';
import { CategoryType, CommentType, PostType } from '../types/types';
import categories from '../../categories.json';

const initialState: State = {
  editedPostId: null,
  deletedPostId: null,
  categories,
  newComment: null,
  notification: {
    open: false,
    type: '',
    message: undefined,
  },
  isNavigationDrawerOpen: false,
  isLogoutModalOpen: false,
  isCreatePostDialogOpen: false,
  newPostCategory: '',
  newPostSubcategory: {
    slug: '',
    name: '',
  },
  activeCategory: undefined,
  activeSubcategory: undefined,
  postWordsCount: 0,
};

export interface State {
  editedPostId: PostType['_id'] | null;
  deletedPostId: PostType['_id'] | null;
  categories: CategoryType;
  newComment: CommentType | null;
  notification: {
    open: boolean;
    type: string;
    message: undefined | string;
  };
  isNavigationDrawerOpen: boolean;
  isLogoutModalOpen: boolean;
  isCreatePostDialogOpen: boolean;
  newPostCategory: string;
  newPostSubcategory: {
    slug: string;
    name: string;
  };
  activeCategory: string | undefined;
  activeSubcategory: string | undefined;
  postWordsCount: number;
}

// TODO: generic type for payload
export const GlobalContext = createContext({
  globalState: initialState,
  dispatchAction: (value: { type: string; payload?: any }) => {},
});

export const GlobalContextProvider = (props: {
  children: JSX.Element | null;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider
      value={{ globalState: state, dispatchAction: dispatch }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
