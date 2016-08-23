import { combineReducers } from 'redux';
import UrlsReducer from './urls.js';

const rootReducer = combineReducers({
  urls: UrlsReducer
});

export default rootReducer;
