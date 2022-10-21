const { getConfig, updateConfig } = require("../config");

/**
 * Follow user feed
 * @param {string} nick
 * @param {string} url
 * @returns {void}
 */
function follow(nick, url) {
  const config = getConfig();

  const current = config.following.find(item => item.url === url);

  if (current) {
    console.log(`You are already following to ${current.nick}`)
  } else {
    const following = config.following;
    following.push({ nick, url });
    updateConfig({ ...config, following });
  }
}

module.exports = follow;
