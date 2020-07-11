export default {
  name: 'Answer to everything',
  description: 'Gives you the answer to everything',
  match: {
    query: {
      pattern: /answer to everything/
    }
  },
  shouldMatchQueries: ['answer to everything'],
  shouldNotMatchQueries: ['answer to pie'],
  onQueryMatch: async () => {
    return {
      answer: {
        title: '42',
        subtitle: 'The answer to everything'
      }
    };
  }
};
