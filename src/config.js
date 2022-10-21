const fs = require("fs");
const { getUserHome, getUserName } = require("./utils");
const packageData = require("../package.json");

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
 * @param {Partial<Config>} config
 * @returns {Config}
 */
function updateConfig(config) {
  const defaults = {
    nick: getUserName(),
    location: `${getUserHome()}/twtxt.txt`,
    url: '',
    pre_hook: '',
    post_hook: 'echo Twt added',
    following: [],
    avatar: '',
    description: '',
  };
  try {
    const configPath = getConfigPath();
    const newConfig = { ...defaults, ...config};
    fs.writeFileSync(configPath, JSON.stringify(newConfig))
    return newConfig
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
${config.following.map(({ nick, url }) => `# follow = ${nick} ${url}`).join('\n')}
#
\n`
}

module.exports = {
  headOfFeed,
  updateConfig,
  getConfig,
};
