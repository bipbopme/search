import images from '../../images';

async function handleMatch({ query }) {
  const response = await images.search({ q: query });

  return {
    result: {
      id: `images-${query}`,
      insertIndex: 0,
      type: 'images',
      query,
      response
    }
  };
}

async function handleReactionMatch({ query }) {
  return handleMatch({ query: query + ' gif' });
}

export default {
  name: 'Images (Result)',
  description: 'Inline image and gif results.',
  matches: [
    {
      query: {
        pattern: /\b(images?|pictures?|photos?|jpe?g|gif)\b/i,
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
        onMatch: handleMatch
      }
    }
  ],
  shouldMatchQueries: ['pictures of dogs'],
  shouldNotMatchQueries: ['']
};
