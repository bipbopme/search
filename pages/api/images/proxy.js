import axios from 'axios';
import { convertToNumber, isValidParams } from '../../../lib/utils';

export default async (req, res) => {
  const url = req.query.url;

  if (isValidParams(req.query)) {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      });

      response.data.pipe(res);
    } catch (e) {
      res.statusCode = convertToNumber(e.message) || 500;
      res.end(e.message);
    }
  } else {
    res.statusCode = 401;
    res.end('401 Unauthorized');
  }
};
