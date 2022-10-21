const moment = require("moment");
const packageData = require("../../package.json");
const fs = require("fs");
const { getConfig } = require("../config");
const { parseTimeline } = require('../utils');

function getCurrentTimeline() {
  const config = getConfig();
  const currentTimelineText = fs.readFileSync(config.location).toString();
  return parseTimeline(currentTimelineText)
}

function publish(text) {
  const MAX_CHARS = 140;

  if (!text) throw Error('Empty message')

  if (text.length > MAX_CHARS) throw Error('Too long message')

  const config = getConfig();

  const timeline = getCurrentTimeline();
  timeline.push({
    text,
    date: moment(),
  });

  const newTimeline = timeline
    .sort((a, b) => b.date - a.date)
    .map(({ date, text }, index) => `${date.format()}\t${text}${timeline.length - 1 !== index ? '\n' : ''}`)
    .join('');

  const utilName = `${packageData.name}-${packageData.version}`;
  const meta = `# Created with ${utilName}
#
# Learn more about twtxt-cli https://github.com/batyshkaLenin/twtxt-cli
#
# nick        = ${config.nick}
# url         = ${config.url}
# avatar      = ${config.avatar || ''}
# description = ${config.description || `${utilName} enjoyer`}
#
# following   = ${config.following.length}
#
#
${config.following.map(({ nick, url }) => `# follow = ${nick} ${url}`).join('\n')}
#
\n`
  fs.writeFileSync(config.location, Buffer.from(`${meta}${newTimeline}`));
}

module.exports = publish;
