#!/usr/bin/env node

const { Command } = require('commander');
const packageData = require('../package.json');
const { getConfig } = require('./config');
const { hook, checkUpdates } = require('./utils');
const { quickstart, read, follow, unfollow, publish } = require("./commands");

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
    .description('Follow twtxt feed')
    .argument('<nick>', 'Nick of twtxt user')
    .argument('<url>', 'URL of twtxt blog')
    .action((nick, url) => follow(nick, url));

  program.command('unfollow')
    .description('Unfollow twtxt feed')
    .argument('<nick or url>', 'Nick or url of twtxt user')
    .action((nickOrUrl) => unfollow(nickOrUrl));

  program.command('publish')
    .description('Add new twt')
    .argument('<text...>', 'Text of your twt')
    .action((text) => {
      const config = getConfig();

      publish(text.join(' '))

      if (config.hook) {
        hook(config.hook);
      }
    });

  program.command('read')
    .description('Fetch all following feeds')
    .action(() => read());

  program.parse(process.argv);
}

if (require.main === module) {
  checkUpdates().then(() => {
    cli(process.argv);
  });
}
