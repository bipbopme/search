import crypto from 'crypto';

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
