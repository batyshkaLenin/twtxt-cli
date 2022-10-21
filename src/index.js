const { Command } = require('commander');
const packageData = require('../package.json');
const { getConfig } = require('./config');
const { hook } = require('./utils');
const { quickstart, read, follow, publish } = require("./commands");

const program = new Command();

function cli() {
  program
    .name(packageData.name)
    .description('CLI for twtxt')
    .version(packageData.version);

  program.command('quickstart')
    .description('A short configuration that will allow you to work with the program')
    .action(quickstart);

  program.command('follow')
    .argument('<nick>', 'Nick of twtxt user')
    .argument('<url>', 'URL of twtxt blog')
    .action((nick, url) => follow(nick, url));

  program.command('publish')
    .argument('<text...>', 'Text of your twt')
    .description('Add new twt')
    .action((text) => {
      const config = getConfig();

      publish(text.join(' '))

      if (config.hook) {
        hook(config.hook);
      }
    });

  program.command('read')
    .action(() => read());

  program.parse(process.argv);
}

if (require.main === module) {
  cli(process.argv);
}
