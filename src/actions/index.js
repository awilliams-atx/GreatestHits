import axios from 'axios';
import constants from '../constants/constants';
import { sortByMetric } from '../util/general';

export function fetchUrls () {
  const request = axios.get('/api/urls');
  return { type: constants.FETCH_URLS, payload: request };
};

export function sortUrls (urls, metric, direction) {
  return { type: 'SORT_URLS', payload: sortByMetric(urls, metric, direction) }
};

export function submitUrl (url) {
  const request = axios.post('/api/urls', url);
  return { type: constants.SUBMIT_URL, payload: request };
};
