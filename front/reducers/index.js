import { HYDRATE } from 'next-redux-saga';
import { combineReducers } from 'redux';

import user from './user';
import post from './post';

const rootReducer = combineReducers({
  index: (state = {}, action) => {
    switch (action) {
      case HYDRATE:
        console.log(HYDRATE, action);
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});

export default rootReducer;
