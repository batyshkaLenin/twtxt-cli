#!/usr/bin/env node

const { Command } = require('commander');
const packageData = require('../package.json');
const { getConfig } = require('./config');
const { hook, checkUpdates } = require('./utils');
const { quickstart, read, follow, unfollow, publish, following } = require('./commands');

const program = new Command('twtxt-cli');

function cli() {
  program.name(packageData.name).description('CLI for twtxt').version(packageData.version);

  program.command('quickstart').description('a short configuration that will allow you to work with the program').action(quickstart);

  program
    .command('follow')
    .description('follow twtxt feed')
    .argument('<nick>', 'Nick of twtxt user')
    .argument('<url>', 'URL of twtxt blog')
    .action(follow);

  program.command('unfollow').description('unfollow twtxt feed').argument('<nick or url>', 'nick or url of twtxt user').action(unfollow);

  program
    .command('publish')
    .description('add new post in your feed')
    .argument('<text...>', 'text of your twt')
    .hook('preAction', () => {
      const config = getConfig();

      if (config.pre_hook) {
        hook(config.pre_hook);
      }
    })
    .hook('postAction', () => {
      const config = getConfig();

      if (config.post_hook) {
        hook(config.post_hook);
      }
    })
    .action(publish);

  program.command('read').description('fetch all following feeds').action(read);

  program
    .command('following')
    .option('-b, --backfollow', 'display backfollow status')
    .description('list of users you are subscribed')
    .action(following);

  program.parse(process.argv);
}

if (require.main === module) {
  checkUpdates().then(() => {
    cli(process.argv);
  });
}
