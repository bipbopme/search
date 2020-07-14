import _ from 'lodash';
import bing from './bing';
import { enhanceResponse } from './enhancements';
import { sha1 } from './utils';
import { isMemoized, memoize } from './redis';

const MAX_RESPONSE_MS = 1500;
const DEFAULT_SEARCH_PARAMS = { count: 20 };

export async function search(params, location = null) {
  const query = params.q;
  const startTime = Date.now();

  console.time('search');
  const response = await searchAndTransform({ ...DEFAULT_SEARCH_PARAMS, ...params });
  const correctedQuery =
    response.queryContext?.alteredQuery || response.queryContext?.originalQuery || query;
  console.timeEnd('search');

  console.time('enhance');
  // If it has been less than max millisecons then wait for the enhancements
  // otherwise cache them for next time.
  if (Date.now() - startTime <= MAX_RESPONSE_MS) {
    await enhanceResponse(correctedQuery, response, location);
  } else {
    console.log('not waiting for enhancements');
    enhanceResponse(correctedQuery, response);
  }
  console.timeEnd('enhance');

  return response;
}

export async function precache(params) {
  const mergedParams = { ...params, ...DEFAULT_SEARCH_PARAMS };
  const exists = await isMemoized('searchAndTransform-v1', mergedParams);

  if (!exists) {
    searchAndTransform(mergedParams);
  }
}

const searchAndTransform = memoize(async params => {
  const bingResponse = await bing.search(params);
  const response = {};

  response.queryContext = bingResponse.queryContext;
  response.totalEstimatedMatches = bingResponse.webPages?.totalEstimatedMatches || 0;
  response.results = bingResponse.webPages?.value?.map(item => {
    const result = _.pick(item, ['name', 'url', 'displayUrl', 'snippet', 'isNavigational']);

    return {
      id: sha1(JSON.stringify(result)),
      type: 'webPage',
      ...result
    };
  });

  return response;
}, 'searchAndTransform-v1');
