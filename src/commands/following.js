const axios = require('axios');
const Promise = require('bluebird');
const { getConfig } = require('../config');
const { LINK_REGEXP } = require('../constants');

async function getBackFollowing(url, readableUser) {
  try {
    const result = await axios.get(readableUser);
    const followingList = result.data
      .split('\n')
      .filter((i) => i.includes('follow') && i.includes('http'))
      .flatMap((i) => i.match(LINK_REGEXP));
    return followingList.includes(url);
  } catch (_) {
    return false;
  }
}

async function following({ backfollow }) {
  const config = getConfig();
  if (backfollow && config.url) {
    await Promise.map(config.following, async (user) => {
      const backFollowing = await getBackFollowing(config.url, user.url);
      console.log(`${user.nick}\t${user.url}${backFollowing ? ' (followed you)' : ''}\n`);
    });
  } else {
    console.log(config.following.map((user) => `${user.nick}\t${user.url}`).join('\n'));
  }
}

module.exports = following;
