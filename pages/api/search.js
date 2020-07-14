import { search } from '../../lib/search';
import { getGeo } from '../../lib/geo';
import omit from 'lodash/omit';

export default async (req, res) => {
  const params = omit(req.query, ['location']);
  const location = req.query.location;
  const ip = process.env.GEOIP_OVERRIDE || req.headers['x-real-ip'];
  const geo = getGeo(ip);

  res.json(await search({ mkt: geo.market, ...params }, location || geo.displayName));
};
