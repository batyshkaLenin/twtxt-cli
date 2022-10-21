const fs = require("fs");
const { getUserHome } = require("./utils");

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

function updateConfig(config) {
  const configPath = getConfigPath();
  try {
    return fs.writeFileSync(configPath, JSON.stringify(config))
  } catch (e) {
    throw Error('Error of read config')
  }
}

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
