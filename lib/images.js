import bing from './bing';
import { omit } from 'lodash';
import { memoize } from './redis';
import { getSignedUrl } from './utils';

const DEFAULT_SEARCH_PARAMS = { count: 50 };

function getProxyUrl(url) {
  return getSignedUrl('/api/images/proxy', { url });
}

async function searchBingImagesAndTransform(params) {
  const bingResponse = await bing.searchImages(params);
  const response = {};

  response.queryContext = bingResponse.queryContext;
  response.stats = { totalEstimatedMatches: bingResponse.totalEstimatedMatches || 0 };
  response.results =
    bingResponse.value?.map(r => {
      const result = omit(r, ['webSearchUrl', 'imageInsightsToken']);

      if (result.proxyContentUrl) {
        result.proxyContentUrl = getProxyUrl(result.contentUrl);
      }

      return result;
    }) || [];

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
