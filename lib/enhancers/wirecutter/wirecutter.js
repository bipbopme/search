import axios from 'axios';
import { memoize } from '../../redis';
import cheerio from 'cheerio';

async function getWirecutterDetails(url) {
  const $ = cheerio.load((await axios.get(url)).data);
  const details = {
    recommendations: []
  };

  details.title = $('h1[data-scp="title"]').first().text();

  $('#everything-we-recommend')
    .next()
    .find('> div')
    .each((i, div) => {
      const $div = $(div);
      const buyingOptions = [];

      // Extract buying options
      $div.find('div[data-scp="callout_sources"] > div a').each((i, a) => {
        const $a = $(a);

        buyingOptions.push({
          description: $a.text(),
          url: $a.attr('href')
        });
      });

      details.recommendations.push({
        label: $div.find('h4[data-scp="callout_label"]').first().text(),
        imageUrl: $div.find('img[itemprop="image"]').first().data('src'),
        title: $div.find('a[data-scp="callout_product"]').first().text(),
        url: $div.find('a[data-scp="callout_product"]').first().attr('href'),
        summary: $div.find('a[data-scp="callout_title"]').first().text(),
        description: $div.find('p[data-scp="callout_description"]').first().text(),
        buyingOptions
      });
    });

  return details;
}

const getWirecutterDetailsCached = memoize(getWirecutterDetails);

async function handleResultMatch({ result, geo }) {
  const details = await getWirecutterDetailsCached(result.url);

  if (details.recommendations.length) {
    return {
      result: {
        id: `wirecutter-${result.url}`,
        insertIndex: 0,
        type: 'wirecutter',
        sourceUrl: result.url,
        source: 'Wirecutter',
        sourceIconUrl: 'https://siren-production.freetls.fastly.net/static/img/favicon-32x32.png',
        ...details
      }
    };
  }
}

export default {
  name: 'Wirecutter (Result)',
  description: 'Features Wirecutter recommendations.',
  matches: [
    {
      result: {
        urlPattern: /nytimes.com\/wirecutter\/reviews/,
        maxIndex: 19,
        onMatch: handleResultMatch
      }
    }
  ]
};
