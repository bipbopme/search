import _ from 'lodash';
import { promisify } from 'util';
import redis from 'redis';
import { sha1 } from './utils';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const existsAsync = promisify(client.exists).bind(client);

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

export function memoize(func) {
  const memoized = async function (...args) {
    const key = getCacheKey(func, args);
    let result = await get(key);

    if (result) {
      console.log('cache hit');
    } else {
      console.log('cache miss');

      result = await func.apply(this, args);

      set(key, result);
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
