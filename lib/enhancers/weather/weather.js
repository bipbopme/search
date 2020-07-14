async function handleIntentMatch({ intent }) {
  const where = intent.slots['B-Place']?.join(' ') || 'your current location';
  const when = intent.slots['B-When']?.join(' ') || 'today';

  return {
    answer: {
      title: 'Weather Intent',
      subtitle: `you want the weather forecast for ${when} in ${where}?`
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
