import { memoize } from '../../lib/redis';
import { precache } from '../../lib/search';
import { suggestions } from '../../lib/bing';
import { getGeo } from '../../lib/geo';

async function suggestAndTransform(params) {
  const response = await suggestions(params);

  let results = [];

  if (response && response.queryContext) {
    results[0] = response.queryContext.originalQuery;
  }

  if (response && response.suggestionGroups && response.suggestionGroups[0]) {
    results[1] = response.suggestionGroups[0].searchSuggestions.map(s => s.query);
  }

  return results;
}

const suggestAndTransformCached = memoize(suggestAndTransform);

export default async (req, res) => {
  const ip = process.env.GEOIP_OVERRIDE || req.headers['x-real-ip'];
  const geo = getGeo(ip);
  const results = await suggestAndTransformCached({ mkt: geo.market, ...req.query });

  // preache the top search suggestions
  // const topSuggestion = results[1]?.[0];
  // if (topSuggestion && topSuggestion.length <= 20) {
  //   precache({ ...req.query, q: topSuggestion });
  // }

  res.json(results);
};
