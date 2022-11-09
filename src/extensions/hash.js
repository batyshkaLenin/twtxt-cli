const blake2 = require('blake2');
const { DateTime } = require('luxon');

function base32(payload) {
  const data = Buffer.from(payload);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < view.byteLength; i++) {
    value = (value << 8) | view.getUint8(i)
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

function blake2b256(payload) {
  return blake2.createHash('blake2b', { digestLength: 32 })
    .update(Buffer.from(payload))
    .digest();
}

function formatRFC3339(text) {
  return DateTime.fromISO(text, { setZone: true, zone: 'utc' })
    .toFormat("yyyy-MM-dd'T'HH:mm:ssZZ")
    .replace(/\+00:00$/, 'Z');
}

/**
 * Create twtxt hash
 * @param {string} url
 * @param {string} date
 * @param {string} text
 * @returns {string}
 */
function createHash(url, date, text) {
  const created = formatRFC3339(date);
  const payload = [url, created, text].join('\n');
  return base32(blake2b256(payload))
    .toLowerCase()
    .slice(-7);
}

module.exports = {
  createHash,
};
