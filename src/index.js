#!/usr/bin/env node

const { Command } = require('commander');
const packageData = require('../package.json');
const { getConfig } = require('./config');
const { hook, checkUpdates } = require('./utils');
const { quickstart, read, follow, unfollow, publish, following } = require("./commands");

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
    .action(follow);

  program.command('unfollow')
    .description('Unfollow twtxt feed')
    .argument('<nick or url>', 'Nick or url of twtxt user')
    .action(unfollow);

  program.command('publish')
    .description('Add new twt')
    .argument('<text...>', 'Text of your twt')
    .action((text) => {
      const config = getConfig();

      if (config.pre_hook) {
        hook(config.pre_hook);
      }

      publish(text.join(' '))

      if (config.post_hook) {
        hook(config.post_hook);
      }
    });

  program.command('read')
    .description('Fetch all following feeds')
    .action(read);

  program.command('following')
    .option('-b, --backfollow', 'display backfollow status')
    .description('List of users you are subscribed')
    .action(following);

  program.parse(process.argv);
}

if (require.main === module) {
  checkUpdates().then(() => {
    cli(process.argv);
  });
}
