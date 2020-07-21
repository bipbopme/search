import axios from 'axios';
import { memoize } from '../../redis';

const YELP_KEY = process.env.YELP_KEY;

async function searchYelpBusinesses(query, location, limit = 5) {
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
}

async function getYelpBusiness(id) {
  const response = await axios.get(`https://api.yelp.com/v3/businesses/${id}`, {
    headers: {
      Authorization: `Bearer ${YELP_KEY}`
    }
  });

  return response.data;
}

const getYelpBusinessCached = memoize(getYelpBusiness);
const searchYelpBusinessesCached = memoize(searchYelpBusinesses);

function getSourceUrl(query, location) {
  const params = new URLSearchParams();
  params.append('find_desc', query);
  params.append('find_loc', location);

  return `https://www.yelp.com/search?${params}`;
}

async function getPlacesByLocation({ query, location }) {
  if (location) {
    const places = await searchYelpBusinessesCached(query, location);

    return {
      result: {
        id: `places-${query}-${location}`,
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
}

async function getPlacesByLocationSupplement(props) {
  const response = await getPlacesByLocation(props);

  delete response.result.insertIndex;

  return {
    supplement: response.result
  };
}

async function getPlacesFromYelpSearchResult({ result }) {
  const url = new URL(result.url);
  const query = url.searchParams.get('find_desc');
  const location = url.searchParams.get('find_loc');

  if (query && location) {
    return getPlacesByLocation({ query, location });
  }
}

async function getPlacesFromTripAdvisorResult({ patternMatch }) {
  return getPlacesByLocation({ query: patternMatch[1], location: patternMatch[2] });
}

async function getPlace({ patternMatch, location }) {
  const place = await getYelpBusinessCached(patternMatch[1]);

  return {
    supplement: {
      id: `places-${patternMatch[1]}`,
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
        urlPattern: /^https:\/\/www.yelp.+\/nearme/,
        onMatch: getPlacesByLocation
      }
    },
    {
      result: {
        urlPattern: /^https:\/\/www.yelp.+\/search/,
        onMatch: getPlacesFromYelpSearchResult
      }
    },
    {
      result: {
        namePattern: /THE 10 BEST (.+) in (.+) -/,
        onMatch: getPlacesFromTripAdvisorResult
      }
    },
    {
      result: {
        urlPattern: /^https:\/\/www.yelp.+\/biz\/([^\/]+)$/,
        onMatch: getPlace
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
