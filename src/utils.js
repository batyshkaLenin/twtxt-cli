const childProcess = require("child_process");
const moment = require("moment");

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

module.exports = {
  hook,
  parseTimeline,
  getUserHome,
  getUserName,
};
