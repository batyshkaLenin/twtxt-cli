const fs = require('fs');
const readline = require('readline');
const packageData = require('../../package.json');
const { updateConfig, headOfFeed,
  getConfig
} = require('../config');
const { getUserHome, getUserName } = require('../utils');

/**
 * First configuration app
 * @returns {void}
 */
function quickstart() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const defaultName = getUserName();
  const defaultHomeDir = getUserHome();

  const current = getConfig();

  console.log(
    `Hi, ${current.nick || defaultName}, this is the configuration assistant for twtxt-cli. After a little configuration you will be able to start using this client.`,
  );
  rl.question(`➤ Please enter your desired nick: (${current.nick || defaultName}) `, (nick) => {
    const defaultLocation = current.location || `${defaultHomeDir}/twtxt.txt`;
    rl.question(`➤ Please enter the desired location for your twtxt file: (${defaultLocation}) `, (location) => {
      rl.question(`➤ Please enter url where you host your blog: (${current.url || 'default: empty'}) `, (url) => {
        const utilName = `${packageData.name}-${packageData.version}`;
        rl.question(`➤ Please enter description of your blog: (${current.description || `${utilName} enjoyer`}) `, (description) => {
          rl.question(`➤ Please enter url where you host your avatar: (${current.avatar || 'default: empty'}) `, (avatar) => {
            rl.question(`➤ Please enter the command to be executed before publishing: (${current.pre_hook || 'default: empty'}) `, (preHook) => {
              rl.question(`➤ Please enter the command to be executed after publishing: (${current.post_hook || 'default: empty'}) `, (postHook) => {
                const config = {
                  nick: nick || current.nick,
                  location: location || current.location,
                  url: url || current.url,
                  description: description || current.description,
                  avatar: avatar || current.avatar,
                  pre_hook: preHook || current.pre_hook,
                  post_hook: postHook || current.post_hook,
                };

                const newConfig = updateConfig(config);

                if (!fs.existsSync(newConfig.location)) {
                  fs.writeFileSync(newConfig.location, headOfFeed());
                }
                console.log('✓ Congrats! Configuration successfully completed!');
                rl.close();
              });
            });
          });
        });
      });
    });
  });
}

module.exports = quickstart;
