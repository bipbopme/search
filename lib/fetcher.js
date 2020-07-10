import axios from 'axios';

export default async function fetcher(url, query, market = null, location = null) {
  return axios({
    url,
    params: { q: query, mkt: market, location }
  }).then(res => res.data);
}
