import axios from 'axios';
import { memoize } from '../../redis';
import { result } from 'lodash';

const YELP_KEY = process.env.YELP_KEY;

const search = memoize(async (query, location, limit = 5) => {
  const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
    headers: {
      Authorization: `Bearer ${YELP_KEY}`
    },
    params: {
      term: query,
      location,
      limit
    }
  });

  return response.data.businesses;
}, 'placeSearch-v2');

function getSourceUrl(query, location) {
  const params = new URLSearchParams();
  params.append('find_desc', query);
  params.append('find_loc', location);

  return `https://www.yelp.com/search?${params}`;
}

async function getNearByResult({ query }) {
  const location = 'Lafayatte, CA';
  const places = await search(query, location);

  return {
    result: {
      insertIndex: 0,
      type: 'places',
      places,
      location,
      source: 'Yelp',
      sourceIconUrl: 'https://yelp.com/favicon.ico',
      sourceUrl: getSourceUrl(query, location)
    }
  };
}

async function getNearBySupplement(props) {
  const response = await getNearByResult(props);

  delete response.result.insertIndex;

  return {
    supplement: response.result
  };
}

export default {
  name: 'Places (Result)',
  description: 'Find those sweet local businesses.',
  matches: [
    {
      result: {
        urlPattern: /yelp.com\/nearme/,
        maxIndex: 9,
        onMatch: getNearByResult
      }
    },
    {
      result: {
        urlPattern: /store.locator/i,
        namePattern: /store.locator/i,
        maxIndex: 9,
        onMatch: getNearBySupplement
      }
    }
  ],
  shouldMatchQueries: ['best bbq near me'],
  shouldNotMatchQueries: ['']
};