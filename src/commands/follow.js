const { getConfig, updateConfig } = require('../config');
const { LINK_REGEXP } = require('../constants');

/**
 * Follow user feed
 * @param {string} nick
 * @param {string} url
 * @returns {void}
 */
function follow(nick, url) {
  if (!LINK_REGEXP.test(url)) {
    throw Error('URL validation failed');
  }

  const config = getConfig();

  const current = config.following.find((item) => item.url === url);

  if (current) {
    console.log(`You are already following to ${current.nick}`);
  } else {
    const { following } = config;
    following.push({ nick, url });
    updateConfig({ ...config, following });
  }
}

module.exports = follow;
