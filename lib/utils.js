import crypto from 'crypto';
import toNumber from 'lodash/toNumber';

export function getBaseUrl(req) {
  let baseUrl;

  if (req) {
    const host = req.headers.host;

    if (host.match(/:3000/)) {
      baseUrl = `http://${host}`;
    } else {
      baseUrl = `https://${host}`;
    }
  } else {
    baseUrl = '';
  }

  return baseUrl;
}

export function sha1(object) {
  return crypto.createHash('sha1').update(object.toString()).digest('hex');
}

export function urlJoin(baseUrl, url) {
  return new URL(url, baseUrl).toString();
}

export function convertToNumber(input = '') {
  return toNumber(input.toString().replace(/[^\d\.]/g, ''));
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatNumber(number, maximumFractionDigits = 0) {
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits
  });
}

export function getInsertIndex(
  resultIndex = 0,
  opts = { improveRankBy: 2, minIndex: 0, maxIndex: 4 }
) {
  let insertIndex = resultIndex - opts.improveRankBy;

  if (insertIndex < opts.minIndex) {
    insertIndex = opts.minIndex;
  }

  if (insertIndex > opts.maxIndex) {
    insertIndex = opts.maxIndex;
  }

  return insertIndex;
}
