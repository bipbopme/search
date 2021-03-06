import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import axios from 'axios';
import { memoize } from './redis';
import { captureException } from './exceptions';
import { sha1 } from './utils';

const INTENT_MODEL_ENDPOINT = process.env.INTENT_MODEL_ENDPOINT;

// Load enhancers on start
let enhancers = [];
loadEnhancers();

async function loadEnhancers() {
  const folders = await fs.promises.readdir('./lib/enhancers');
  enhancers = await Promise.all(
    folders.map(async folder => {
      return (await import('./' + path.join('enhancers', folder, `${folder}.js`))).default;
    })
  );
  enhancers = _.sortBy(enhancers, 'priority');

  console.log(`Loaded enhancers: ${enhancers.map(a => a.name).join(', ')}`);
}

async function getEnhancement(query, intent, geo, response, enhancer) {
  let enhancement = null;

  // Bail if there are no matches defined
  if (!enhancer.matches) {
    console.warn('No matches defined:', enhancer.name);
    return enhancement;
  }

  for (let i = 0; i < enhancer.matches.length && !enhancement; i++) {
    const match = enhancer.matches[i];

    if (match.query) {
      enhancement = await getQueryEnhancement(query, geo, response, match, enhancer);
    } else if (match.result) {
      enhancement = await getResultEnhancement(query, geo, response, match, enhancer);
    } else if (match.intent) {
      enhancement = await getIntentEnhancement(query, geo, response, intent, match, enhancer);
    } else {
      console.warn('Match type unsupported:', enhancer.name, match);
    }
  }

  return enhancement;
}

async function getQueryEnhancement(query, geo, response, match, enhancer) {
  const queryMatcher = match.query;
  let enhancement = null;

  if (queryMatcher.pattern && queryMatcher.onMatch) {
    const patternMatch = query.match(queryMatcher.pattern);

    if (patternMatch) {
      console.debug('Query Match:', enhancer.name, patternMatch);
      enhancement = await queryMatcher.onMatch({
        query,
        geo,
        results: response.results.filter(r => r.type === 'webPage'),
        location: geo.displayName,
        patternMatch
      });
    }
  }

  return enhancement;
}

async function getResultEnhancement(query, geo, response, match, enhancer) {
  const patternProps = ['urlPattern', 'namePattern', 'snippetPattern'];
  // Only consider webPages and not other inserted results
  const results = response.results.filter(r => r.type === 'webPage');
  const resultMatcher = match.result;
  const matchPatternProps = patternProps.filter(p => resultMatcher.hasOwnProperty(p));
  let enhancement = null;

  if (matchPatternProps.length && resultMatcher.onMatch) {
    const defaultMaxIndex = 9;
    // Get the max index but not more than the number of results
    const maxIndex = Math.min(resultMatcher.maxIndex || defaultMaxIndex, results.length - 1);
    // Stop loop after first match -- this might need to be more nuanced long term
    let didMatch = false;

    for (let i = 0; i <= maxIndex && !didMatch; i++) {
      const result = results[i];

      for (let j = 0; j < matchPatternProps.length; j++) {
        const patternProp = matchPatternProps[j];
        const prop = patternProp.replace('Pattern', '');
        const patternMatch = result[prop].match(resultMatcher[patternProp]);

        if (patternMatch) {
          console.debug('Result Match:', enhancer.name, patternProp, patternMatch);
          didMatch = true;

          enhancement = await resultMatcher.onMatch({
            query,
            geo,
            location: geo.displayName,
            results,
            result,
            index: i,
            patternMatch
          });
          break;
        }
      }
    }
  }

  return enhancement;
}

async function getIntentEnhancement(query, geo, response, intent, match, enhancer) {
  const intentMatcher = match.intent;
  let enhancement = null;

  if (intentMatcher.name === intent.intent && intentMatcher.onMatch) {
    console.debug('Intent Match:', enhancer.name, intent);
    enhancement = await intentMatcher.onMatch({
      query,
      geo,
      results: response.results.filter(r => r.type === 'webPage'),
      location: geo.displayName,
      intent
    });
  }

  return enhancement;
}

async function parseIntent(query) {
  if (!INTENT_MODEL_ENDPOINT) return;

  const params = new URLSearchParams();
  params.append('query', query);

  try {
    const response = await axios.post(INTENT_MODEL_ENDPOINT, params);
    const data = response.data;
    const words = query.split(/\s+/);
    const slots = {};

    // Map words to slot predictions
    data.slots_predictions.forEach((p, i) => {
      slots[p] = [...(slots[p] || []), words[i]];
    });

    return {
      intent: data.intent_predictions,
      probability: data[`intent_probabilities_${data.intent_predictions}`],
      slots
    };
  } catch (e) {
    captureException(e);
  }
}

const parseIntentCached = memoize(parseIntent, 24 * 60 * 60);

function hashEnhancementId(enhancement) {
  if (enhancement?.answer?.id) {
    enhancement.answer.id = sha1(enhancement.answer.id);
  }

  if (enhancement?.supplement?.id) {
    enhancement.supplement.id = sha1(enhancement.supplement.id);
  }

  if (enhancement?.result?.id) {
    enhancement.result.id = sha1(enhancement.result.id);
  }
}

export async function enhanceResponse(query, response, geo) {
  if (!response?.results?.length) return;

  response.answers = [];
  response.supplements = [];
  const resultsToInsert = [];
  const intent = await parseIntentCached(query);

  console.log('Intent:', intent);

  await Promise.all(
    enhancers.map(async enhancer => {
      let enhancement;

      try {
        enhancement = await getEnhancement(query, intent, geo, response, enhancer);
      } catch (e) {
        captureException(e);
      }

      // Make IDs uniform
      hashEnhancementId(enhancement);

      if (enhancement?.answer) {
        response.answers.push(enhancement.answer);
      }

      if (enhancement?.supplement) {
        response.supplements.push(enhancement.supplement);
      }

      if (enhancement?.result) {
        const result = enhancement.result;
        let insertIndex = result.insertIndex;
        let ignoreIsNavigational = result.ignoreIsNavigational;
        delete result.insertIndex;
        delete result.ignoreIsNavigational;

        // Always leave navigational results in the top position
        if (insertIndex === 0 && !ignoreIsNavigational && response.results[0]?.isNavigational) {
          insertIndex = 1;
        }

        response.results.splice(insertIndex, 0, result);
      }
    })
  );
}
