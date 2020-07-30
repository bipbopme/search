import axios from 'axios';
import { getInsertIndex } from '../../utils';
import { memoize } from '../../redis';

async function searchArticles(q) {
  return (
    await axios.get('https://news.svcs.bipbop.me/api/articles/search', {
      params: {
        q
      }
    })
  ).data;
}

const searchArticlesCached = memoize(searchArticles, 15 * 60);

async function getTopArticles(q) {
  return (
    await axios.get('https://news.svcs.bipbop.me/api/articles/top', {
      params: {
        sourceIds: 'ap-news'
      }
    })
  ).data;
}

const getTopArticlesCached = memoize(getTopArticles, 15 * 60);

function cleanQuery(query) {
  return query.replace(/news/i, '');
}

function isEnabled(geo) {
  return ['en-US', 'en-CA'].includes(geo.market);
}

async function handleMatch({ query, index, geo }) {
  if (!isEnabled(geo)) return;

  const articles = await searchArticlesCached(cleanQuery(query));

  if (articles.length >= 3) {
    return {
      result: {
        id: `news-${query}`,
        insertIndex: getInsertIndex(index, { maxIndex: 1 }),
        type: 'news',
        articles: articles.slice(0, 3)
      }
    };
  }
}

async function handleTopMatch({ query, geo }) {
  if (!isEnabled(geo)) return;

  const articles = await getTopArticlesCached();

  if (articles.length >= 3) {
    return {
      result: {
        id: `news-${query}`,
        insertIndex: 0,
        type: 'news',
        articles: articles.slice(0, 3)
      }
    };
  }
}

export default {
  name: 'News (Result)',
  description: 'Recent news stories.',
  matches: [
    {
      query: {
        pattern: /^(news|news today|top news|latest news|top stories)$/i,
        onMatch: handleTopMatch
      }
    },
    {
      query: {
        pattern: /\bnews\b/i,
        onMatch: handleMatch
      }
    },
    {
      result: {
        urlPattern: /(\d{4}.\d{1,2}.\d{1,2})|story|article|news/i,
        maxIndex: 9,
        onMatch: handleMatch
      }
    }
  ]
};
