const { getConfig, updateConfig } = require('../config');

/**
 * Unfollow user feed
 * @param {string} nickOrUrl
 * @returns {void}
 */
function unfollow(nickOrUrl) {
  const config = getConfig();

  const newFollowingList = config.following.filter((item) => item.url !== nickOrUrl || item.nick !== nickOrUrl);

  if (config.following.length === newFollowingList.length) {
    console.log(`You were not subscribed to a user's feed ${nickOrUrl}
Your blog subscription list will be updated after your next twt.`);
  } else {
    updateConfig({ ...config, following: newFollowingList });
  }
}

module.exports = unfollow;
