import _ from 'lodash';
import { promisify } from 'util';
import redis from 'redis';
import { sha1 } from './utils';

const DEFAULT_EXPIRES_IN_SECONDS = 14 * 24 * 60 * 60;

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const expireAsync = promisify(client.expire).bind(client);

export async function get(key) {
  let result = await getAsync(key);

  return result ? JSON.parse(result) : result;
}

export async function set(key, value) {
  return setAsync(key, JSON.stringify(value));
}

function getCacheKey(func, args) {
  return func.name + '-' + sha1(String(func) + JSON.stringify(args));
}

export function memoize(func, expiresInSeconds = DEFAULT_EXPIRES_IN_SECONDS) {
  const memoized = async function (...args) {
    const key = getCacheKey(func, args);
    let result = expiresInSeconds > 0 ? await get(key) : null;

    if (result) {
      console.log(func.name, 'cache hit');
    } else {
      console.log(func.name, 'cache miss');

      result = await func.apply(this, args);

      if (expiresInSeconds > 0) {
        await set(key, result);
        await expireAsync(key, expiresInSeconds);
      }
    }

    return result;
  };

  return memoized;
}

export async function isCached(func, ...args) {
  const key = getCacheKey(func, args);

  return (await existsAsync(key)) == 1;
}

export default { get, set, memoize };
