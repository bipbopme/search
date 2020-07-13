// Inverse of allowed characters
const NOT_ALLOWED_REGEX = /[^\+\-\*\/\%\d\s\.\(\)]/g;

// List of operators and their terms
const operators = {
  '+': ['\\+', 'plus', 'add'],
  '-': ['\\-', 'minus', 'subtract', 'take away'],
  '*': ['\\*', 'times', 'multiply', 'multiplied by', 'x'],
  '/': ['\\/', 'divide', 'divided by'],
  '%': ['\\%', 'mod', 'modulo'],
  '**': ['\\*\\*', '\\^'],
  '** 2': ['squared'],
  '** 3': ['cubed']
};

// Transform operators map into regexes
const operatorRegexes = {};
Object.keys(operators).forEach(
  op => (operatorRegexes[op] = new RegExp(operators[op].join('|'), 'gi'))
);

// Transform all operator patterns into query pattern
const ALL_OPERATOR_PATTERNS = Object.keys(operators)
  .map(op => operators[op].join('|'))
  .join('|');

function parse(query) {
  let expression = query;

  // Translate words and symbols to allowed operators
  Object.keys(operators).forEach(op => {
    expression = expression.replace(operatorRegexes[op], ` ${op} `);
  });

  // Remove all characters that aren't allowed
  expression = expression.replace(NOT_ALLOWED_REGEX, '');

  // Remove extra spaces
  expression = expression.replace(/\s+/g, ' ').trim();

  return expression;
}

async function handleQueryMatch({ query }) {
  let expression = parse(query);
  let result = null;

  try {
    result = eval(expression);
  } catch {
    console.warn('calculator failed', expression);
  }

  console.log('calculator', { expression, query, result });

  if (result !== null && !isNaN(result)) {
    return {
      answer: {
        title: result.toLocaleString(),
        subtitle: `${expression} = ${result}`,
        source: 'Calculator',
        sourceIconUrl: '/images/icons/calculator-line.svg'
      }
    };
  }
}

export default {
  name: 'Calculator (Answer)',
  description: 'Calculates numbers.',
  matches: [
    {
      query: {
        pattern: new RegExp(`\\d+(.*?)\\s(${ALL_OPERATOR_PATTERNS})`, 'i'),
        onMatch: handleQueryMatch
      }
    }
  ],
  shouldMatchQueries: [
    '10 + 10',
    '10 plus 10',
    '10 - 10',
    '10 minus 10',
    '10 * 10',
    '10 times 10',
    '10 divided by 10',
    '10 mod 5'
  ],
  shouldNotMatchQueries: [''],
  priority: 0
};
