const constants = require('../constants/constants');

const urlsReducer = (state = [], action) => {
  switch (action.type) {
  case 'FETCH_URLS':
    return action.payload.data;
    break;
  case 'SORT_URLS':
    return action.payload;
    break;
  case 'SUBMIT_URL':
    return [...state, action.payload.data];
    break;
  default:
    return state;
    break;
  }
}

export default urlsReducer;
