import { memoize } from '../../lib/redis';
import { precache } from '../../lib/search';
import { suggestions } from '../../lib/bing';

const suggestAndTransform = memoize(async params => {
  const response = await suggestions(params);

  let results = [];

  if (response && response.queryContext) {
    results[0] = response.queryContext.originalQuery;
  }

  if (response && response.suggestionGroups && response.suggestionGroups[0]) {
    results[1] = response.suggestionGroups[0].searchSuggestions.map(s => s.query);
  }

  return results;
}, 'suggestAndTransform-v1');

export default async (req, res) => {
  console.time('suggestions');
  const results = await suggestAndTransform(req.query);
  console.timeEnd('suggestions');

  // preache the top search suggestions
  const topSuggestion = results[1]?.[0];
  if (topSuggestion && topSuggestion.length <= 20) {
    precache({ ...req.query, q: topSuggestion });
  }

  res.json(results);
};
