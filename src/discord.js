const { MessageEmbed, WebhookClient } = require('discord.js');
const MAX_MESSAGE_LENGTH = 225;

module.exports.send = (id, token, repo, url, commits, size, pusher) => {
  return new Promise((resolve, reject) => {
    let client;
    console.log('Preparing Webhook...');
    try {
      client = new WebhookClient({
        id: id,
        token: token,
      });
      client.send({
        username: 'No Sleep RP',
        embeds: [createEmbed(url, commits, size, pusher)],
      }).then(() => {
        console.log('Successfully sent the message!');
        resolve();
      }, reject);
    } catch (error) {
      console.log('Error creating Webhook');
      reject(error.message);
      return;
    }
  });
};

function createEmbed(url, commits, size, pusher) {
  console.log('Constructing Embed...');
  console.log('Commits:');
  console.log(commits);
  if (!commits) {
    console.log('No commits, skipping...');
    return;
  }
  const latest = commits[0];
  return new MessageEmbed()
    .setColor(0xa970ff)
    .setAuthor({
      name: `🔧 ${pusher} pushed ${size} update${size === 1 ? '' : 's'}`,
      iconURL: `https://github.com/${pusher}.png?size=64`,
      url: 'https://nosleeprp.com/',
    })
    .setDescription(`${getChangeLog(commits, size)}`)
    .setTimestamp();
}

function getChangeLog(commits, size) {
  let changelog = '';
  for (let i = 0; i < commits.length; i++) {
    if (i > 15) {
      changelog += `+ ${size - i} more...\n`;
      break;
    }

    const commit = commits[i];
    const message =
      commit.message.length > MAX_MESSAGE_LENGTH
        ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + '...'
        : commit.message;
    changelog += `• ${message}\n`;
  }

  return changelog;
}