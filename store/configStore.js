import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from 'redux-thunk';

import { UIReducer , userReducer, recordsReducer, linksReducer } from "./reducers";

const rootReducer = combineReducers({
  UI: UIReducer,
  user:userReducer,
  sharedRecords: recordsReducer,
  sharedLinks: linksReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)))

export const { dispatch } = configureStore;
export default configureStore;
