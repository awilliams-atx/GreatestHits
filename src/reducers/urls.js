const INITIAL_STATE = [];

const urlsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case 'FETCH_URLS':
    return action.payload.data;
    break;
  default:
    return state;
    break;
  }
}

export default urlsReducer;
