import axios from 'axios';

const BING_ENDPOINT = process.env.BING_ENDPOINT;
const BING_KEY = process.env.BING_KEY;
const BING_IMAGES_KEY = process.env.BING_IMAGES_KEY;

async function exec(path, params = {}, headers = {}, subscriptionKey) {
  headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;

  const response = await axios.get(path, {
    baseURL: BING_ENDPOINT,
    headers: headers,
    params: params
  });

  return response.data;
}

export async function search(params = {}, headers = {}) {
  return exec('/search', params, headers, BING_KEY);
}

export async function suggestions(params = {}, headers = {}) {
  return exec('/suggestions', params, headers, BING_KEY);
}

export async function searchImages(params = {}, headers = {}) {
  return exec('/images/search', params, headers, BING_IMAGES_KEY);
}

export default { search, suggestions, searchImages };
