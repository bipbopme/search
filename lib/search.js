import _ from 'lodash';
import bing from './bing';
import { enhanceResponse } from './enhancements';
import { sha1, delay } from './utils';
import { memoize } from './redis';
import { captureException } from './exceptions';

const MAX_RESPONSE_MS = 1500;
const DEFAULT_SEARCH_PARAMS = { count: 20 };

async function searchBingAndTransform(params) {
  const bingResponse = await bing.search(params);
  const response = {};

  response.queryContext = bingResponse.queryContext;
  response.stats = { totalEstimatedMatches: bingResponse.webPages?.totalEstimatedMatches || 0 };
  response.results =
    bingResponse.webPages?.value?.map(item => {
      // Pick primary attributes
      const result = _.pick(item, ['name', 'url', 'displayUrl', 'snippet', 'isNavigational']);

      // Pick primary attributes for deepLinks if included. Only include 4.
      if (item.deepLinks) {
        result.deepLinks = item.deepLinks
          .slice(0, 4)
          .map(deepLink => _.pick(deepLink, ['name', 'url', 'snippet']));
      }

      return {
        id: sha1(JSON.stringify(result)),
        type: 'webPage',
        ...result
      };
    }) || [];

  return response;
}

const searchBingAndTransformCached = memoize(searchBingAndTransform);

export async function precache(params) {
  searchBingAndTransform({ ...DEFAULT_SEARCH_PARAMS, ...params });
}

function getBestQuery(query, queryContext) {
  let cleanQuery = queryContext?.alteredQuery || queryContext?.originalQuery || query || '';

  cleanQuery = cleanQuery.toLowerCase();

  return cleanQuery;
}

export async function search(params, geo) {
  const startTime = Date.now();

  const query = params.q;
  const response = await searchBingAndTransformCached({ ...DEFAULT_SEARCH_PARAMS, ...params });
  const bestQuery = getBestQuery(query, response.queryContext);

  const searchEndTime = Date.now();
  const searchElaspedTime = searchEndTime - startTime;
  const timeRemaining = MAX_RESPONSE_MS - searchElaspedTime;

  try {
    if (timeRemaining > 0) {
      await Promise.race([delay(timeRemaining), enhanceResponse(bestQuery, response, geo)]);
    }
  } catch (e) {
    captureException(e);
  }

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log('------------------------------------');
  console.log('Search:', `${searchElaspedTime}ms`);
  console.log('Remaining:', `${timeRemaining}ms`);
  console.log('Enhancements:', `${endTime - searchEndTime}ms`);
  console.log('Total:', `${totalTime}ms`);
  console.log('------------------------------------');

  response.stats.totalTime = totalTime;

  return response;
}
