import crypto from 'crypto';

const salt = $config().security.secret;

function md5(str) {
  return crypto
    .createHash('md5')
    .update(`${salt}${str.toString()}`)
    .digest('hex');
}

function sha1(str) {
  return crypto
    .createHash('sha1')
    .update(`${salt}${str.toString()}`)
    .digest('hex');
}

export default {
  md5: md5,
  sha1: sha1
};
