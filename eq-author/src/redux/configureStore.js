import { createStore, combineReducers } from "redux";
import saving from "redux/saving/reducer";

const configureStore = () =>
  createStore(
    combineReducers({
      saving,
    })
  );

export default configureStore;
