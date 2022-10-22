const moment = require('moment');
const fs = require('fs');
const { getConfig, headOfFeed } = require('../config');
const { parseTimeline } = require('../utils');

/**
 * Get user twt feed
 * @returns {TimeLine[]}
 */
function getCurrentTimeline() {
  const config = getConfig();
  const currentTimelineText = fs.readFileSync(config.location).toString();
  return parseTimeline(currentTimelineText);
}

/**
 * Publish new twt
 * @param {string} message
 * @returns {void}
 */
function publish(message) {
  const MAX_CHARS = 140;

  if (!message) throw Error('Empty message');

  if (message.length > MAX_CHARS) throw Error('Too long message');

  const config = getConfig();

  const timeline = getCurrentTimeline();

  timeline.push({
    text: message.join(' '),
    date: moment(),
  });

  const newTimeline = timeline
    .sort((a, b) => b.date - a.date)
    .map(({ date, text }, index) => `${date.format()}\t${text}${timeline.length - 1 !== index ? '\n' : ''}`)
    .join('');

  const meta = headOfFeed();

  fs.writeFileSync(config.location, Buffer.from(`${meta}${newTimeline}`));
}

module.exports = publish;
