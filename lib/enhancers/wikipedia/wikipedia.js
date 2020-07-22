import axios from 'axios';
import { memoize } from '../../redis';
import cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { urlJoin } from '../../utils';
import images from '../../images';

function cleanText(text) {
  return text.replace(/\[[^\]]+\]/g, '').trim();
}

function extractTitle($) {
  return cleanText($('h1.firstHeading').first().text());
}

function extractSummary($) {
  let paragraphs = $('#mw-content-text .mw-parser-output > p')
    .map((i, el) => $(el).text())
    .get();

  paragraphs = paragraphs.map(p => cleanText(p));
  // Make sure this paragraph has at least 20 words.
  paragraphs = paragraphs.filter(p => p.length && p.split(' ').length > 20);

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
    $('table.infobox tr:not(:first-child)').each((i, tr) => {
      const $tr = $(tr);

      // Make sure it has a header and no tables
      if ($tr.find('th').length && $tr.find('table').length === 0) {
        // Add an empty td instead of colspan
        if ($tr.find('th[colspan="2"]')) {
          $tr.append('<td></td>');
        }

        $table.append(tr);
      }
    });

    // infobox: fixup links
    $table.find('a').each((i, a) => {
      const $a = $(a);
      const href = $a.attr('href');
      const match = href.match(/\/wiki\/([^\/]+)$/);

      // Turns links into searches if they match the basic wikipedia entry form
      if (match) {
        $a.attr('href', `/search?q=${encodeURIComponent(match[1].replace(/_/g, ' '))}`);
      } else {
        $a.attr('href', urlJoin(url, $a.attr('href')));
      }
    });

    // infobox: remove hidden spans
    $table.find('span[style="display:none"]').remove();

    // infobox: sanitize html
    const sanitizedHtml = sanitizeHtml($table.html(), {
      allowedTags: ['a', 'tr', 'th', 'td', 'ul', 'li', 'span', 'abbr', 'br'],
      allowedAttributes: {
        a: ['href'],
        abbr: ['title'],
        tr: ['class'],
        th: ['class']
      }
    });

    infoBox = cleanText(`<table>${sanitizedHtml}</table>`);
  }

  return infoBox;
}

function getInfoBoxPreview($, infoBox) {
  if (!infoBox) return;
  const infoBoxPreview = $(infoBox);

  // Just keep the first 3 elements
  infoBoxPreview.find('tr:nth-child(n+4)').remove();

  return `<table>${infoBoxPreview.html()}</table>`;
}

async function getWikipediaDetails(url) {
  const $ = cheerio.load((await axios.get(url)).data);

  const title = extractTitle($);
  const summary = extractSummary($);
  const images = extractImages($, url);
  const infoBox = extractInfoBox($, url);
  const infoBoxPreview = getInfoBoxPreview($, infoBox);

  return {
    title,
    summary,
    images,
    infoBox,
    infoBoxPreview
  };
}

const getWikipediaDetailsCached = memoize(getWikipediaDetails);

function getTitleFromUrl(url) {
  let title;
  const match = url.match(/\/wiki\/([^\/]+)$/);

  if (match) {
    title = match[1].replace(/_/g, ' ');
  }

  return title;
}

async function getRelatedImages(q, geo) {
  const response = await images.search({ q, mkt: geo.market });

  return response.results;
}

async function handleResultMatch({ result, geo }) {
  let details, relatedImages;

  // Simultaneous fetch images because it's slow
  await Promise.all([
    (async () => (details = await getWikipediaDetailsCached(result.url)))(),
    (async () => (relatedImages = await getRelatedImages(getTitleFromUrl(result.url), geo)))()
  ]);

  // Only include related images if the Wikipedia article had an attached jpeg
  const includeRelatedImages = !!details.images?.[0]?.match(/\.jpe?g$/i);

  if (details.summary) {
    return {
      supplement: {
        id: `wikipedia-${result.url}`,
        type: 'wikipedia',
        url: result.url,
        source: 'Wikipedia',
        sourceIconUrl: 'https://en.wikipedia.org/favicon.ico',
        ...details,
        relatedImages: includeRelatedImages ? relatedImages : null
      }
    };
  }
}

export default {
  name: 'Wikipedia (Supplement)',
  description: 'Adds Wikipedia supplement',
  matches: [
    {
      result: {
        urlPattern: /wikipedia.org\/wiki/,
        maxIndex: 5,
        onMatch: handleResultMatch
      }
    }
  ],
  shouldMatchQueries: ['brad pitt', 'apple'],
  shouldNotMatchQueries: [''],
  priority: 10
};
