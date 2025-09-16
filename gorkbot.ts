import { Client, Events, GatewayIntentBits, Message } from "npm:discord.js";
import * as dotenv from "npm:dotenv";

// Load environment variables
dotenv.config();

// Bot setup with intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// The two responses to randomly choose from
const RESPONSES = [
  "Yeh, nah",
  "Nah, yeh",
];

client.once(Events.ClientReady, (readyClient) => {
  console.log(`${readyClient.user.tag} has connected to Discord!`);
  console.log("Bot is ready to respond to mentions!");
});

client.on(Events.MessageCreate, async (message: Message) => {
  // Don't respond to the bot's own messages
  if (message.author.id === client.user?.id) {
    return;
  }

  // Parse message content for user ID mentions and role mentions
  let botMentioned = false;

  // Check for <@BOT_ID> format (regular mention)
  if (client.user && message.content.includes(`<@${client.user.id}>`)) {
    botMentioned = true;
  }

  // Check for <@!BOT_ID> format (nickname mention)
  if (client.user && message.content.includes(`<@!${client.user.id}>`)) {
    botMentioned = true;
  }

  // Check for role mentions if the message is in a guild (server)
  if (message.guild && !botMentioned && client.user) {
    // Get the bot's member object in this guild
    const botMember = message.guild.members.cache.get(client.user.id);
    if (botMember) {
      // Check each of the bot's roles
      for (const role of botMember.roles.cache.values()) {
        // Check for <@&ROLE_ID> format (role mention)
        if (message.content.includes(`<@&${role.id}>`)) {
          botMentioned = true;
          break;
        }
      }
    }
  }

  if (botMentioned) {
    // Randomly pick one of the two responses
    const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    console.log(`Sending response: ${response}`);
    await message.channel.send(response);
  }
});

// Run the bot
const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.log("Please set the DISCORD_BOT_TOKEN environment variable");
  console.log(
    "You can get a token from https://discord.com/developers/applications",
  );
} else {
  client.login(TOKEN);
}
