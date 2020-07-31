import axios from 'axios';
import { isValidParams } from '../../../lib/utils';

export default async (req, res) => {
  const url = req.query.url;

  if (isValidParams(req.query)) {
    try {
      const response = await axios({
        url,
        method: 'get',
        responseType: 'stream'
      });

      res.on('pipe', src => {
        res.setHeader('Content-Type', src.headers['content-type']);
      });

      response.data.pipe(res);
    } catch (e) {
      res.statusCode = e.response?.status || 500;
      res.end(e.message);
    }
  } else {
    res.statusCode = 401;
    res.end('401 Unauthorized');
  }
};
