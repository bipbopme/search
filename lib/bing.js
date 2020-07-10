import axios from 'axios';

const BING_ENDPOINT = process.env.BING_ENDPOINT;
const BING_KEY = process.env.BING_KEY;

async function exec(path, params = {}, headers = {}) {
  headers['Ocp-Apim-Subscription-Key'] = BING_KEY;

  const response = await axios.get(path, {
    baseURL: BING_ENDPOINT,
    headers: headers,
    params: params
  });

  return response.data;
}

export async function search(params = {}, headers = {}) {
  return exec('/search', params, headers);
}

export async function suggestions(params = {}, headers = {}) {
  return exec('/suggestions', params, headers);
}

export default { search, suggestions };
