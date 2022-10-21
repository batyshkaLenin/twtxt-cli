const childProcess = require("child_process");
const moment = require("moment");
const axios = require("axios");
const packageData = require('../package.json');

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
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 * @typedef TimeLine
 * @type {Record<string, unknown>}
 * @property {moment.Moment} date
 * @property {string} text
 */

/**
 *
 * @param {string} txt
 * @returns {TimeLine[]}
 */
function parseTimeline(txt) {
  const splittedTimeline = txt.split('\n').filter(str => str[0] !== '#');
  const timeline = splittedTimeline.map(i => i.split('\t')).filter(i => i.length === 2);
  return timeline.map(i => ({ text: i[1], date: moment(i[0]) }))
}

/**
 * Execute anything script
 * @param {string} command
 * @returns {void}
 */
function hook(command) {
  childProcess.exec(command, function (error, stdout) {
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
    const data = result.data
    const latest = data && data['dist-tags'] && data['dist-tags'].latest;
    const current = packageData.version;
    if (current !== latest) {
      console.log(`You version (${current}) is outdated. Install actual version: ${latest} with command 'npm install -g twtxt-cli'`)
    }
  } catch {
  }
}

module.exports = {
  hook,
  checkUpdates,
  parseTimeline,
  getUserHome,
  getUserName,
};
