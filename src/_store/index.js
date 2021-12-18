import { combineReducers } from "redux";
import movieData from "./movieData.js";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import promiseMiddleware from "redux-promise";

const appReducer = combineReducers({
  movieData,
});

// Apply middleware reduxThunk and promisemiddleware to give function to a dispatch as a parameter
const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  ReduxThunk
)(createStore);

//Set store and redux deve tools
const store = createStoreWithMiddleware(
  appReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
