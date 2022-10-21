const readline = require('readline');
const { getUserHome, getUserName } = require('../utils');
const fs = require('fs');
const { updateConfig } = require("../config");

/**
 * First configuration app
 * @returns {void}
 */
function quickstart() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const defaultName = getUserName();
  const defaultHomeDir = getUserHome();

  console.log(`Hi, ${defaultName}, this is the configuration assistant for twtxt-cli. After a little configuration you will be able to start using this client.`)
  rl.question(`➤ Please enter your desired nick: (${defaultName}) `, function (customName) {
    const nick = customName || defaultName;
    const defaultLocation = `${defaultHomeDir}/twtxt.txt`;
    rl.question(`➤ Please enter the desired location for your twtxt file: (${defaultLocation}) `, function (customLocation) {
      const location = customLocation || defaultLocation;

      const config = {
        nick,
        location,
        url: '',
        hook: 'echo Twt added',
        following: [],
        avatar: '',
        description: '',
      };

      if (!fs.existsSync(location)) {
        fs.writeFileSync(location, JSON.stringify(''))
      }

      updateConfig(config);
      console.log('✓ Congrats! Configuration successfully completed!');
      rl.close();
    })
  })
}

module.exports = quickstart;
