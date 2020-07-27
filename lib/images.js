import bing from './bing';
import { omit } from 'lodash';
import { memoize } from './redis';

const DEFAULT_SEARCH_PARAMS = { count: 50 };

async function searchBingImagesAndTransform(params) {
  const bingResponse = await bing.searchImages(params);
  const response = {};

  response.queryContext = bingResponse.queryContext;
  response.stats = { totalEstimatedMatches: bingResponse.totalEstimatedMatches || 0 };
  response.results =
    bingResponse.value?.map(result => omit(result, ['webSearchUrl', 'imageInsightsToken'])) || [];

  return response;
}

const searchBingImagesAndTransformCached = memoize(searchBingImagesAndTransform);

export async function search(params) {
  const startTime = Date.now();
  const response = await searchBingImagesAndTransformCached({
    ...DEFAULT_SEARCH_PARAMS,
    ...params
  });
  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log('------------------------------------');
  console.log('Image Search:', `${totalTime}ms`);
  console.log('------------------------------------');

  response.stats.totalTime = totalTime;

  return response;
}

export default { search };
