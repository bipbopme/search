import { search } from '../../lib/search';

export default async (req, res) => {
  res.json(await search(req.query));
};
