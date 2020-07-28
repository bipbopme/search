import images from '../../images';
import { getInsertIndex } from '../../utils';

async function handleMatch({ query, index, geo }) {
  const response = await images.search({ mkt: geo.market, q: query });

  return {
    result: {
      id: `images-${query}`,
      insertIndex: getInsertIndex(index),
      type: 'images',
      query,
      results: response.results.slice(0, 12)
    }
  };
}

async function handleReactionMatch({ query, geo, patternMatch }) {
  const enhancement = await handleMatch({ query: query + ' gif', geo });

  enhancement.result.title = `GIFs for ${patternMatch[1]}`;

  return enhancement;
}

// TODO: It might be better to let this enhancer handle image supplements.
//       Wikipedia is handling right now because it checks for a jpg image to
//       decide if it should do an image search.
async function handleResultMatch({ query, index, geo, results }) {
  // Don't automatically show images if there's a wikipedia result in the top 6 results
  if (!results.slice(0, 6).find(r => r.url.match(/wikipedia.org\/wiki/))) {
    return handleMatch({ query, index, geo });
  }
}

export default {
  name: 'Images (Result)',
  description: 'Inline image and gif results.',
  matches: [
    {
      query: {
        pattern: /\b(images?|pictures?|photos?|jpe?g|gif|pics?)\b/i,
        onMatch: handleMatch
      }
    },
    {
      query: {
        pattern: /^(scared|whatever|good luck|thank you|excited|thumbs ?up|hello|dislike|nope|omg|bye|amused|fun|dancing|mind blown|facepalm|shocked|high ?five|flirt|flirting|mad|angry|shrug|yes|good job|yep|yup|yip|what|laugh|laughing|hot|that's hot|no|love|yuck|sad|happy|waiting|bored|thanks|tired|sleep|sleeping|shame|money|get money|dance|want|do want|popcorn|eye ?roll|congratulations|congrats|confused|yay|wtf|k|hug|you'?re welcome|your welcome|sorry|wow|woah|whoa|party|applause|clap|shake head|like|celebration|crying|smh|disappointed|ok|okay|bored|smile|why|lol|rofl|hi|memes)$/i,
        onMatch: handleReactionMatch
      }
    },
    {
      result: {
        // Ignore instagram matches
        namePattern: /(?<!Instagram.*?)\b(images?|pictures?|photos?)\b/i,
        onMatch: handleResultMatch
      }
    }
  ],
  shouldMatchQueries: ['pictures of dogs'],
  shouldNotMatchQueries: ['']
};
