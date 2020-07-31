import axios from 'axios';
import cheerio from 'cheerio';
import { urlJoin } from '../../../lib/utils';

export default async (req, res) => {
  const url = req.query.url;
  const { origin } = new URL(req.query.url);

  let iconUrl;

  try {
    const data = (await axios.get(url, { timeout: 10 * 1000 })).data;
    const $ = cheerio.load(data);

    iconUrl =
      $('link[rel="shortcut icon"]').first().attr('href') ||
      $('link[rel="icon"]').first().attr('href');

    if (iconUrl) {
      iconUrl = urlJoin(url, iconUrl);
    }
  } catch (e) {
    console.warn('Error fetching favicon HTML', e.message);
  }

  if (!iconUrl) {
    iconUrl = `${origin}/favicon.ico`;
  }

  try {
    const response = await axios({
      url: iconUrl,
      method: 'get',
      responseType: 'stream',
      timeout: 10 * 1000
    });

    res.on('pipe', src => {
      res.setHeader('Content-Type', src.headers['content-type']);
    });

    response.data.pipe(res);
  } catch (e) {
    res.statusCode = e.response?.status || 500;
    res.end(e.message);
  }
};
