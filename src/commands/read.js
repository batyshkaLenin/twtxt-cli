const Promise = require('bluebird');
const axios = require('axios');
const { parseTimeline } = require('../utils');
const { getConfig } = require('../config');

/**
 * Get following users feed
 * @returns {Promise<void>}
 */
async function getFeed() {
  const config = getConfig();

  const { following } = config;

  const feed = (
    await Promise.map(following, async ({ nick, url }) => {
      const result = await axios.get(url);
      return parseTimeline(result.data).map((i) => ({ ...i, nick, url }));
    }, { concurrency: 5 })
  ).flatMap((i) => i);

  const sortedFeed = feed.sort((a, b) => b.date - a.date);
  console.log(sortedFeed.map((i) => `${i.nick}\t${i.url}\t${i.date.format()}\t${i.text}`).join('\n'));
}

module.exports = getFeed;
