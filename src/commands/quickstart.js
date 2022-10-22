const fs = require('fs');
const readline = require('readline');
const packageData = require('../../package.json');
const { updateConfig, headOfFeed } = require('../config');
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

  console.log(
    `Hi, ${defaultName}, this is the configuration assistant for twtxt-cli. After a little configuration you will be able to start using this client.`,
  );
  rl.question(`➤ Please enter your desired nick: (${defaultName}) `, (nick) => {
    const defaultLocation = `${defaultHomeDir}/twtxt.txt`;
    rl.question(`➤ Please enter the desired location for your twtxt file: (${defaultLocation}) `, (location) => {
      rl.question('➤ Please enter url where you host your blog: (default: empty) ', (url) => {
        const utilName = `${packageData.name}-${packageData.version}`;
        rl.question(`➤ Please enter description of your blog: (${utilName} enjoyer) `, (description) => {
          rl.question('➤ Please enter url where you host your avatar: (default: empty) ', (avatar) => {
            rl.question('➤ Please enter the command to be executed before publishing: (default: empty) ', (preHook) => {
              rl.question('➤ Please enter the command to be executed after publishing: (default: empty) ', (postHook) => {
                const config = {
                  nick,
                  location,
                  url,
                  description,
                  avatar,
                  pre_hook: preHook,
                  post_hook: postHook,
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
