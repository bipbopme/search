async function handleResultMatch({ result }) {
  // only extract a complete sentence
  const match = result.snippet.match(/^(.*?) definition is - ([^\.]+\.)/);

  if (match) {
    return {
      answer: {
        id: `dictionary-${match[1]}`,
        title: match[1]?.toLowerCase(),
        subtitle: `1. ${match[2]}`,
        source: 'Merriam-Webster',
        sourceUrl: result.url,
        sourceIconUrl: 'https://www.merriam-webster.com/favicon.ico'
      }
    };
  }
}

export default {
  name: 'Dictionary (Answer)',
  description: 'Extracts definition from search results.',
  matches: [
    {
      result: {
        urlPattern: /merriam-webster.com\/dictionary/,
        maxIndex: 3,
        onMatch: handleResultMatch
      }
    }
  ],
  shouldMatchQueries: ['define happy', 'definition of happy'],
  shouldNotMatchQueries: ['']
};
