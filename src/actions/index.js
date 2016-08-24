import axios from 'axios';
import constants from '../constants/constants';

export function fetchUrls () {
  const request = axios.get('/api/urls');
  return { type: constants.FETCH_URLS, payload: request };
};

export function submitUrl (url) {
  const request = axios.post('/api/urls', url);
  return { type: constants.SUBMIT_URL, payload: request };
}
