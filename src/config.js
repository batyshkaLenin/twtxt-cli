const fs = require('fs');
const { getUserHome } = require('./utils');
const packageData = require('../package.json');
const { CONFIG_DEFAULTS } = require('./constants');

/**
 * @typedef FollowItem
 * @type {Record<string, unknown>}
 * @property {string} nick
 * @property {string} url
 */

/**
 * @typedef Config
 * @type {Record<string, unknown>}
 * @property {string} nick
 * @property {string} [url]
 * @property {string} [description]
 * @property {string} [avatar]
 * @property {string} location
 * @property {string} pre_hook
 * @property {string} post_hook
 * @property {FollowItem[]} following
 */

/**
 * Get configuration file path
 * @param {string} [customName]
 * @returns {string}
 */
function getConfigPath(customName) {
  const configFileName = 'twtxt-cli.json';
  const userHome = getUserHome();
  const configPath = `${userHome}/.config/${customName || configFileName}`;
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(`${userHome}/.config/`, { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify({}));
  }
  return configPath;
}

/**
 * Update config file
 * @param {Partial<Config>} config
 * @param {string} [customName]
 * @returns {Config}
 */
function updateConfig(config, customName) {
  try {
    const configPath = getConfigPath(customName);
    const newConfig = { ...CONFIG_DEFAULTS, ...config };
    fs.writeFileSync(configPath, JSON.stringify(newConfig));
    return newConfig;
  } catch (e) {
    throw Error('Error of read config');
  }
}

/**
 * Get actual config
 * @param {string} [customName]
 * @returns {Config}
 */
function getConfig(customName) {
  const configPath = getConfigPath(customName);
  try {
    const file = fs.readFileSync(configPath);
    return JSON.parse(file.toString());
  } catch (e) {
    throw Error('Error of read config');
  }
}

function headOfFeed() {
  const utilName = `${packageData.name}-${packageData.version}`;
  const config = getConfig();
  return `# Created with ${utilName}
#
# You can install the same client as this user with the command 'npm install -g twtxt-cli'.
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
${config.following
    .map(({ nick, url }) => `# follow = ${nick} ${url}`)
    .join('\n')}
#
\n`;
}

module.exports = {
  headOfFeed,
  updateConfig,
  getConfig,
  getConfigPath,
};
