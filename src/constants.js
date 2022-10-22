const {
  getUserName,
  getUserHome,
} = require('./utils');

/**
 * RegExp for url checking
 * @type {RegExp}
 */
const LINK_REGEXP = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

/**
 * Default configs
 * @type {Config}
 */
const CONFIG_DEFAULTS = {
  nick: getUserName(),
  location: `${getUserHome()}/twtxt.txt`,
  url: '',
  pre_hook: '',
  post_hook: 'echo Twt added',
  following: [],
  avatar: '',
  description: '',
};

module.exports = {
  LINK_REGEXP,
  CONFIG_DEFAULTS,
};
