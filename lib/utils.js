import crypto from 'crypto';

export function sha1(object) {
  return crypto.createHash('sha1').update(object.toString()).digest('hex');
}
