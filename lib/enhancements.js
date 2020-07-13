import fs from 'fs';
import path from 'path';
import _ from 'lodash';

// Load enhancers into memory
let enhancers = [];
loadEnhancers();

export async function enhanceResponse(query, response) {
  const answers = [];
  const supplements = [];
  const resultsToInsert = [];

  await Promise.all(
    enhancers.map(async enhancer => {
      const enhancement = await getEnhancement(query, response, enhancer);

      if (enhancement?.answer) {
        answers.push(enhancement.answer);
      }

      if (enhancement?.supplement) {
        supplements.push(enhancement.supplement);
      }

      if (enhancement?.result) {
        resultsToInsert.push(enhancement.result);
      }
    })
  );

  // Add enhancements to response
  response.answers = answers;
  response.supplements = supplements;
  resultsToInsert.forEach(r => {
    const insertIndex = r.insertIndex;
    delete r.insertIndex;

    response.results.splice(insertIndex, 0, r);
  });
}

async function getEnhancement(query, response, enhancer) {
  let enhancement = null;

  // Bail if there are no matches defined
  if (!enhancer.matches) {
    console.warn('No matches defined:', enhancer.name);
    return enhancement;
  }

  for (let i = 0; i < enhancer.matches.length && !enhancement; i++) {
    const match = enhancer.matches[i];

    if (match.query) {
      enhancement = await getQueryEnhancement(query, match, enhancer);
    } else if (match.result) {
      enhancement = await getResultEnhancement(query, match, enhancer, response);
    } else {
      console.warn('Match type unsupported:', enhancer.name, match);
    }
  }

  return enhancement;
}

async function getQueryEnhancement(query, match, enhancer) {
  const queryMatcher = match.query;
  let enhancement = null;

  if (queryMatcher.pattern && queryMatcher.onMatch) {
    const patternMatch = query.match(queryMatcher.pattern);

    if (patternMatch) {
      console.debug('Query Match:', enhancer.name, patternMatch);
      enhancement = await queryMatcher.onMatch({ query, patternMatch });
    }
  }

  return enhancement;
}

async function getResultEnhancement(query, match, enhancer, response) {
  const patternProps = ['urlPattern', 'titlePattern', 'snippetPattern'];
  const results = response.results;
  const resultMatcher = match.result;
  const matchPatternProps = patternProps.filter(p => resultMatcher.hasOwnProperty(p));
  let enhancement = null;

  if (matchPatternProps.length && resultMatcher.onMatch) {
    const maxIndex = resultMatcher.maxIndex || 9;

    for (let i = 0; i <= maxIndex && !enhancement; i++) {
      const result = results[i];

      for (let j = 0; j < matchPatternProps.length; j++) {
        const patternProp = matchPatternProps[j];
        const patternMatch = result.url.match(resultMatcher[patternProp]);

        if (patternMatch) {
          console.debug('Result Match:', enhancer.name, patternProp, patternMatch);

          enhancement = await resultMatcher.onMatch({
            query,
            result,
            index: i,
            patternMatch,
            results
          });
          break;
        }
      }
    }
  }

  return enhancement;
}

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
