const childProcess = require('child_process');
const moment = require('moment');
const axios = require('axios');
const packageData = require('../package.json');
const { createHash } = require('./extensions/hash');

/**
 * Get current system username
 * @returns {string}
 */
function getUserName() {
  return process.env.USER;
}

/**
 * Get current user home directory
 * @returns {string}
 */
function getUserHome() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}

/**
 * @typedef TimeLine
 * @type {Record<string, unknown>}
 * @property {moment.Moment} date
 * @property {string} text
 * @property {string} hash
 */

/**
 *
 * @param {string} txt
 * @param {string} [url]
 * @returns {TimeLine[]}
 */
function parseTimeline(txt, url) {
  const splittedTimeline = txt.split('\n').filter((str) => str[0] !== '#');
  const timeline = splittedTimeline.map((i) => i.split('\t')).filter((i) => i.length === 2);
  return timeline.map(([date, text]) => {
    /** @type {Partial<TimeLine>} */
    const result = { text, date: moment(date) };
    if (url) {
      result.hash = createHash(url, date, text);
    }
    return result;
  });
}

/**
 * Execute anything script
 * @param {string} command
 * @returns {void}
 */
function hook(command) {
  childProcess.exec(command, (error, stdout) => {
    if (error) {
      console.error(error.stack);
      console.error(`Error code: ${error.code}`);
      console.error(`Signal received: ${error.signal}`);
    }
    console.log(stdout);
  });
}

/**
 * Check actual version of package
 * @returns {Promise<void>}
 */
async function checkUpdates() {
  try {
    const result = await axios.get('https://registry.npmjs.org/twtxt-cli');
    const { data } = result;
    const latest = data && data['dist-tags'] && data['dist-tags'].latest;
    const current = packageData.version;
    if (current !== latest) {
      console.log(`You version (${current}) is outdated. Install actual version: ${latest} with command 'npm install -g twtxt-cli'`);
    }
  } catch (_) {
    console.log('Check updates failed');
  }
}

module.exports = {
  hook,
  checkUpdates,
  parseTimeline,
  getUserHome,
  getUserName,
};
