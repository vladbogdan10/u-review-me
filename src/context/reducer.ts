import * as a from './actions';
import { State } from './global-context';

type Action = {
  type: string;
  payload?: any;
};

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case a.EDIT_POST:
      return {
        ...state,
        editedPostId: action.payload,
      };
    case a.DELETE_POST:
      return {
        ...state,
        deletedPostId: action.payload,
      };
    case a.NEW_COMMENT:
      return {
        ...state,
        newComment: action.payload,
      };
    case a.SHOW_NOTIFICATION:
      return showNotification(state, action.payload);
    case a.TOGGLE_OPEN_NAV_DRAWER:
      return {
        ...state,
        isNavigationDrawerOpen: action.payload,
      };
    case a.OPEN_LOGOUT_MODAL:
      return {
        ...state,
        isLogoutModalOpen: action.payload,
      };
    case a.OPEN_CREATE_POST_DIALOG:
      return {
        ...state,
        isCreatePostDialogOpen: action.payload,
      };
    case a.SET_NEW_POST_CATEGORY:
      return {
        ...state,
        newPostCategory: action.payload,
      };
    case a.SET_NEW_POST_SUBCATEGORY:
      return {
        ...state,
        newPostSubcategory: action.payload,
      };
    case a.ACTIVE_CATEGORY:
      return {
        ...state,
        activeCategory: action.payload,
      };
    case a.ACTIVE_SUBCATEGORY:
      return {
        ...state,
        activeSubcategory: action.payload,
      };
    case a.POST_WORDS_COUNT:
      return {
        ...state,
        postWordsCount: action.payload,
      };
    default: {
      throw new Error(`Unhandled type: ${action.type}`);
    }
  }
}

function showNotification(
  state: State,
  payload: { type: string; message?: string | undefined }
) {
  return {
    ...state,
    notification: {
      open: true,
      type: payload.type,
      message: payload.message,
    },
  };
}
