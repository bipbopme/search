async function handleIntentMatch({ intent }) {
  return {
    answer: {
      title: 'Weather Intent',
      subtitle: `it looks like you want the forecast for ${intent.slots['B-Place'].join(' ')}`
    }
  };
}

export default {
  name: 'Weather (Answer)',
  description: 'Weather forecasts.',
  matches: [
    {
      intent: {
        name: 'weather',
        onMatch: handleIntentMatch
      }
    }
  ],
  shouldMatchQueries: ['weather in san francisco'],
  shouldNotMatchQueries: [''],
  priority: 0
};
