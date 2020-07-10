import axios from 'axios';
import { memoize } from '../redis';
import cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';

function cleanText(text) {
  return text.replace(/\[\d+\]/g, '').trim();
}

function urlJoin(baseUrl, url) {
  return new URL(url, baseUrl).toString();
}

function extractTitle($) {
  return cleanText($('h1.firstHeading').first().text());
}

function extractSummary($) {
  let paragraphs = $('#mw-content-text .mw-parser-output p')
    .map((i, el) => $(el).text())
    .get();

  paragraphs = paragraphs.map(p => cleanText(p));
  paragraphs = paragraphs.filter(p => p.length > 0);

  return paragraphs[0];
}

function extractImages($, url) {
  return $('table.infobox a.image img')
    .map((i, img) => urlJoin(url, $(img).attr('src')))
    .get();
}

function extractInfoBox($, url) {
  let infoBox;

  if ($('table.infobox th[scope="row"]').length) {
    const $table = $('<table></table>');

    // infobox: add rows that have a th with row scope
    $('table.infobox tr').each((i, tr) => {
      if ($(tr).find('th[scope="row"]').length) {
        $table.append(tr);
      }
    });

    // infobox: fixup links
    $table.find('a').each((i, a) => {
      const $a = $(a);
      $a.attr('href', urlJoin(url, $a.attr('href')));
    });

    // infobox: remove hidden spans
    $table.find('span[style="display:none"]').remove();

    // infobox: sanitize html
    infoBox = sanitizeHtml($table.toString(), {
      allowedTags: ['a', 'table', 'tr', 'th', 'td', 'ul', 'li', 'div', 'span', 'abbr'],
      allowedAttributes: {
        a: ['href'],
        abbr: ['title']
      }
    });
  }

  return infoBox;
}

const getDetails = memoize(async url => {
  const $ = cheerio.load((await axios.get(url)).data);

  return {
    title: extractTitle($),
    summary: extractSummary($),
    images: extractImages($, url),
    infoBox: extractInfoBox($, url)
  };
}, 'wikipediaDetails-v1');

export default {
  name: 'Wikipedia (Supplement)',
  description: 'Adds Wikipedia supplement',
  match: {
    result: {
      pattern: /wikipedia.org\/wiki/,
      maxIndex: 9
    }
  },
  shouldMatchQueries: ['brad pitt', 'apple'],
  shouldNotMatchQueries: [''],
  priority: 0,
  onResultMatch: async (result, index, match) => {
    const details = await getDetails(result.url);

    return {
      supplement: {
        component: 'wikipedia',
        url: result.url,
        ...details
      }
    };
  }
};
