import _ from 'lodash';
import bing from './bing';
import { enhanceResponse } from './enhancements';
import { sha1, delay } from './utils';
import { memoize } from './redis';

const MAX_RESPONSE_MS = 1500;
const DEFAULT_SEARCH_PARAMS = { count: 20 };

async function searchAndTransform(params) {
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
}

const searchAndTransformCached = memoize(searchAndTransform);

export async function precache(params) {
  searchAndTransform({ ...DEFAULT_SEARCH_PARAMS, ...params });
}

export async function search(params, location = null) {
  const query = params.q;
  const startTime = Date.now();
  const response = await searchAndTransformCached({ ...DEFAULT_SEARCH_PARAMS, ...params });
  const correctedQuery =
    response.queryContext?.alteredQuery || response.queryContext?.originalQuery || query;
  const searchEndTime = Date.now();
  const searchElaspedTime = searchEndTime - startTime;
  const timeRemaining = MAX_RESPONSE_MS - searchElaspedTime;

  if (timeRemaining > 0) {
    await Promise.race([
      delay(MAX_RESPONSE_MS - searchElaspedTime),
      enhanceResponse(correctedQuery, response, location)
    ]);
  }

  const completeTime = Date.now();
  console.log('Search time:', `${searchElaspedTime}ms`);
  console.log('Enahancement allotment:', `${timeRemaining}ms`);
  console.log('Enhancement time:', `${completeTime - searchEndTime}ms`);
  console.log('Total time:', `${completeTime - startTime}ms`);

  return response;
}
