import fs from 'fs';
import _ from 'lodash';

// Load enhancers into memory
let enhancers = [];
loadEnhancers();

export async function enhanceResponse(query, response) {
  response.answers = [];
  response.supplements = [];

  await Promise.all(
    enhancers.map(async enhancer => {
      const enhancement = await getEnhancement(query, response, enhancer);

      if (enhancement?.answer) {
        response.answers.push(enhancement.answer);
      }

      if (enhancement?.supplement) {
        response.supplements.push(enhancement.supplement);
      }
    })
  );
}

async function getEnhancement(query, response, enhancer) {
  let enhancement = await getQueryEnhancement(query, enhancer);

  if (!enhancement) {
    enhancement = await getResultEnhancement(response, enhancer);
  }

  return enhancement;
}

async function getQueryEnhancement(query, enhancer) {
  const queryMatcher = enhancer.match?.query;
  let enhancement = null;

  if (queryMatcher?.pattern && enhancer.onQueryMatch) {
    const match = query.match(queryMatcher.pattern);

    if (match) {
      enhancement = await enhancer.onQueryMatch(query, match);
    }
  }

  return enhancement;
}

async function getResultEnhancement(response, enhancer) {
  const results = response.results;
  const resultMatcher = enhancer.match?.result;
  let enhancement = null;

  if (resultMatcher?.pattern && enhancer.onResultMatch) {
    const maxIndex = resultMatcher.maxIndex || 10;

    for (let i = 0; i <= maxIndex; i++) {
      const result = results[i];
      const match = result?.url.match(resultMatcher.pattern);

      if (match) {
        enhancement = await enhancer.onResultMatch(result, i, match);
        break;
      }
    }
  }

  return enhancement;
}

async function loadEnhancers() {
  const files = await fs.promises.readdir('./lib/enhancers');
  enhancers = await Promise.all(
    files.map(async file => (await import('./enhancers/' + file)).default)
  );
  enhancers = _.sortBy(enhancers, 'priority');

  console.log(`Loaded enhancers: ${enhancers.map(a => a.name).join(', ')}`);
}
