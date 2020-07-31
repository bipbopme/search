import axios from 'axios';
import cheerio from 'cheerio';
import { convertToNumber, urlJoin } from '../../../lib/utils';

export default async (req, res) => {
  const { origin } = new URL(req.query.url);

  const data = (await axios.get(origin)).data;
  const $ = cheerio.load(data);

  let iconUrl =
    $('link[rel="shortcut icon"]').first().attr('href') ||
    $('link[rel="icon"]').first().attr('href');

  if (iconUrl) {
    iconUrl = urlJoin(origin, iconUrl);
  } else {
    iconUrl = `${origin}/favicon.ico`;
  }

  try {
    const response = await axios({
      url: iconUrl,
      method: 'GET',
      responseType: 'stream'
    });

    response.data.pipe(res);
  } catch (e) {
    res.statusCode = convertToNumber(e.message) || 500;
    res.end(e.message);
  }
};
