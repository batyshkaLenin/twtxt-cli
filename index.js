const { Command } = require('commander');
const readline = require('readline');
const fs = require('fs');
const packageData = require('./package.json');
const moment = require('moment/moment');
const childProcess = require('child_process');
const Promise = require('bluebird');
const axios = require("axios");

function hook(command) {
  childProcess.exec(command, function (error, stdout) {
    if (error) {
      console.error(error.stack);
      console.error(`Error code: ${error.code}`);
      console.error(`Signal received: ${error.signal}`);
    }
    console.log(stdout);
  });
}

/**
 * Get username
 * @returns {string}
 */
function getUserName() {
  return process.env.USER;
}

/**
 * Get user home directory
 * @returns {string}
 */
function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

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

function parseTimeline(txt) {
  const splittedTimeline = txt.split('\n').filter(str => str[0] !== '#');
  const timeline = splittedTimeline.map(i => i.split('\t')).filter(i => i.length === 2);
  return timeline.map(i => ({ text: i[1], date: moment(i[0]) }))
}

function getCurrentTimeline() {
  const config = getConfig();
  const currentTimelineText = fs.readFileSync(config.location).toString();
  return parseTimeline(currentTimelineText)
}

function publish(text) {
  const MAX_CHARS = 140;

  if (!text) throw Error('Empty message')

  if (text.length > MAX_CHARS) throw Error('Too long message')

  const config = getConfig();

  const timeline = getCurrentTimeline();
  timeline.push({
    text,
    date: moment(),
  });

  const newTimeline = timeline
    .sort((a, b) => b.date - a.date)
    .map(({ date, text }, index) => `${date.format()}\t${text}${timeline.length - 1 !== index ? '\n' : ''}`)
    .join('');

  const utilName = `${packageData.name}-${packageData.version}`;
  const meta = `# Created with ${utilName}
#
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
  fs.writeFileSync(config.location, Buffer.from(`${meta}${newTimeline}`));
}

async function getFeed() {
  const config = getConfig();

  const following = config.following;

  const feed = (await Promise.map(following, async ({ nick, url }) => {
    const result = await axios.get(url);
    return parseTimeline(result.data).map(i => ({ ...i, nick }))
  })).flatMap(i => (i));

  const sortedFeed = feed.sort((a, b) => b.date - a.date);
  console.log(sortedFeed.map(i => `${i.nick}\t${i.date.format()}\t${i.text}`).join('\n'))
}

function follow(nick, url) {
  const config = getConfig();

  const current = config.following.find(item => item.url === url);

  if (current) {
    console.log(`You are already following to ${current.nick}`)
  } else {
    const following = config.following;
    following.push({ nick, url });
    updateConfig({ ...config, following });
  }
}

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
    .action(() => getFeed());

  program.parse(process.argv);
}

if (require.main === module) {
  cli(process.argv);
}
