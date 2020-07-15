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

const get = memoize(async id => {
  const response = await axios.get(`https://api.yelp.com/v3/businesses/${id}`, {
    headers: {
      Authorization: `Bearer ${YELP_KEY}`
    }
  });

  return response.data;
}, 'placeGet-v2');

function getSourceUrl(query, location) {
  const params = new URLSearchParams();
  params.append('find_desc', query);
  params.append('find_loc', location);

  return `https://www.yelp.com/search?${params}`;
}

async function getPlacesByLocation({ query, location }) {
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

async function getPlacesByLocationSupplement(props) {
  const response = await getPlacesByLocation(props);

  delete response.result.insertIndex;

  return {
    supplement: response.result
  };
}

async function getPlacesByExtractedLocation({ result }) {
  const url = new URL(result.url);
  const query = url.searchParams.get('find_desc');
  const location = url.searchParams.get('find_loc');

  if (query && location) {
    return getPlacesByLocation({ query, location });
  }
}

async function getPlace({ patternMatch, location }) {
  const place = await get(patternMatch[1]);

  return {
    supplement: {
      type: 'places',
      places: [place],
      location,
      source: 'Yelp',
      sourceIconUrl: 'https://yelp.com/favicon.ico',
      sourceUrl: place.url
    }
  };
}

export default {
  name: 'Places (Result)',
  description: 'Find those sweet local businesses.',
  matches: [
    {
      result: {
        urlPattern: /yelp.com\/biz\/([^\/]+)$/,
        onMatch: getPlace
      }
    },
    {
      result: {
        urlPattern: /yelp.com\/nearme/,
        onMatch: getPlacesByLocation
      }
    },
    {
      result: {
        urlPattern: /yelp.com\/search/,
        onMatch: getPlacesByExtractedLocation
      }
    },
    {
      result: {
        urlPattern: /store.locator|find.a.store/i,
        namePattern: /store.locator|find.a.store/i,
        onMatch: getPlacesByLocationSupplement
      }
    }
  ],
  shouldMatchQueries: ['best bbq near me'],
  shouldNotMatchQueries: [''],
  priority: 0
};
