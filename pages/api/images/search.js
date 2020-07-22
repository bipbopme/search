import { search } from '../../../lib/images';
import { getGeo } from '../../../lib/geo';

export default async (req, res) => {
  const params = req.query;
  const ip = process.env.GEOIP_OVERRIDE || req.headers['x-real-ip'];
  const geo = getGeo(ip);

  res.json(await search({ mkt: geo.market, ...params }, geo));
};
