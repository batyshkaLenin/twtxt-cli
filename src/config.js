const fs = require("fs");
const { getUserHome } = require("./utils");

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
 * @property {string} hook
 * @property {FollowItem[]} following
 */

/**
 * Get configuration file path
 * @returns {string}
 */
function getConfigPath() {
  const configFileName = 'twtxt-cli.json';
  const userHome = getUserHome();
  const configPath = `${userHome}/.config/${configFileName}`
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(`${userHome}/.config/`, { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify({}))
  }
  return configPath;
}

/**
 * Update config file
 * @param {Config} config
 * @returns {void}
 */
function updateConfig(config) {
  const configPath = getConfigPath();
  try {
    return fs.writeFileSync(configPath, JSON.stringify(config))
  } catch (e) {
    throw Error('Error of read config')
  }
}

/**
 * Get actual config
 * @returns {Config}
 */
function getConfig() {
  const configPath = getConfigPath();
  try {
    const file = fs.readFileSync(configPath)
    return JSON.parse(file.toString());
  } catch (e) {
    throw Error('Error of read config')
  }
}

module.exports = {
  updateConfig,
  getConfig,
};
